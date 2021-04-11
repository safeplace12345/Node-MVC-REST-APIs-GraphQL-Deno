const express = require("express");
const server = express();
const bodyParser = require('body-parser')

server.use(bodyParser.urlencoded({extended: false}))

server.use((req, res, next) => {
    // This will always run because it got no path
  console.log("First Middleware..");
  next(); // Always use it if you need to travel through middleware
});
server.use('/add-product',(req, res, next) => {
    res.send("<html><body><form action='/products' method='POST'><input type='text' name='title'/><button type='submit'>Send</button></form>");
});
server.use('/products',(req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});
server.use('/',(req, res, next) => {
  res.send("<h1>Hello from Express Middleware</h1>");
});
server.listen(3000);
