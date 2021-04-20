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
const file = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);
class Product {
  constructor(t) {
    this.title = t;
  }
  save() {
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
  readProductsFile
};
