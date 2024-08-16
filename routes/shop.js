const path = require('path');
const express = require('express');

const productsController = require('../controllers/products')

const router = express.Router();

const shopRoutes = router.get('/', productsController.getProducts);

module.exports = shopRoutes;