import { MongoClient } from "mongodb";
import { dbString } from "./config.js";

let dbConnection;

const connectDb = (callback) => {
  MongoClient.connect(dbString)
    .then((client) => {
      dbConnection = client.db();
      return callback();
    })
    .catch((error) => {
      console.error(error);
      return callback(error);
    });
};

const getDb = () => {
  return dbConnection;
};

export { connectDb, getDb };
