import UserDAO from "../dao/classes/user.dao.js";
import CartDAO from "../dao/classes/cart.dao.js";
import passport from "passport";
import { createHash } from "../utils/bcrypt.js";

const usersService = new UserDAO();
const cartsService = new CartDAO();

export const getUsers = async (req, res) => {
    try {
        const users = await usersService.getUsers();
        if (users && users.length > 0) {
            res.send({ result: "success", payload: users });
        } else {
            res.send({ status: "success", message: 'No hay usuarios registrados.' });
        }
    } catch (error) {
        res.send({ status: "error", error: 'Error al obtener los usuarios.' });
    }
}
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body.email
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            res.send({ status: "error", error: 'Usuario no encontrado.' });
        } else {
            req.session.user = user;
            console.log(user)
            res.send({ result: "success", payload: user });
        }
    } catch (error) {
        res.send({ status: "error", error: 'Error al obtener el usuario.' });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await usersService.getUserById(uid);
        if (!user) {
            res.send({ status: "error", error: 'Usuario no encontrado.' });
        } else {
            res.send({ result: "success", payload: user });
        }
    } catch (error) {
        res.send({ status: "error", error: 'Error al obtener el usuario.' });
    }
}
export const login = passport.authenticate('login', {
    successRedirect: '/successlogin',
    failureRedirect: '/faillogin',
});
export const createUser = (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el registro' });
        }
        if (!user) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        return res.json({ message: 'Usuario creado correctamente' });
    })(req, res, next);
}
export const updateUser = async (req, res) => {
    const userId = req.params.uid;
    const updates = req.body; // Contiene los campos a actualizar
    if (!userId || !updates || Object.keys(updates).length === 0) {
        return res.status(400).send({ status: "error", error: "Faltan datos válidos para actualizar" });
    }
    try {
        const user = await usersService.getUserById(userId);
        if (!user) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }
        // Si se proporciona una nueva contraseña en los campos a actualizar, usar createHash
        if (updates.password) {
            updates.password = createHash(updates.password);
        }
        // Actualiza los campos recibidos en el body
        const updatedUser = await usersService.updateUser(userId, updates);
        if (!updatedUser) {
            return res.status(500).send({ status: "error", error: "Error al actualizar el usuario" });
        }
        res.json({ status: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error al actualizar el usuario" });
    }
}
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        if (!userId) {
            return res.status(400).json({ status: 'Error', error: 'Falta el parámetro uid' });
        }
        const userToRemove = await usersService.getUserById(userId);
        if (!userToRemove) {
            return res.status(404).json({ status: 'Error', error: 'Usuario no encontrado' });
        }
        // Verificar si el usuario tiene un carrito
        if (userToRemove.cart) {
            const cartId = userToRemove.cart;
            const cartToRemove = await cartsService.getCartById(cartId);
            // Devolver las cantidades de productos al stock
            for (const cartProduct of cartToRemove.products) {
                const product = await productsService.getProductById(cartProduct.product);
                const quantity = cartProduct.quantity;
                await productsService.updateProduct(
                    { _id: product._id },
                    { $inc: { stock: quantity } }
                );
            }
            // Eliminar el carrito
            await cartsService.deleteCart(cartId);
        }
        // Elimina al usuario
        await usersService.deleteUser(userId);
        res.json({ status: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'Error', error: 'Error al eliminar el usuario y el carrito' });
    }
};
