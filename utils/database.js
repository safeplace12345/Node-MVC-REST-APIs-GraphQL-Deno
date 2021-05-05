const mysql = require('mysql2')

const pool = mysql.createPool({
  host: "localhost",
  user : 'root',
  database : 'node-tut',
  password : '@selassie123'
});


module.exports = pool.promise()
