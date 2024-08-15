const path = require('path');
const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const shopRoutes = router.get('/', (req, res, next) => {
    console.log('In the middleware');

    res.sendFile(path.join(rootDir, 'views', 'shop.html')); // We call an absolute path but the path module builds it up for us
});

module.exports = shopRoutes;