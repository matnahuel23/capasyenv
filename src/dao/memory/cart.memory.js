const cartModel = require ('../models/cart.model.js')
const fs = require('fs');
const path = require('path');
function generateUniqueId() {
    return Date.now().toString();
}

module.exports =  class Cart {
    constructor() {
        this.data = []
    }
    
    getCarts = async () => {
        
    }

    getCartById = async (cid) => {
        
    }

    createCart = async (cart) => {
        
    }

    updateCart = async (cid, cart) => {
        
    }

    updateCartTotal = async (cid, newTotal) => {
        
    }

    deleteCart = async (cid) => {
        
    }
    
    indexProductInCart = async (cartId, productId) => {
        
    }     
}