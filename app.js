const http = require('http');

const hostname = '127.0.0.1';
const port = 3001;
const server = http.createServer((req, res) => {

let gameData = {};

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
    gameData = data;
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(gameData));
    // res.end(JSON.stringify(testData));
  })

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});