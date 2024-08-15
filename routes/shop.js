const path = require('path');
const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();
const adminData = require('./admin'); //accessing our shared admindata

const shopRoutes = router.get('/', (req, res, next) => {
    console.log('In the shop middleware: ', {products: adminData.products});
    const products = adminData.products;

    // We render a page with data 
    res.render('shop', { 
        prods: products,
        pageTitle: 'Shop Home',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
    }) // We call an absolute path but the path module builds it up for us
});

module.exports = shopRoutes;