const express = require('express');
const router = express.Router();
const prod = require('../models/products');
const cat = require('../models/categs.js');

router.post('/search', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/users')
		} else {
			console.log('Richiesta:', req.method, req.url);
			console.log(req.body)
			const {nome = '', prezzoMax = '', locazione = ''} = req.body;
			const products = await prod.searchProducts(nome, prezzoMax, locazione);
			const categs = await cat.getCategorieFromDb();

			res.render('layouts/layout', {
				prodotti: products,
				title: 'ReBorn - Search',
				categorie: categs,
				page: '../pages/search',
				errorMessage: req.flash('error'),
				error: req.flash('error').length > 0,
				session: req.session,
				user: req.user,
				scripts: ["https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js", "../js/main.js"
				],
				styles: ['../css/categoria.css', "https://fonts.googleapis.com/css?family=Amatic+SC:400,700&display=swap",
					"https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900&display=swap",
					"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", "../css/style.css"],
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Errore del server');
	}
});


module.exports = router;
