const fs = require("fs");
const path = require("path");

const readProductsFile = (cb) => {
  return fs.readFile(file, "utf-8", (err, content) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(content));
  });
};

const fetchAllProducts = (cb) => {
  return readProductsFile(cb);
};
const fetchProduct = (productId, cb) => {
  let product = {};
  return readProductsFile((products) => {
    product = products.find(({id}) => id === productId);
    return cb(product)
  });
};
const file = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

class Product {
  constructor({ title, image, price, description }) {
    (this.title = title),
      (this.image = image),
      (this.price = +price),
      (this.description = description);
  }
  save() {
    this.id = Math.random().toString();
    return readProductsFile((products) => {
      products.push(this);
      fs.writeFile(file, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }
}

module.exports = {
  Product,
  fetchProduct,
  fetchAllProducts
};
