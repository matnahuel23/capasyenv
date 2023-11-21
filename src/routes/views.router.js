const express = require ("express")
const passport = require ("passport")
const { getProducts} = require ('../controllers/products.controller.js')
const { createUser, logUser, updateUser } = require ('../controllers/users.controller.js')
const path = require ("path")

const router = express.Router();

// Rutas
router.post('/register', createUser)

router.post('/login', logUser) 

router.get('/products', getProducts)

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

router.get('/admin', async (req, res) => {
    try {
        const viewPath = path.join(__dirname, '../views/admin.hbs');
        const { first_name, email, age, role } = req.session.user;
        res.render(viewPath, { first_name, email, age, role });
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
    const { first_name, last_name, email, age, role } = req.session.user;
    res.render('profile.hbs', { first_name, last_name, email, age, role });
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

module.exports = router