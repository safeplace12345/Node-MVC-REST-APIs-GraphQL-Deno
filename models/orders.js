const { mongoConnect, getDb } = require("../utils/database");
const ObjectId = require("mongodb").ObjectID;

class Orders {
    constructor(cart, user) {
        (this.cart = cart), (this.user = user);
    }
    addOrder(cb) {
        let _db = getDb();
        return _db
            .collection("orders")
            .insertOne(this)
            .then((res) => cb("Success"))
            .catch((err) => cb("Error"));
    }
   static getAllOrders(cb) {
        let _db = getDb();
        return _db
            .collection("orders")
            .find({})
            .toArray((err, res) => {
                if (err) return cb([]);

                return cb(res);
            });
    }
}

module.exports = Orders;
