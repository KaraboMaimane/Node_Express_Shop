const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;
const productsCollection = "products";
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongoDb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection(productsCollection)
        .updateOne({ _id: new mongoDb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection(productsCollection).insertOne(this);
    }
    return dbOp.then((result) => {
      console.log(result);
    });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection(productsCollection)
      .find()
      .toArray()
      .then((products) => {
        // console.log("🚀 ~ Product ~ fetchAll ~ products", products > 0);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDb();

    return db
      .collection(productsCollection)
      .find({ _id: new mongoDb.ObjectId(productId) })
      .next()
      .then((product) => {
        // console.log(`🚀 ~ Product ~ returndb.collection ~ product: ${productId} successful!!`);
        return product;
      })
      .catch((err) => console.error(err));
  }

  static async deleteById(productId){
    const db = getDb();
    return await db.collection('products').deleteOne({_id: new mongoDb.ObjectId(productId)});
  }
}

module.exports = Product;
