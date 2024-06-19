const express = require('express');
const router = express.Router();
const {searchProducts} = require('../models/search');
const cat = require('../models/categs.js');

router.get('/search', async (req, res) => {
	const {categoria, prezzoMax, city, provincia} = req.query;
	const categs = await cat.getCategorieFromDb();

	searchProducts(categoria, prezzoMax, city, provincia, (err, products) => {
		if (err) {
			res.status(500).send("Errore durante la ricerca dei prodotti");
		} else {
			res.render('layouts/layout', {
				prodotti: products,
				title: 'ReBorn - Search',
				categorie: categs,
				page: '../pages/vendi',
				errorMessage: '',
				error: false,
				session: req.session,
				user: req.user,
				styles: false

			});
		}
	});
});

module.exports = router;
