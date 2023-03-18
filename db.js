// import { MongoClient } from 'mongodb'
const { MongoClient } = require('mongodb');

let dbConnection;

module.exports = {
    connectDb: (callback) => {
        MongoClient.connect('mongodb://localhost:27017/scoreboard')
            .then((client) => {
                dbConnection = client.db()
                return callback()
            })
            .catch(error => {
                console.error(error)
                return callback(error)
            })
    },
    getDb: () => dbConnection
}