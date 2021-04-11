const express = require("express");
const server = express();
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Body parser
server.use(bodyParser.urlencoded({ extended: false }));

server.use((req, res, next) => {
  console.log("First Middleware..");
  next(); // Always use it if you need to travel through middleware
});
server.use("/admin", adminRoutes);
server.use(shopRoutes);
server.use((req, res) => {
  res.status(404).send(`<h4>Page Not found</h4>`);
});
server.listen(3000);
