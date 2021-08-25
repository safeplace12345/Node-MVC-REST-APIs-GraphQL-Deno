const getLogin = (req, res, next) => {
    //Retrieve cookies
    // req.isLoggedin = (req.get('Cookie').split('=')[1]) === 'true'
    // Retrieve a session
    // req.session.isLoggedin
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        userName: "Undefined",
        isAuthenticated: req.session.isLoggedin,
    });
};
const postLogin = (req, res, next) => {
    // create a session on login
    req.session.isLoggedin = true;

    // cookie options :
    // res.setHeader('Set-Cookie',"isLoggedin=true")
    // Secure --> For https protocol only
    // HttpOnly --> For http protocol only and cookies not read from clientside js
    // Max-Age = number--> For duration , always mesured in seconds
    // Expires = date --> For duration , always mesured in a standard http date pattern
    res.redirect("/login");
};

module.exports = {
    getLogin,
    postLogin,
};
