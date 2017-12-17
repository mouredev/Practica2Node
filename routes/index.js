const express = require('express');
const router = express.Router();

// Transformamos el markdown en html
const marked = require('marked');
const fs = require('fs');
const readMe = fs.readFileSync('./README.md', 'utf8');
const markdownReadMe = marked(readMe);
fs.writeFileSync('./public/html/README.html', markdownReadMe);

/* GET home page. */
router.get('/', function (req, res, next) {
   res.render('index', {
   title: 'Práctica JS/Node.js/MongoDB Boot VI (2017)',
   author: 'por Brais Moure Morais'
   });
});

module.exports = router;
