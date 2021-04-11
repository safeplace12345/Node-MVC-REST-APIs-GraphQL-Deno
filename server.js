const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require('path')

const rootDir = require('./utils/path')
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Body parser
server.use(bodyParser.urlencoded({ extended: false }));
// Static files( css,js,images) middleware
server.use(express.static(path.join(rootDir, 'public')));
 // Routing
server.use("/admin", adminRoutes);
server.use(shopRoutes);
server.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir , 'views' , '404.html'));
});

// Listener
server.listen(3000);
