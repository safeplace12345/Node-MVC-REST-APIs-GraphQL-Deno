// const mysql = require('mysql2')

// const pool = mysql.createPool({
//   host: "localhost",
//   user : 'root',
//   database : 'node-tut',
//   password : '@selassie123'
// });

// module.exports = pool.promise()

const mongodb = require("mongodb");

const { MongoClient } = mongodb;

// init database

let _db;

// connect our backend to the database
const mongoConnect = async (callback) =>
  MongoClient.connect(
    "mongodb+srv://ghostxp:selassie123@ghost-db.9i0m7.mongodb.net/bookShop?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
    .then((client) => {
      console.log("connection to mongodb was successful : )");
      _db = client.db();
      return callback(_db)
    })
    .catch((err) => console.log("connection to mongodb was successful : )"));

// create a connection to the database client if any
const getDb = () => {
  if(_db){
    return _db
  }
}

module.exports = { mongoConnect, getDb };
