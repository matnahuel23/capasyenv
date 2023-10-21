import productModel from '../models/product.model.js'

export default class Product {
    getProducts = async () => {
        try {
            let result = await productModel.find()
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getProductById = async (pid) => {
        try {
            let result = await productModel.findOne({ _id: pid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    createProduct = async (product) => {
        try {
            let result = await productModel.create(product)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    updateProduct = async (pid, product) => {
        try {
            let result = await productModel.updateOne({ _id: pid }, { $set: product })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    deleteProduct = async (pid) => {
        try {
            let result = await productModel.deleteOne({ _id: pid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
}