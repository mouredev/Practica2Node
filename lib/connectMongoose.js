/**
 * Conector mongoDB con Mongoose
 */

'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

// Librería de promesas
mongoose.Promise = global.Promise;

conn.on('error', err => {
    console.log('Error!', err);
    process.exit(1);
});

conn.once('open', () => {
    console.log(`Conectado a mongoDB en ${mongoose.connection.name}`);
});

mongoose.connect(process.env.DATABASE_URI, {
    // See http://mongoosejs.com/docs/connections.html#use-mongo-client
    useMongoClient: true
});

module.exports = conn;
