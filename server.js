const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require("path");
const { LocalStorage } = require("node-localstorage");
const mongoose = require("mongoose");
const localStorage = new LocalStorage("./scratch");

const rootDir = require("./utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorControllers = require("./controllers/error");
const authRoutes = require("./routes/auth");

const User = require("./models/users");

const userMidWare = async (req, res, next) => {
    // get username if it exists on the query already
    let userCreds = "name=chris"
    if (req.query.name) {
        let userCreds = req.query.name;
    }    //Trim query for userName
        const strLength = userCreds.length;
        userCreds =
            userCreds.substr(0, 1).toUpperCase() +
            userCreds.substr(1, strLength - 1);
        // Create user


        return await User.findById("611cf85da8861d6014ea6142")
            .then((user) => {
                // Validate user
                if (!user) {
                    let user = new User({
                        name: userCreds,
                        email: userCreds + "@gmail.com",
                        address: "U.S.A",
                        cart: [],
                    });
                    return user.save();
                }
            })
            .then((result) => {
               return User.findById("611cf85da8861d6014ea6142").then((user) => {
                    req.user = user;
                    if (localStorage) {
                        localStorage.setItem("userName", user.name);
                        return next();
                    }
                    return next();
                });
            });

};
server.set("view engine", "ejs");
server.set("views", "views");
// Body parser
server.use(bodyParser.urlencoded({ extended: false }));

// Static files( css,js,images) middleware
server.use(express.static(path.join(rootDir, "public")));
// Routing
server.use("/admin", userMidWare, adminRoutes.router);
server.use("/clients", userMidWare, shopRoutes);
server.use(authRoutes);
server.use(errorControllers.get404Page);
// Listener
mongoose
    .connect(
        "mongodb+srv://ghostxp:selassie123@ghost-db.9i0m7.mongodb.net/bookShop?retryWrites=true&w=majority",
        { useUnifiedTopology: true, useNewUrlParser: true }
    )
    .then((res) =>
        server.listen(8000, () => console.log("Connection succesfully :)"))
    )
    .catch((err) => console.log("Connection failed :("));
