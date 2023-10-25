const productModel = require ('../models/product.model.js')
const fs = require('fs');
const path = require('path');
function generateUniqueId() {
    return Date.now().toString();
}

module.exports =  class Product {
    constructor() {
        this.data = []
    }
    
    getProducts = async () => {

    }

    getProductById = async (pid) => {

    }

    getProductByTitle = async (title) => {

    }

    createProduct = async (product) => {
        
    }

    updateProduct = async (pid, product) => {
        
    }

    deleteProduct = async (pid) => {
        
    }

    paginate = async (conditions, options) => {
        
    }
}