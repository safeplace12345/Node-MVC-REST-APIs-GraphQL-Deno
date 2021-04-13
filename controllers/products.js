const products = [];
const getAddProductsPage = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add-Product",
    path: "/admin/add-product",
  });
};

const getProductsPage = (req, res, next) => {
  const product = JSON.parse(JSON.stringify(req.body));
  products.push(product);
  res.redirect("/");
};

module.exports={
getAddProductsPage,
getProductsPage,
products
}