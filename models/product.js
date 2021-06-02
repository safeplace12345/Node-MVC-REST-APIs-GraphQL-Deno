const fs = require("fs");
const pathMaker = require('../utils/pathMaker')
const fileReader = require('../utils/readFiles')
const {mongoConnect} = require('../utils/database')

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

// Initiate the database 



class Product {
  constructor({ title, image, price, description }) {
    (this.title = title.trim()),
    (this.image = image.trim()),
    (this.price = +price),
    (this.description = description.trim());
      this.id = null;
    }
    save() {
      return mongoConnect(_db => {
        return _db.collection('shop').insertOne(this).then(res => console.log(res)).catch(err => console.log(err))
      })
  }
  edit(id){
    
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
