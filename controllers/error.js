const get404Page = (req, res) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
};
module.exports = {
    get404Page
}