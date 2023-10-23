import Cart from "../dao/classes/cart.dao.js"
import Product from "../dao/classes/product.dao.js"

const cartsService = new Cart()
const productsService = new Product()

export const getCarts = async (req, res) => {
    try {
        let carts = await cartsService.getCarts()
        res.send({result:"success", payload:carts})
    } catch (error) {
        res.send({status:"error", error: 'Error al obtener los carritos.' });
    }
}
export const getCartById = async (req, res) => {
    try {
        let { cid } = req.params;
        let cart = await cartsService.getCartById(cid)
        if (!cart) {
            res.send({ status: "error", error: 'Carrito no encontrado.' });
        } else {
            res.send({ result: "success", payload: cart });
        }
    } catch (error) {
        res.send({ status: "error", error: 'Error al obtener el carrito.' });
    }
}
export const createCart = async (req, res) => {
    try {
        const newCart = {
            products : [],
            total : 0,
        }    
        let result = await cartsService.createCart({
            newCart
        });
        res.send({ result: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: 'Error al agregar el carrito.' });
    }
}
export const updateCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = parseInt(req.body.quantity);
        if (quantity <= 0) {
            return res.send({ status: "error", error: 'Debe ingresar al menos una unidad del producto.' });
        }
        const cartAdd = await cartsService.getCartById(cid);
        if (!cartAdd) {
            return res.send({ status: "error", error: 'Carrito no encontrado' });
        }
        const product = await productsService.getProductById(pid);
        if (!product) {
            return res.send({ status: "error", error: 'Producto no encontrado' });
        }
        if (product.stock < quantity) {
            return res.send({ status: "error", error: 'No disponemos de ese stock' });
        }
        // Verifica si el producto ya está en el carrito
        const existingProductIndex = await cartsService.indexProductInCart(cid, pid);
        if (existingProductIndex !== -1) {
            const existingProduct = cartAdd.products[existingProductIndex];
            if (existingProduct) {
                existingProduct.quantity += quantity;
            }
        } else {
            cartAdd.products.push({ product: pid, quantity });
        }
        cartAdd.markModified('products');
        await cartsService.updateCart(cid, cartAdd);
        await productsService.updateProductStock(pid, quantity);
        // Actualiza el total del carrito
        const newTotal = cartAdd.total + (product.price * quantity);
        const totalUpdateResult = await cartsService.updateCartTotal(cid, newTotal);
        return res.json({ message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        return res.status(500).json({ message: 'Error al agregar el producto.' });
    }
}
export const deleteCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cartToRemove = await cartsService.getCartById({ _id: cid });

        if (!cartToRemove) {
            return res.status(404).json({ status: "error", error: 'Carrito no encontrado' });
        }

        // Devolver las cantidades de productos al stock
        for (const cartProduct of cartToRemove.products) {
            const product = await productsService.getProductById(cartProduct.product);
            const quantity = cartProduct.quantity;

            await productsService.updateProduct(
                { _id: product._id },
                { $inc: { stock: quantity } }
            );
        }

        await cartsService.deleteCart({ _id: cid });
        return res.json({ message: 'Carrito eliminado y cantidades de productos devueltas al stock correctamente.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el carrito.' });
    }
}
export const deleteProductOfCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = parseInt(req.body.quantity);

        if (quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor que 0.' });
        }

        const cart = await cartsService.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        const productIndex = cart.products.findIndex((item) => item.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
        }

        const product = await productsService.getProductById(pid);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const cartProduct = cart.products[productIndex];

        if (cartProduct.quantity < quantity) {
            return res.status(400).json({ error: 'La cantidad a eliminar es mayor que la cantidad en el carrito.' });
        }

        // Restar la cantidad del producto en el carrito
        cartProduct.quantity -= quantity;

        // Actualizar el stock del producto y el total del carrito
        product.stock += quantity;
        const productTotal = product.price * quantity;
        cart.total -= productTotal;

        if (cartProduct.quantity === 0) {
            // Si la cantidad llega a 0, eliminar el producto del carrito
            cart.products.splice(productIndex, 1);
        }

        await productsService.updateProduct({ _id: pid }, { stock: product.stock });
        await cartsService.updateCart({ _id: cid }, cart);

        res.json({ message: 'Producto eliminado del carrito correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
    }
}