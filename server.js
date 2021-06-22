const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require('path')

const rootDir = require('./utils/path')
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorControllers = require('./controllers/error')
const db = require('./utils/database')


const {mongoConnect} = require('./utils/database')
server.set('view engine' , 'ejs');
server.set('views', 'views')
// Body parser
server.use(bodyParser.urlencoded({ extended: false }));
// Static files( css,js,images) middleware
server.use(express.static(path.join(rootDir, 'public')));
 // Routing
server.use("/admin", adminRoutes.router);
// server.use(shopRoutes);
// server.use(errorControllers.get404Page);
// Listener
mongoConnect((client) => {
  return server.listen(3000);
});
