const express = require("express");
const server = express();

server.use((req, res, next) => {
  console.log("First Middleware..");
  next();
});
server.use((req, res, next) => {
  console.log("Second Middleware..");
  res.send("<h1>Hello from Express Middleware</h1>");
});
server.listen(3000);
