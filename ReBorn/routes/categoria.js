const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');
const prod = require('../models/products.js');

router.get('/:categoryName', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/users')
		} else {
			let id = 1;

			if (req.user) {
				id = req.user.id;
			}

			const categoryName = req.params.categoryName;

			const products = await prod.getProductsByCategory(categoryName, id);

			const allCategs = await cat.getCategorieFromDb()

			if (!products || products.length === 0) {
				req.flash('error', 'Nessun prodotto trovato per questa categoria');
				return res.redirect('/categories');
			}

			res.render('layouts/layout', {
				title: 'ReBorn - ' + categoryName,
				products,
				allCategs,
				categorie: allCategs,
				categoria: categoryName,
				errorMessage: req.flash('error'),
				error: req.flash('error').length > 0,
				scripts: ["https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js", "../js/main.js"
				],
				styles: ['../css/categoria.css', "https://fonts.googleapis.com/css?family=Amatic+SC:400,700&display=swap",
					"https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900&display=swap",
					"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", "../css/style.css"],
				page: '../pages/categoria',
			});
		}
	} catch (err) {
		res.status(500).send('Errore del server');
	}
});

module.exports = router;