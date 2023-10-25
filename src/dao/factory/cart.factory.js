const mongoose = require("mongoose");
const config = require('../../config/config.js');
const mongoURL = config.mongoUrl;

let Carts;

switch (config.persitence) {
    case "MONGO":
        mongoose.connect(mongoURL)
            .then(() => {
                const { default: CartsMongo } = require('../classes/cart.dao.js');
                Carts = CartsMongo;
            })
            .catch(error => {
                console.error("Error de conexión a MongoDB:", error);
            });
        break;
    case "MEMORY":
        const { default: CartsMemory } = require('../memory/cart.memory.js');
        Carts = CartsMemory;
        break;
}

module.exports = Carts;