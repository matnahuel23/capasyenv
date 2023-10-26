const Products = require ('../factory/product.factory.js')
const ProductRepository = require ('./products.repository.js')
const Users = require ('../factory/user.factory.js')
const UsersRepository = require ('./users.repository.js')
const Carts = require ('../factory/cart.factory.js')
const CartsRepository = require ('./carts.repository.js')


const productService = new ProductRepository(new Products())
const userService = new UsersRepository(new Users())
const cartService = new CartsRepository (new Carts())

module.exports ={ productService, userService, cartService }