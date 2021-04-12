const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require("path");

const rootDir = require("./utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// Registering handleBars

const expressHbs = require("express-handlebars");
const { mainModule } = require("process");

server.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "main.hbs",
    extname: "hbs",
  })
);
// Body parser
server.use(bodyParser.urlencoded({ extended: false }));

// Dynamic content with  Pug . :: Note : Do not import or require after installation

server.set("view engine", "hbs");
server.set("views", "views");
// Static files( css,js,images) middleware
server.use(express.static(path.join(rootDir, "public")));
// Routing
server.use("/admin", adminRoutes.router);
server.use(shopRoutes);
server.use((req, res) => {
  res.status(404).render("404", { pageTitle: "Page Not Found " });
});

// Listener
server.listen(3000);
