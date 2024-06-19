const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');
const prod = require('../models/products.js');

router.get('/:id', async (req, res) => {
	if (req.user && req.user.role === 'ADMIN') {
		res.redirect('/admin/dashboard')
	} else {
		const productId = req.params.id;

		const product = await prod.getProductById(productId);
		product.images = await prod.getProductImagesById(productId);

		console.log(product.photo)

		const allCategs = await cat.getCategorieFromDb()
		const randomProducts = await prod.getRandomProducts(4, product.categoria, productId);

		if (!product) {
			req.flash('error', 'Nessun prodotto trovato per questa categoria');
			return res.redirect('/categories');
		}

		res.render('layouts/layout', {
			title: 'ReBorn - Product',
			product,
			categorie: allCategs,
			randomProducts,
			errorMessage: req.flash('error'),
			error: req.flash('error').length > 0,
			scripts: ["https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js", "../../js/main.js",
				"../../js/owl.carousel.min.js"
			],
			styles: ['../../css/product.css', "https://fonts.googleapis.com/css?family=Amatic+SC:400,700&display=swap",
				"https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900&display=swap",
				"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", "../../css/style.css"],
			page: '../pages/product',
		});
	}
});

module.exports = router;