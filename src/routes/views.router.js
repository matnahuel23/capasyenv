import express from "express";
import passport from "passport";
import config from "../config/config.js"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const admin = config.adminName

// Rutas
router.get('/', (req, res) => {
    res.render('login.hbs');
});

router.get('/restore', (req, res) => {
    const email = req.query.email || ''
    res.render('restore.hbs', { email })
});

router.get('/faillogin', (req, res) => {
    res.redirect('/')
});

function auth(req, res, next) {
    if (req.session?.admin) {
        return next();
    }
    return res.status(401).send('Error de autorización');
}

// Acceso solo del administrador
router.get('/privado', auth, (req, res) => {
    res.send('Si estás viendo esto es porque ya te logueaste como administrador');
});

router.get('/admin', async (req, res) => {
    try {
        const viewPath = path.join(__dirname, '../views/admin.hbs');
        const { first_name, email, age } = req.session.user;
        res.render(viewPath, { first_name, email, age });
    } catch (error) {
        res.status(500).json({ error: 'Error en el ingreso al admin.' });
    }
});

router.get('/register', (req, res) => {
    res.render('register.hbs')
});

router.get('/failregister', async (req, res) => {
    res.send({ error: "Fallo el registro" });
});

router.get('/logout', (req, res) => {
    // El destroy elimina datos de sesión
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/');
        } else {
            res.send({ status: 'Logout ERROR', body: err });
        }
    });
});

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    const { first_name, last_name, email, age } = req.session.user;
    res.render('profile.hbs', { first_name, last_name, email, age });
});

router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.send('¡Bienvenido!');
    }
});

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'login'}), async(req,res) => {
    // Nuestra estrategia nos devolvera al usuario, solo lo agregamos a nuestro objeto de sesión.
    req.session.user = req.user
    res.redirect('/products');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en el inicio de sesión' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Guarda el ID de la sesión en una cookie personalizada
        res.cookie('sessionID', req.sessionID, { maxAge: 3600000 }); // Configura el tiempo de vida de la cookie en milisegundos (1 hora)

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            cart: user.cart // Agrega los datos del carrito a la sesión
        };

        // Verificar si el usuario es administrador
        if (user.email === admin) {
            req.session.admin = true;
            return res.redirect('/admin');
        } else {
            req.session.admin = false;
            res.redirect('/products');
        }
    })(req, res, next);
});

export default router;