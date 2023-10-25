const userModel = require ("../models/user.model.js")
const fs = require('fs');
const path = require('path');
function generateUniqueId() {
    return Date.now().toString()
}

module.exports =  class User {
    constructor() {
        this.data = []
    }

    getUsers = async () => {
        
    }

    getUserById = async (id) => {
        
    }

    getUserByEmail = async (email) => {
        
    }
    
    createUser = async (user) => {
        
    }

    updateUser = async (id, user) => {
        
    }

    deleteUser = async (id) => {
        
    }
}