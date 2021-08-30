const bcrypt = require("bcryptjs");

const User = require("../models/users");

const getLogin = (req, res, next) => {
    //Retrieve cookies
    // req.isLoggedin = (req.get('Cookie').split('=')[1]) === 'true'
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        userName: "",
        errorMsg : req.flash("error")[0]
    });
};
const postLogout = (req, res, next) => {
    return req.session.destroy((err) => {
        if (err) return console.log({ err });
        return res.redirect("/clients/");
    });
};
const postLogin = async (req, res, next) => {
    const { email, pwd } = JSON.parse(JSON.stringify(req.body));

    return await User.find({ email })
        .exec()
        .then((user) => {
            // Retrive user from DB
            //Returns an array
            if (!user[0]) {
                req.flash("error" , "Invalid username or password")
                return res.redirect("/login");
            }
            return user[0];
        })
        .then((user) => {
            // Validate user
            return bcrypt
                .compare(pwd, user.pwd)
                .then((doMatch) => {
                    // if passwords match
                    if (doMatch) {
                        // Mount user to the session
                        req.session.user = user;
                        // create a session on login
                        req.session.isLoggedin = true;
                        return req.session.save(() => {
                            return res.redirect("/clients");
                        });
                    }
                    req.flash("error" , "Invalid username or password")
                    return res.redirect("/login");
                })
                .catch((err) => console.log({ invalidPwd: err }));
        })
        .catch((err) => {
            console.log({ userNotFound: err });
            return res.redirect("/login");
        });
};
const getSignup = async (req, res, next) => {
    return res.render("auth/signup", {
        pageTitle: "Signup",
        path: "/signup",
        errorMsg : req.flash("error")[0]
    });
};
const postSignup = async (req, res, next) => {
    const { email, password, confirmPassword } = JSON.parse(
        JSON.stringify(req.body)
    );
    //  Check for existing user
    return User.findOne({ email })
        .then((userDoc) => {
            if (userDoc) {
                req.flash("error" , "Error user already exists")
                return res.redirect("/signup");
            }
            // encrypt password for new user
            return bcrypt
                .hash(password, 12)
                .then((hashedPwd) => {
                    let user = new User({
                        email,
                        pwd: hashedPwd,
                        address: "China",
                        cart: [],
                    });
                    return user.save();
                })
                .then((result) => {
                    return res.redirect("/login");
                })
                .catch((err) => console.log({ err }));
        })
        .catch((err) => {
            console.log({ err });
            return res.redirect("/signup");
        });
};
module.exports = {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
};

// cookie options :
// res.setHeader('Set-Cookie',"isLoggedin=true")
// Secure --> For https protocol only
// HttpOnly --> For http protocol only and cookies not read from clientside js
// Max-Age = number--> For duration , always mesured in seconds
// Expires = date --> For duration , always mesured in a standard http date pattern
