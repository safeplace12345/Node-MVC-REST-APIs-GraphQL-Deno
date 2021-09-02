const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const sendGridTransporter = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const User = require("../models/users");
//validator
const { validationResult } = require("express-validator/check");

// Mailer machine with sendgrid.com
const transporter = nodeMailer.createTransport(
    sendGridTransporter({
        auth: {
            api_key:
                "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",
        },
    })
);

// Controllers
const getLogin = (req, res, next) => {
    const oldInput = {email : "", pwd : ""}
    const validationErrParams = []
    //Retrieve cookies
    // req.isLoggedin = (req.get('Cookie').split('=')[1]) === 'true'
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        userName: "",
        errorMsg: req.flash("error")[0],
        oldInput,
        validationErrParams
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

    const oldInput = {email , pwd}

    const errors = validationResult(req);

        const validationErrParams = []
    if (errors.isEmpty()) {

        return await User.findOne({ email })
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
                        req.flash("error", "Invalid username or password");
                        res.status(422).render("auth/login", {
                            path: "/login",
                            pageTitle: "Login",
                            userName: "",
                            errorMsg: req.flash("error")[0],
                            oldInput,
                            validationErrParams
                        });
                    })
                    .catch((err) => console.log({ invalidPwd: err }));
            })
            .catch((err) => {
                console.log({ userNotFound: err });
                return res.status(422).render("auth/login", {
                    path: "/login",
                    pageTitle: "Login",
                    userName: "",
                    errorMsg: req.flash("error")[0],
                    oldInput,
                    validationErrParams
                });
            });
    } else {
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            userName: "",
            errorMsg: errors.array()[0].msg,
            oldInput,
            validationErrParams
        });
    }
};
const getSignup = async (req, res, next) => {
    return res.render("auth/signup", {
        pageTitle: "Signup",
        path: "/signup",
        errorMsg: req.flash("error")[0],
        validationErrParams:[],
        /**
         * For better UI only
         */
        oldInput: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
};
const postSignup = async (req, res, next) => {
    const { email, password, confirmPassword } = JSON.parse(
        JSON.stringify(req.body)
    );
    // validate
    const errors = validationResult(req);

    const validationErrParams = errors.array().map((e) => e.param)
    if (!errors.isEmpty()) {
        console.log(errors.array().map((e) => e.param));
        return res.status(422).render("auth/signup", {
            pageTitle: "Signup",
            path: "/signup",
            errorMsg: errors.array()[0].msg,
            /**
             * For better UI only
             */
            oldInput: {
                email,
                password,
                confirmPassword,
            },
            validationErrParams
        });
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
            res.redirect("/login");
            // send email
            return transporter
                .sendMail({
                    to: email.trim(),
                    from: "safeplace12345@gmail.com",
                    subject: "Signup was succesfully done",
                    html: `<h1>Welcome to our node shop tutorials.</h1><br><h4>Checkout your Home page <a href="http://localhost:8000/login">here</a></h4>`,
                })
                .catch((err) => {
                    console.log({ err });
                });
        })
        .catch((err) => console.log({ err }));
};
const getFgtPassword = async (req, res, next) => {
    res.render("auth/forgot-password", {
        pageTitle: "Forgot password",
        path: "/forgot-passowrd",
        errorMsg: req.flash("error")[0],
    });
};
const postFgtPassword = async (req, res, next) => {
    const { email } = JSON.parse(JSON.stringify(req.body));

    const buffer = await crypto.randomBytes(16);

    const token = await buffer.toString("hex");

    const user = await User.findOne({ email });
    if (!user) {
        req.flash("error", "User not Found");
        res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000;
    return await user.save(function (err, user) {
        if (err) throw new Error("User failed to be saved", +err);
        res.redirect("/login");
        return transporter
            .sendMail({
                to: email.trim(),
                from: "safeplace12345@gmail.com",
                subject: "Signup was succesfully done",
                html: `<p>Password reset request was succesfull</p>
            <p>Follow the link to proceed with reseting <a href="http://localhost:8000/reset/${token}">Here</a></p>`,
            })
            .catch((err) => console.log({ err }));
    });
};
const getReset = (req, res, next) => {
    const token = req.params.token;

    return User.findOne({
        resetToken: token,
        resetTokenExp: { $gt: Date.now() },
    })
        .then((user) => {
            res.render("auth/reset", {
                pageTitle: "Reset",
                path: "/reset",
                errorMsg: req.flash("error")[0],
                userID: user._id.toString(),
            });
        })
        .catch((err) => console.log({ err }));
};
const postReset = async (req, res, next) => {
    const { userID, pwd } = JSON.parse(JSON.stringify(req.body));

    const user = await User.findOne({ _id: userID });
    if (!user) {
        req.flash(
            "error",
            "Sorry your token has expired , try reseting steps again"
        );
        return res.redirect("/forgot-password");
    }
    const hashedPwd = await bcrypt.hash(pwd, 12);
    user.resetToken = null;
    user.resetTokenExp = undefined;
    user.pwd = hashedPwd;
    return await user.save(function (err, user) {
        if (err) {
            req.flash("error", "Could not save new password , Retry");
            return res.redirect("/forgor-password");
        }
        res.redirect("/login");
    });
};

module.exports = {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getFgtPassword,
    postFgtPassword,
    getReset,
    postReset,
};

// cookie options :
// res.setHeader('Set-Cookie',"isLoggedin=true")
// Secure --> For https protocol only
// HttpOnly --> For http protocol only and cookies not read from clientside js
// Max-Age = number--> For duration , always mesured in seconds
// Expires = date --> For duration , always mesured in a standard http date pattern
