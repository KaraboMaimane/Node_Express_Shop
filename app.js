// Node imports
const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const rootDir = require('./util/path');

const app = express(); 

// Custom imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));// parsing our request data input
app.use(express.static(path.join(__dirname, 'public'))); // setting up our public folder to be referred

//We can define our middleware functions below here hence the "next" argument
//Middleware basically is where we funnel our request through a bunch of functions before the response

// Routes
// Note that there is some routes that have a prefix so that you dont have to add it on the routes file
app.use('/admin', adminRoutes); // we call upon our admin routes so we can use it on our server;
app.use(shopRoutes);

app.use((req, res, next) => { // This will be a catch-all route
    res.status(404).sendFile(path.join(rootDir, 'views', '404-page.html'));
})

app.listen(3000)