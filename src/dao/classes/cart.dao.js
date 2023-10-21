import cartModel from '../models/cart.model.js'

export default class Cart {
    getCarts = async () => {
        try {
            let result = await cartModel.find()
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getCartById = async (cid) => {
        try {
            let result = await cartModel.findOne({ _id: cid }).populate('products.product')
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createCart = async (cart) => {
        try {
            let result = await cartModel.create(cart)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateCart = async (cid, cart) => {
        try {
            let result = await cartModel.updateOne({ _id: cid }, { $set: cart })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    deleteCart = async (cid) => {
        try {
            let result = await cartModel.deleteOne({ _id: cid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

}