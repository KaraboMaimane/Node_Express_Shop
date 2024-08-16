const products = [];

module.exports = class Product {
    constructor(t){
        this.title = t
    }

    save() {
        products.push(this) // will store the object with all the created attributes like title etc.
    }

    static fetchAll(){ // static makes us call the function on the class directly without instatiating it
        return products;
    }
}