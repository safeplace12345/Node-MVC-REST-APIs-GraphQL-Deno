const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require("path");
const { LocalStorage } = require("node-localstorage");

const localStorage = new LocalStorage("./scratch");

const rootDir = require("./utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorControllers = require("./controllers/error");
// const db = require('./utils/database')

const { mongoConnect, getDb } = require("./utils/database");

const userMidWare = async (req, res, next) => {
    // get username if it exists on the query already
    if (req.query.name) {
        let userCreds = req.query.name;
        //Trim query for userName
        const strLength = userCreds.length;
        userCreds =
            userCreds.substr(0, 1).toUpperCase() +
            userCreds.substr(1, strLength - 1);
        // Validate user
        let _db = await getDb().collection("users");
        const user = await _db.findOne({ name: userCreds });
        // attach user Object to body params
        req.body.user = user;
        // set userName in the localstorage
        if (localStorage) {
            localStorage.setItem("userName", user.name);
        }
    }
    return next();
};
server.set("view engine", "ejs");
server.set("views", "views");
// Body parser
server.use(bodyParser.urlencoded({ extended: false }));

// Static files( css,js,images) middleware
server.use(express.static(path.join(rootDir, "public")));
// Routing
server.use("/admin", adminRoutes.router);
server.use("/clients", userMidWare, shopRoutes);
server.use(errorControllers.get404Page);
// Listener
mongoConnect((client) => {
    server.listen(3000, () => console.log("start"));
});
