const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require('path')

const rootDir = require('./utils/path')
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

server.set('view engine' , 'ejs');
server.set('views', 'views')
// Body parser
server.use(bodyParser.urlencoded({ extended: false }));
// Static files( css,js,images) middleware
server.use(express.static(path.join(rootDir, 'public')));
 // Routing
server.use("/admin", adminRoutes.router);
server.use(shopRoutes);
server.use((req, res) => {
  res.status(404).render('404',{pageTitle:'Page Not Found'})
});

// Listener
server.listen(3000);
