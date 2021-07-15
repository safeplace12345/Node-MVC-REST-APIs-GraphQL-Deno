const fs = require("fs");
const pathMaker = require('../utils/pathMaker')
const fileReader = require('../utils/readFiles')
const { mongoConnect, getDb } = require('../utils/database')
const ObjectId = require('mongodb').ObjectID
const file = pathMaker("products.json");
const readProductsFile = (cb) => {
  return fileReader.products(cb, file)
};


const fetchProduct = (productId, cb) => {
  let product = {};
  return readProductsFile((products) => {
    product = products.find(({ id }) => id === productId);
    return cb(product)
  });
};
const writeFile = content => fs.writeFile(file, JSON.stringify(content), err => {
  console.log(err);
})

// Initiate the database 



class Product {
  constructor({ title, image, price, description, id }) {
    (this.title = title.trim()),
      (this.image = image.trim()),
      (this.price = +price),
      (this.description = description.trim());
    this.id = id;
  }
  saveOrUpdate() {
    let db = getDb()
    let dbOp = db.collection('shop')
      if (!this.id) {
        return dbOp.insertOne(this).then(res => console.log(res)).catch(err => console.log(err))
      }
      return dbOp.updateOne({ _id: new ObjectId(this.id) }, { $set: this })
    
  }
  static fetchAllProducts(cb) {
    let db = getDb()
    return db.collection('shop').find({}).toArray((err, res) => {
      if (err) return cb(err)
      cb(res)
    })
  };
  edit(id) {

  }
}
const deleteProductFromFile = (id, cb) => {
  let db = getDb()
  return ldb.collection('shop').deleteOne({ id: new ObjectId(id) }).then(res => cb(res)).catch(err => cb(err))
}

module.exports = {
  Product,
  fetchProduct,
  deleteProductFromFile
};
