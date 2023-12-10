const mongoose = require ('mongoose')
const User = require ('../src/dao/classes/user.dao.js')
const config = require ('../src/config/config.js')

// ENV
const PORT = config.port;
const mongoURL = config.mongoUrl;

// Conectarse a Mongoose
mongoose.connect(mongoURL);