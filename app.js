const http = require('http');
// import http from 'http'
const { connectDb, getDb } = require('./db');

// Database connection
let db;
connectDb((error) => {
  if (!error) {
    db = getDb();
    //TODO - Start Server...
  }
})

const hostname = '127.0.0.1';
const port = 3001;
let lastFetch = 0;

const server = http.createServer((req, res) => {

  let gameData = {};
  const now = Date.now();

  // If it has been 15 seconds since the last data fetch, refresh the data from the API
  if (lastFetch + 15000 <= now) getFreshData(res);
  else getCachedData(res);

});

function getFreshData(res) {
  const url = "https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json";
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      let gameData = data;
      gameData.fetched = lastFetch = Date.now();

      db.collection('games').replaceOne({league: "MLB"}, gameData)
      .then((result) => {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(gameData));
      })
    })
}

function getCachedData(res) {
  db.collection('games').findOne({league: "MLB"})
  .then(game => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(game));
  })
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});