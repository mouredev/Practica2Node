/**
 * Modelo usuarios
 */

'use strict';

const mongoose = require('mongoose');

// Esquema para usuarios
const userSchema = mongoose.Schema({
    name: String,
    email: { type: String, index: true, unique: true }, // El email tiene que ser único y con un indice para mejorar las búsquedas
    password: String
});

// Índice por email y password para facilitar el proceso de login
userSchema.index({ "email" : 1, "password" : 1 })

// Modelo
const User = mongoose.model('User', userSchema);

module.exports = User;