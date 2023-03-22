// The hostname on which this node server should run
const hostname = "127.0.0.1";

// The port number on which this node server should run
const port = 3001;

// MongoDB Connection String; should be formatted as mongodb://<server>:<port>/<collection>
const dbString = "mongodb://localhost:27017/scoreboard";

// CORS - domains allowed to make requests to this server; used as value for Access-Control-Allow-Origin header
const allowedOrigin = "*";

// NBA game data feed
const nbaFeed = "https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json";

// MLB game data feed
const mlbFeed = "https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json";

export { hostname, port, dbString, allowedOrigin, nbaFeed, mlbFeed };
