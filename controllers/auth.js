const getLogin = (req, res, next) => {
    //Retrieve cookies
    req.isLoggedin = (req.get('Cookie').split('=')[1])
    res.render('auth/login',{
        path : '/login',
        pageTitle : "Login",
        userName : "Undefined",
        isAuthenticated : req.isLoggedin
    })
};
const postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie',"isLoggedin=true")
    res.redirect("/login")
};

module.exports = {
    getLogin,postLogin
}