const { LocalStorage } = require("node-localstorage");

const localStorage = new LocalStorage("./scratch");

const userName = localStorage.getItem("userName");

const get404Page = (req, res) => {
    res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
        userName,
    });
};
module.exports = {
    get404Page,
};
