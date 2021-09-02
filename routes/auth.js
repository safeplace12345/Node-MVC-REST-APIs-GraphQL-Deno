const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
//validator
const { check, body, param, query } = require("express-validator/check");

const User = require("../models/users");
router.get("/login", authController.getLogin);

router.post(
    "/login",
    [
        check("email")
            .isEmail()
            .withMessage("Invalid email address , Try again")
            .custom((value, { req }) => {
                return User.findOne({ email : value }).then((user) => {

                    if (!user) return Promise.reject("Sorry User not Found");
                    return Promise.resolve();
                });
            }).normalizeEmail(),
        body(
            "pwd", // same as withMessage func
            "Please enter a password 6 characters long with only alpha numerics"
        )
            .isLength({ min: 6 })
            .isAlphanumeric()
            //sanitizer
            .trim(),
    ],
    authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            //sanitizer
            .normalizeEmail()
            //custom validator
            .custom(async (value, { req }) => {
                if (value === "test@test.com") {
                    throw new Error("This email is forbidden");
                }
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject("Error user already exists");
                }
                return true;
            }),
        body(
            "password",
            // same as withMessage func
            "Please enter a password 6 characters long with only alpha numerics"
        )
            .isAlphanumeric()
            .isLength({ min: 6 }).trim(),
        check("confirmPassword", "Passwords must match").custom(
            (val, { req }) => {
                if (val !== req.body.password) {
                    throw new Error(" Passwords must match");
                }
                return true;
            }
        ).trim(),
    ],
    authController.postSignup
);

router.get("/forgot-password", authController.getFgtPassword);

router.post("/forgot-password", authController.postFgtPassword);

router.get("/reset/:token", authController.getReset);

router.post("/reset", authController.postReset);

module.exports = router;
