const fs = require("fs");
const pathMaker = require('../utils/pathMaker')
const fileReader = require('../utils/readFiles')
const database = require('../utils/database')

const file = pathMaker("products.json");
const readProductsFile = (cb) => {
  return fileReader.products(cb,file)
};


function fetchAllProducts(cb){
  return readProductsFile(products => {
 cb(products)
  }) 
};
const fetchProduct = (productId, cb) => {
  let product = {};
  return readProductsFile((products) => {
    product = products.find(({id}) => id === productId);
    return cb(product)
  });
};
const writeFile = content => fs.writeFile(file,JSON.stringify(content),err => {
  console.log(err);
})

class Product {
  constructor({ title, image, price, description }) {
    (this.title = title.trim()),
    (this.image = image.trim()),
    (this.price = +price),
    (this.description = description.trim());
      this.id = null;
    }
    save() {
      this.id = Math.floor(Math.random() * 1000).toString();
      return readProductsFile((products) => {
        products.push(this);
        writeFile(products);
    });
  }
  edit(id){
    return readProductsFile((products => {
      const existingItemIndex = products.findIndex(prod => +prod.id == +id);
      this.id = id.trim()
      console.log(existingItemIndex)
      const updatedProducts = [...products];
      updatedProducts[existingItemIndex] = this
      writeFile(updatedProducts)
    }
    )
    )
  }
}
const deleteProductFromFile = (id,cb) => {
  return readProductsFile(products => {
    let updatedProducts = products.filter((product) => +product.id !== +id);
    // fix delete from cart as well
    writeFile(updatedProducts);
     return cb(updatedProducts)
  })
}

module.exports = {
  Product,
  fetchProduct,
  fetchAllProducts,
  deleteProductFromFile
};
