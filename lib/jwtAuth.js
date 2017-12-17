'use strict';

const jwt = require('jsonwebtoken');

// Exportamos un creador de middlewares de autenticación
module.exports = () => {
    return function (req, res, next) {
        // Leer credenciales
        const token = req.body.token || req.query.token || req.get('x-access-token');

        if (!token) {
            const err = new Error('No token provided');
            err.status = 401;
            next(err);
            return;
        }

        // Comprobar credenciales
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
           if (err) {
                const error = new Error('Invalid token');
                error.status = 401;
                next(error);
                return;
           }
           // Continuar, lo guardamos en la request para los siguientes middlewares
           req.user = decoded.user
           req.email = decoded.email

           console.log('Credenciales', req.user, req.email);

           next();
        });
    };
};
