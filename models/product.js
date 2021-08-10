const fs = require("fs");
const pathMaker = require("../utils/pathMaker");
const fileReader = require("../utils/readFiles");
const { mongoConnect, getDb } = require("../utils/database");
const ObjectId = require("mongodb").ObjectID;
const file = pathMaker("products.json");
const readProductsFile = (cb) => {
    return fileReader.products(cb, file);
};

const writeFile = (content) =>
    fs.writeFile(file, JSON.stringify(content), (err) => {
        console.log(err);
    });

// Initiate the database

class Product {
    constructor({ title, image, price, description, id }) {
        (this.title = title.trim()),
            (this.image = image.trim()),
            (this.price = +price),
            (this.description = description.trim());
        this.id = id;
    }
    saveOrUpdate(cb) {
        let db = getDb();
        let dbOp = db.collection("shop");
        // if item / product dosenot have an id, we save a new product
        if (!this.id) {
            return dbOp
                .insertOne(this)
                .then((res) => cb("Success inserting product"))
                .catch((err) => cb("Error inserting product"));
        }
        // if item / product already has an id, we save a new product
        return dbOp
            .updateOne(
                // Trim id before comparing
                { _id: new ObjectId(this.id.trim()) },
                {
                    $set: {
                        title: this.title,
                        image: this.image,
                        price: this.price,
                        description: this.description,
                    },
                }
            )
            .then((res) => cb("Success updating Product"))
            .catch((err) => cb("Error updating product"));
    }
    static fetchSingleProduct = async (productId, cb) => {
        let db = getDb();
        let dbOp = db.collection("shop");
        let product = {};
        product = await dbOp.findOne({ _id: new ObjectId(productId) });
        return cb(product);
    };
    static fetchAllProducts(cb) {
        let db = getDb();
        return db
            .collection("shop")
            .find({})
            .toArray((err, res) => {
                if (err) return cb(err);
                cb(res);
            });
    }
    static deleteById = (id, cb) => {
        let db = getDb();
        id = id.trim()
        return db
            .collection("shop")
            .deleteOne({ _id: new ObjectId(id) })
            .then((res) => cb("Success on delete entry" + id))
            .catch((err) => cb("Error on delete entry" + id));
    };
}

module.exports = {
    Product
};
