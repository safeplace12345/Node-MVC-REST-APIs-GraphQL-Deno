const express = require('express')
const router = express.Router();

// All redirect to /admin/...
router.get("/add-product", (req, res, next) => {
  res.send(
    "<html><body><form action='/admin/products' method='POST'><input type='text' name='title'/><button type='submit'>Send</button></form>"
  );
});
router.post("/products", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;