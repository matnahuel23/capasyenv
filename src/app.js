import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cors from "cors";
import cookieParser from "cookie-parser";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js'
import config from "./config/config.js"
import initializePassport from "./config/passport.js";
import passport from "passport";
import session from "express-session";
import handlebars from "express-handlebars";
import { fileURLToPath } from 'url';
import path from "path";

// ENV
const PORT = config.port;
const app = express();
const cookiePass = config.cookiePass;
const adminPass = config.adminPass;
const mongoURL = config.mongoUrl;

// Configurar el motor de plantillas y las rutas de vistas en la aplicación principal
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hbs = handlebars.create({});
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
// Listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Conectarse a Mongoose
const connection = mongoose.connect(mongoURL);

// Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoURL,
        ttl: 6000,
    }),
    secret: adminPass,
    // resave en false hace que la sesión muera luego de un tiempo, si quiero que quede activa le pongo true
    resave: false,
    // saveUninitialized en true guarda sesión aun cuando el objeto de sesión no tenga nada por contener
    saveUninitialized: true,
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5500', methods: ["GET", "POST", "PUT", "DELETE"] }))

// Cookie
app.use(cookieParser(cookiePass));

// Routers
app.use('/products', productsRouter);
app.use("/carts", cartsRouter);
app.use("/users", usersRouter);
app.use('/', viewsRouter);
