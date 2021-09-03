const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { LocalStorage } = require("node-localstorage");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const rootDir = require("./utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorRoutes = require("./routes/errors");
const User = require("./models/users");

// Session store on mongodb

const MONGO_URI =
    "mongodb+srv://ghostxp:selassie123@ghost-db.9i0m7.mongodb.net/bookShop?retryWrites=true&w=majority";

const store = new MongoDBStore({
    uri: MONGO_URI, // conn url
    collection: "sessions", // collection name
});

// Requests security
const crsfProtection = csrf();

// Main server
const server = express();

// views
server.set("view engine", "ejs");
server.set("views", "views");

//              Middleware
// Body parser
server.use(bodyParser.urlencoded({ extended: false }));
// Static files( css,js,images) middleware
server.use(express.static(path.join(rootDir, "public")));
// sessions
server.use(
    session({
        secret: "qwerty",
        resave: false,
        saveUninitialized: false,
        store,
    })
);
// Security
// crud ops security
server.use(crsfProtection);
// user auth errors
server.use(flash());
// Local vars for each response
server.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedin;
    res.locals.csrfToken = req.csrfToken();
    res.locals.validationErrParams = [];
    next();
});
// User session authentication
server.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    return User.findById(req.session.user._id)
        .then((user) => {
            if (!user) return next();
            req.user = user;
            return next();
        })
        .catch((err) => {
            throw new Error(err);
        });
});

// Routing
server.use("/admin", adminRoutes.router);
server.use("/clients", shopRoutes);
server.use(authRoutes);

// 404 error handler
server.use(errorRoutes);

// 505 error handler
server.use((error , req ,res ,next) => {
    console.log(error)
    res.redirect("/500")
})

// Listener
mongoose
    .connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((res) =>
        server.listen(8000, () => console.log("Connection succesfully :)"))
    )
    .catch((err) => console.log("Connection failed :("));
