module.exports = class CartDTO {
    constructor(user){
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.email = user.email,
        this.cart = user.cart
    }
}