const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { LocalStorage } = require("node-localstorage");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer")

const rootDir = require("./utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorRoutes = require("./routes/errors");
const User = require("./models/users");

// Multer uploader && dowloader config
const multerConfig = {
    store : multer.diskStorage({
        destination : (req, file , cb) => {
            return cb(null , "images")
        },
        filename : (req , file ,cb) => {
            let name = file.originalname.split(".")[0] + "-" + Math.random()*16 + "." +file.mimetype.split("/")[1]
            return cb(null, name)
        }
    }),
    fileFilter  : (req ,file , cb) => {
        if(file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
            return cb(null , true)
        }else{
            return cb(null , false)
        }
    }
}
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
// file parse
server.use(multer({storage : multerConfig.store , fileFilter : multerConfig.fileFilter}).single("image"))

// Static files( css,js,images) middleware
server.use(express.static(path.join(rootDir, "public")));
// images route
server.use("/images",express.static(path.join(rootDir, "images")));


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
