import passport from "passport"
import local from "passport-local"
import User from "../dao/classes/user.dao.js"
import Cart from "../dao/classes/cart.dao.js"
import { createHash, isValidatePassword } from "../utils/bcrypt.js";
import GitHubStrategy from "passport-github2"
import config from "./config.js"

const localStrategy = local.Strategy;
const admin = config.adminName
const clientID = config.clientID
const clientSecret = config.clientSecret
const callbackURL = config.callbackURL
const usersService = new User()
const cartsService = new Cart()

const initializePassport = () => {
    configureLocalStrategy();
    configureGitHubStrategy();
    configureSerialization();
};

const configureLocalStrategy = () => {
// Configuración de la estrategia local de registro
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await usersService.getUserByEmail(username);
                if (user) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }
                
                // Crear el carrito primero
                const newCart = await cartsService.createCart({
                    products: [],
                    total: 0
                });

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id
                }

                if (email === admin) {
                    newUser.role = "admin";
                }

                // Crear el usuario después de crear el carrito
                let result = await usersService.createUser(newUser);
                return done(null, result);
            } catch (error) {
                console.error("Error en el registro:", error);
                return done(error);
            }
        }
        ));
    // Configuración de la estrategia local de inicio de sesión
    passport.use('login', new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await usersService.getUserByEmail(email);
            if (!user) {
                console.log('El usuario no existe');
                return done(null, false);
            }
            if (!isValidatePassword(user, password)) {
                console.log('Contraseña incorrecta');
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            return done(error);
        }
    }));
    
}
const configureGitHubStrategy = () => { 
    // Configuración de la estrategia de registro con GitHub, previamente instale passport-github2
    passport.use('github', new GitHubStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackURL
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            // console.log(profile) //chequeo info que viene del perfil
            let user = await usersService.getUserByEmail({email:profile._json.email})
            if(!user){ // Si el usuario no existe en nuestra BD, lo agrego
                // Crear el carrito primero
                const newCart = await cartsService.createCart({
                    products: [],
                    total: 0
                });
                let newUser = {
                    first_name:profile._json.name,
                    last_name:'',
                    age:18,
                    email:profile._json.email,
                    password:'', // al ser autentificacion de terceros, no podemos asignar un password
                    cart: newCart._id
                }
                let result = await usersService.createUser(newUser)
                done(null, result)
            } else { // Si entra aca, es porque el usuario ya existia en nuestra BD
                done(null, user)
            }
        }catch(error){
            return done(error)
        }
    }))
}

const configureSerialization = () => { 
    // Serialización del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    // Deserialización del usuario
    passport.deserializeUser(async (id, done) => {
        let user = await usersService.getUserById(id);
        done(null, user);
    })
}

export default initializePassport