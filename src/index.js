const express = require('express');
const morgan = require("morgan")
const bodyParser = require('body-parser');

const route = require('./routes/bookRout');
const userRoute = require("./routes/userRoute")
const reviewRoutes = require("./routes/reviewRoute")

const app = express();

//middleWares
app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/books', route);
app.use('/user', userRoute);
app.use('/books', reviewRoutes);

module.exports = app
