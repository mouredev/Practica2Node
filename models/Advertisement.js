/**
 * Modelo anuncios
 */

'use strict';

const mongoose = require('mongoose');

// Esquema para anuncios
const advertisementSchema = mongoose.Schema({
    name: { type: String, index: true, unique: true }, // Índice por nombre y restricción de unicidad
    sale: Boolean,
    price: Number,
    photo: String,
    tags: [String]
});

// Índice por email y password para facilitar el proceso de login
advertisementSchema.index({ "email" : 1, "password" : 1 })

// Metodo estático para operaciones de listado sobre anuncios
advertisementSchema.statics.list = function(filters, limit, skip) {
    
    // Obtenermos la query sin ejecutarla
    const query = Advertisement.find(filters);
    
    // Paginación
    query.limit(limit);
    query.skip(skip);

   // query.sort(sort); // agentes/?sort=name por ejemplo o ?fields=age name -_id para varios, con -_id no me daría el id
    //query.select(fields);

    // Ejecutamos la query y retornamos una promesa
    return query.exec();
}

// Modelo
const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;