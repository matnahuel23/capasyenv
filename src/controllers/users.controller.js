const usersService = require ("../dao/factory/user.factory.js")
const productsService = require ("../dao/factory/product.factory.js")
const cartsService = require("../dao/factory/cart.factory.js")
const passport = require ("passport")
const { createHash, isValidatePassword } = require ("../utils/bcrypt.js")
const config = require ("../config/config.js")
const { sendEmail, sendResetPasswordEmail } = require ("../utils/email.js")
const jwt = require('jsonwebtoken');
const { cookiePass } = require('../config/config.js')
const admin = config.adminName
const path = require('path');
const multer = require('../utils/multer.js')

const generateRandomToken = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
};

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
        const { email } = req.params
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
            return res.redirect('/register')
        }
        return res.redirect('/')
    })(req, res, next);
},
logUser: (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        
        // Genera un número aleatorio de 6 dígitos para la cookie
        const randomSessionID = generateRandomToken(6);
        res.cookie('sessionIDexpire', randomSessionID, { maxAge: 3600000 }); // Configura el tiempo de vida de la cookie en milisegundos (1 hora)
        
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el logueo' });
        }

        if (!user) {
            if (info && info.message === 'Contraseña incorrecta.') {
                return res.redirect('/');
            } else {
                // Usuario no encontrado, redirigir a /register
                return res.redirect('/register');
            }
        }

        // Usuario autenticado correctamente
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            cart: user.cart,
            role: user.role
        };

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
    try {
        const updates = req.body; // Contiene los campos a actualizar
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).send({ status: "error", error: "Faltan datos válidos para actualizar" });
        }
        const user = await usersService.getUserByEmail(updates.email);
        if (!user) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }
        // Si se proporciona una nueva contraseña en los campos a actualizar, usar createHash
        if (updates.password) {
            const response = isValidatePassword(user, updates.password)
            if(!response){
                updates.password = createHash(updates.password);
            }else{
                return res.send({ status: "error", error: "No se puede repetir password" })
            }
        }
        // Actualiza los campos recibidos en el body
        const updatedUser = await usersService.updateUser(user._id, updates);
        if (!updatedUser) {
            return res.status(500).send({ status: "error", error: "Error al actualizar el usuario" });
        }
        res.status(200).json({ result: "success", message: "Usuario actualizado exitosamente" })
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
restorePass : async (req, res) => {
    const { email } = req.query
    const user = await usersService.getUserByEmail(email);
    
    if (!user) {
        return res.redirect('/register');
    }
    
    const token = jwt.sign({ email }, cookiePass, { expiresIn: '1h' });

    // Incluye el token en el enlace del correo electrónico
    const resetPasswordLink = `http://localhost:8080/restorepassword?token=${token}`;

    // Envía el correo electrónico con el enlace de restablecimiento
    const emailContent = await sendResetPasswordEmail(resetPasswordLink);
    
    try {
        await sendEmail(email, emailContent);
        res.redirect('/');
    } catch (error) {
        console.log('Error al enviar el correo electrónico:', error);
        res.status(500).send({ status: "error", error: 'Error al enviar el Email. Detalles: ' + error.message });
    }
},
restorePassOk : async (req, res) =>  {
    const { token } = req.query;
    // Verificar y decodificar el token
    jwt.verify(token, cookiePass, (err, decoded) => {
        if (err) {
            // Token inválido o expirado
            return res.status(401).send('Token inválido o expirado.');
        }
        // El token es válido, puedes continuar con la página de restablecimiento de contraseña
        const email = decoded.email;
        const viewPath = path.join(__dirname, '../views/restorepassword.hbs');
        res.render(viewPath, { email})
    });
},
uploadDocumentUser: async (req, res, next) => {
    multer(req, res, async (err) => {
        try {
            if (err) {
                return res.status(400).json({ error: 'Error al subir el documento' });
            }

            const userId = req.params.uid;
            const { originalname, filename } = req.file;

            const result = await usersService.updateUser(
                { _id: userId },
                { $push: { documents: { name: originalname, reference: `/img/documents/${filename}` } } }
            );

            if (result && result.nModified > 0) {
                res.status(201).json({ message: 'Documento subido exitosamente' });
            } else {
                return res.status(404).json({ error: 'Usuario no encontrado o no se modificó ningún documento' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}

}
   