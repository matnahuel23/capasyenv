const mongoose = require("mongoose")
const config = require('../../config/config.js')
const mongoURL = config.mongoUrl

let Contacts

switch (config.persitence) {
    case "MONGO":
        mongoose.connect(mongoURL)
            .then(() => {
                const { default: ContactsMongo } = require('../classes/product.dao.js')
                Contacts = ContactsMongo
            })
            .catch(error => {
                console.error("Error de conexión a MongoDB:", error);
            })
        break
    case "MEMORY":
        const { default: ContactsMemory } = require('../memory/product.memory.js')
        Contacts = ContactsMemory
        break
}

module.exports = Contacts;
