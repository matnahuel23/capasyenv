import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import usersRouter from './routes/users.router.js';
import config from "./config/config.js"
import initializePassport from "./config/passport.js";
import passport from "passport";
import session from "express-session";

const PORT = config.port;
const app = express();
const cookiePass = config.cookiePass;
const adminPass = config.adminPass;
const mongoURL = config.mongoUrl;

// Listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Conectarse a Mongoose
const connection = mongoose.connect(mongoURL);

// Session
app.use(session({
    secret: adminPass,
    resave: false,
    saveUninitialized: true,
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5500', methods: ["GET", "POST", "PUT", "DELETE"] }))

// Cookie
app.use(cookieParser(cookiePass));

// Routers
app.use('/api/products', productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);