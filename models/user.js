const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongoDb.ObjectId;
const usersCollectionString = "users";
const productsCollectionString = "products";
const ordersCollectionString = "orders";

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection(usersCollectionString).insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db
      .collection(usersCollectionString)
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  /**
   * Retrieves the cart items for the user.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of products in the cart, with quantity information.
   */
  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection(productsCollectionString)
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  /**
   * Deletes an item from the user's cart.
   * 
   * @param {string} productId - The ID of the product to be deleted from the cart.
   * @returns {Promise} A promise that resolves to the result of the database update operation.
   */
  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter((product) => {
      console.log("🚀 ~ User ~ updatedCartItems ~ product:", product);
      return product.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection(usersCollectionString)
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  /**
   * Adds an order for the user.
   * 
   * @returns {Promise} A promise that resolves when the order is added.
   */
  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
            email: this.email,
          },
        };
        console.log("🚀 ~ User ~ this.getCart ~ order:", order);

        return db.collection(ordersCollectionString).insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };

        return db
          .collection(usersCollectionString)
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  /**
   * Retrieves the orders associated with the user.
   * @returns {Promise<Array>} A promise that resolves to an array of orders.
   */
  getOrders() {
    const db = getDb();
    return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection(usersCollectionString)
      .findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
