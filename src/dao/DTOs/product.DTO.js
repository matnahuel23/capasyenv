module.exports = class ProductDTO {
    constructor(product){
        this.total = product.total,
        this.price = product.price,
        this.stock = product.stock
    }
}