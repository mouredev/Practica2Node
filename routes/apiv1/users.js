
/**
 * Router para usuarios
 */

'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
const { check, validationResult } = require('express-validator/check');
const CustomError = require('../../modules/customError');

// Cargamos el modelo de Advertisement
const User = require('../../models/User');

/**
 * POST /users/authenticate
 * Autentica a un usuario en el API por email y contraseña
 *
 * Parámetros obligatorios:
 * email: String
 * password: String
 *
 * Parámetros opcionales
 * lang: String
 */
router.post('/authenticate', async (req, res, next) => {
    try {
        // Recogemos las credenciales
        const email = req.body.email;
        const password = req.body.password;

        // Posible error internacionalizado
        const lang = req.body.lang
        const credentialsError = CustomError.CustomError('BAD_CREDENTIALS', lang);

        if (!email || !password) {
            res.status(412); // Precondicion Failed
            res.json({ error: credentialsError.message });
            return;
        }

        const encodedPassword = sha256(password);
        const user = await User.findOne({ email: email, password: encodedPassword });

        // Si no encontramos el usuario, retornamos un error
        if (!user) {
            res.status(401); // Unauthorized
            res.json({ error: credentialsError.message });
            return;
        }

        // Si el usuario existe y la password coincide, creamos el token de autenticación
        jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => {
            if (err) {
                return next(err);
            }
            // Y lo devolvemos
            res.json({ success: true, token: token });
        });
    } catch (err) {
        next(err);
    }
});

/**
 * PUT /users
 * Registra a un usuario
 *
 * Parámetros obligatorios:
 * name: String
 * email: String
 * password: String
 *
 * Parámetros opcionales
 * lang: String
 */
router.put('/', [
    // Validaciones
    check('email').isEmail()
], (req, res, next) => {
    try {
        // Recogemos los datos del usuario a registrar
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // Validaciones
        if (!name || !email || !password) {
            res.status(412); // Precondicion Failed
            const lang = req.body.lang
            const userDataError = CustomError.CustomError('BAD_USER_DATA', lang);
            res.json({ error: userDataError.message });
            return;
        }
        validationResult(req).throw();

        // Guardamos la contraseña en Base64
        const encodedPassword = sha256(password);
        req.body.password = encodedPassword

        const user = new User(req.body);

        // Lo persistimos en la colección de agentes
        user.save((err, savedUser) => {
            if (err) {
                next(err);
                return;
            }
            savedUser['password'] = undefined; // Eliminamos la contraseña para no retornarla
            res.json({ success: true, result: savedUser })
        });
    } catch (err) {
        next(err);
    }
});

// Exporto el router de usuarios
module.exports = router;
