module.exports = class CartDTO {
    constructor(cart){
        this._id = cart._id,
        this.total = cart.total
    }
}