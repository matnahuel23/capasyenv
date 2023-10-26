const mongoose = require("mongoose");
const config = require('../../config/config.js');
const mongoURL = config.mongoUrl;

let Users; 

switch (config.persistence) {
    case "MONGO":
        mongoose.connect(mongoURL)
            .then(() => {
                const { default: UsersMongo } = require('../classes/user.dao.js');
                Users = UsersMongo;
            })
            .catch(error => {
                console.error("Error de conexión a MongoDB:", error);
            });
        break;
    case "MEMORY":
        const { default: UsersMemory } = require('../memory/user.memory.js');
        Users = UsersMemory;
        break;
}

module.exports = Users; 
