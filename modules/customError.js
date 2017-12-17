/**
 * Módulo para creación de errores internacionalizados
 */

'use strict';

const i18n = require('i18n');

exports.CustomError = function (key, locale) {
    console.log(key, locale);
    if (locale) {
        i18n.setLocale(locale)
    } else {
        i18n.setLocale('es')
    }
    const msg = i18n.__(key);
    console.log(msg);
    return new Error(msg);
}
