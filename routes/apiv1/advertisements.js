/**
 * Router para anuncios
 */

'use strict';

const express = require('express');
const router = express.Router();
const jwtAuth = require('../../lib/jwtAuth');

// Cargamos el modelo de Advertisement
const Advertisement = require('../../models/Advertisement');

/**
 * Middleware autenticación JWT
 */
router.use(jwtAuth());

/**
 * GET /advertisements
 * Obtiene una lista de anuncios paginados obligatoriamente (para evitar pedir todos a la vez) y con posible filtrado
 *
 * Paginación obligatoria: /{Int limit}/{Int skip}
 *
 * FILTROS:
 * Tag (admite un listado con ?tag={tag1}&tag={tag2}...): /?tag={String tag}
 * Tipo de anuncio: /?sale={String true = venta | String false = búsqueda}
 * Rango de precio (cualquier combinación de min y max): /?price={String min-max | min- | -max | priceequal}
 * Nombre de artículo (Por coincidencia insensitiva desde el principio): /?name={String name}
 */
router.get('/:limit/:skip', async (req, res, next) => {
    try {
        // Paginación
        const limit = parseInt(req.params.limit);
        const skip = parseInt(req.params.skip);

        // Filtro por tag
        const tags = req.query.tag

        // Filtro por tipo de anuncio
        const sale = req.query.sale

        // Filtro por rango de precio
        const price = req.query.price

        // Nombre de artículo
        const name = req.query.name

        // Se aplican los posibles filtros
        const filter = {};
        if (tags) {
            filter.tags = { $all: tags };
        }
        if (sale) {
            filter.sale = sale;
        }
        if (price) {
            if (price.indexOf('-') !== -1) {
                const priceComponents = price.split('-').filter(item => item);
                if (priceComponents.length === 2) {
                    // Rango por mínimo y máximo
                    filter.price = { $gte: priceComponents[0], $lte: priceComponents[1] }
                } else if (price.startsWith('-')) {
                    // Rango por máximo
                    filter.price = { $lte: priceComponents[0] }
                } else {
                    // Rango por mínimo
                    filter.price = { $gte: priceComponents[0] }
                }
            } else {
                // Precio exacto
                filter.price = price
            }
        }
        if (name) {
            filter.name = new RegExp(`^${name}`, 'i');
        }

        const rows = await Advertisement.list(filter, limit, skip);
        res.json({ success: true, result: rows });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /advertisements/tags
 * Obtiene la lista de tags disponibles
 */
router.get('/tags', async (req, res, next) => {
    try {
        const rows = await Advertisement.find().distinct('tags')
        res.json({ success: true, result: rows });
    } catch (err) {
        next(err);
    }
});

// Exporto el router de anuncios
module.exports = router;
