import { createServer } from "http";
import { parse } from "url";
import { hostname, port, allowedOrigin, nbaFeed, mlbFeed } from "./config.js";
import { connectDb, getDb } from "./db.js";
let feeds = { MLB: mlbFeed, NBA: nbaFeed };

// Set up database connection
let db;
connectDb((error) => {
  if (!error) {
    db = getDb();
    initServer();
  }
});

// Initialize the server
const initServer = () => {
  const server = createServer((req, res) => {
    const reqUrl = parse(req.url).pathname;
    let league;

    // When a request arrives, first check which league was requested based on the URL
    // Switch statement extensible if additional URLs are added
    switch (reqUrl) {
      case "/mlb":
        league = "MLB";
        break;
      case "/nba":
        league = "NBA";
        break;
      default:
        league = "MLB";
    }

    // Check the database for game data
    getCachedData(res, league);
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

// Get fresh data from live game data feed, store/refresh it in the database, and return the data
const getFreshData = (res, league) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };
  const feedUrl = feeds[league];
  fetch(feedUrl, options)
    .then((response) => response.json())
    .then((data) => {
      let gameData = data;
      gameData.fetched = Date.now(); // Add a timestamp to the data, which we can check upon subsequent requests
      // Check if there's already a record in the database
      db.collection("games")
        .count({ league: league })
        .then((result) => {
          if (result) {
            // Document already exists, update it
            db.collection("games")
              .replaceOne({ league: league }, gameData)
              .then((result) => returnGameData(res, gameData))
              .catch((error) => {
                console.error(error);
                returnGameData(res, gameData);
              });
          } else {
            // Document does not exist, create one
            db.collection("games")
              .insertOne(gameData)
              .then((result) => returnGameData(res, gameData))
              .catch((error) => {
                console.error(error);
                returnGameData(res, gameData);
              });
          }
        })
        .catch((error) => {
          console.error(error);
          returnGameData(res, gameData);
        });
    })
    .catch((error) => {
      console.error(error);
      returnError(res, "Could not fetch game data.");
    });
};

// Get cached data from database and check the timestamp
const getCachedData = (res, league) => {
  const now = Date.now();
  db.collection("games")
    .findOne({ league: league })
    .then((game) => {
      if (game.fetched > now - 15000)
        returnGameData(res, game); // Return the saved data if within 15 seconds
      else getFreshData(res, league); // Otherwise, fetch new data
    })
    .catch((error) => {
      console.error(error);
      returnError(res, "Could not load game data.");
    });
};

// Return the response
const returnGameData = (res, data) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

// Return an error message
const returnError = (res, error) => {
  res.statusCode = 500;
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: error }));
};
