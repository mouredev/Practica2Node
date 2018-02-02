/**
 * Script de inicialización de BBDD
 * Borra las tablas e carga los anuncios por defecto
 */

'use strict'

// Cargamos el conector a la base de datos. No lo asignamos, solo queremos que se ejecute
require('dotenv').config();
require('../lib/connectMongoose');

// Cargamos lo modelos
const User = require('../models/User');
const Advertisement = require('../models/Advertisement');

// Leo y parseo el JSON con los datos por defecto de la BBDD
const fs = require('fs');
const demoJSONData = JSON.parse(fs.readFileSync('./bbdd/demo_data.json', 'utf8'));
const demoAdvertisements = demoJSONData['advertisements'];
const demoUsers = demoJSONData['users'];

// Operaciones sobre BBDD

function removeUsers () {
    return User.remove({}, () => {
        console.log('Usuarios eliminados')
    });
}

function createUsers () {
    // Insertamos los usuarios por defecto
    console.log('Insertando usuarios por defecto')

    return User.create(demoUsers, (err, res) => {
        if (err) {
            console.log('Error insertando usuarios')
        } else {
            console.log('Usuarios insertados')
        }
    });
}

function removeAdvertisements () {
    return Advertisement.remove({}, () => {
        console.log('Anuncios eliminados')
    });
}

function createAdvertisements () {
    // Insertamos los anuncios por defecto
    console.log('Insertando anuncios por defecto')

    return Advertisement.create(demoAdvertisements, (err, res) => {
        if (err) {
            console.log('Error insertando anuncios')
        } else {
            console.log('Anuncios insertados')
        }
    });
}

// Ejecutamos las operaciones de inicialización de BBDD
removeUsers()
    .then(createUsers)
    .then(removeAdvertisements)
    .then(createAdvertisements)
    .then(() => {
        // Finalizamos el proceso
        console.log('Script de inicialización ejecutado correctamente')
        process.exit();
    }).catch(err => {
        console.log('Error inicializando los datos por defecto de la BBDD:', err)

        // Finalizamos el proceso si hay errores
        process.exit(1)
    });
