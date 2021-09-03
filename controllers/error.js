

const get404Page = (req, res) => {
    res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
        isAuthenticated: req.session.isLoggedin,
    });
};
const get500Page = (req, res) => {
    res.status(500).render("500", {
        pageTitle: "Error Occured",
        path: "/500",
        errorMsg : req.flash("error")[0],
        isAuthenticated: req.session.isLoggedin,
    });
};
module.exports = {
    get404Page,
    get500Page
};
