const UserDAO = require ("../dao/classes/user.dao.js")
const CartDAO = require ("../dao/classes/cart.dao.js")
const passport = require ("passport")
const { createHash } = require ("../utils/bcrypt.js")
const config = require ("../config/config.js")

const admin = config.adminName
const usersService = new UserDAO();
const cartsService = new CartDAO();

module.exports = {

getUsers : async (req, res) => {
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
},
getUserByEmail : async (req, res) => {
    try {
        const { email } = req.body.email
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            res.send({ status: "error", error: 'Usuario no encontrado.' });
        } else {
            req.session.user = user;
            res.send({ result: "success", payload: user });
        }
    } catch (error) {
        res.send({ status: "error", error: 'Error al obtener el usuario.' });
    }
},
getUserById : async (req, res) => {
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
},
login : passport.authenticate('login', {
    successRedirect: '/successlogin',
    failureRedirect: '/faillogin',
}),
createUser : (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el registro' });
        }
        if (!user) {
            // return res.status(400).json({ error: 'El usuario ya existe' });
            return res.redirect('/register')
        }
        // return res.json({ message: 'Usuario creado correctamente' });
        return res.redirect('/')
    })(req, res, next);
},
logUser : (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            cart: user.cart
        };
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el loguear' });
        }
        if (!user) {
            return res.redirect('/register');

        }
        if (user.email === admin) {
            req.session.admin = true;
            return res.redirect('/admin');
        } else {
            req.session.admin = false;
            res.redirect('/products');
        }
    })(req, res, next);
},
updateUser : async (req, res) => {
    const updates = req.body; // Contiene los campos a actualizar
        if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).send({ status: "error", error: "Faltan datos válidos para actualizar" });
    }
    try {
        const user = await usersService.getUserByEmail(updates.email);
        if (!user) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }
        // Si se proporciona una nueva contraseña en los campos a actualizar, usar createHash
        if (updates.password) {
            updates.password = createHash(updates.password);
        }
        // Actualiza los campos recibidos en el body
        const updatedUser = await usersService.updateUser(user._id, updates);
        if (!updatedUser) {
            return res.status(500).send({ status: "error", error: "Error al actualizar el usuario" });
        }
        res.redirect('/'); // Redirecciona de nuevo a la página de inicio de sesión
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error al actualizar el usuario" });
    }
},
deleteUser : async (req, res) => {
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
},
}
   