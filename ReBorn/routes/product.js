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

		if (product) {
			let id = 0;
			let inCart = false;

			if (req.user && req.user.role === 'USER') {
				id = req.user.id;
				const cart = await prod.getCartItemsByUserId(id);

				inCart = cart.some(item => item.id === product.id);
			}

			const photos = await prod.getProductImagesById(product.id) || [];
			const allCategs = await cat.getCategorieFromDb();
			const randomProducts = await prod.getRandomProducts(4, product.categoria, productId, id);


			photos.push(product.foto_info);

			res.render('layouts/layout', {
				title: 'ReBorn - Product',
				product: product,
				images: photos,
				categorie: allCategs,
				randomProducts,
				errorMessage: req.flash('error'),
				error: req.flash('error').length > 0,
				scripts: ["https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"],
				styles: ['../../css/categoria.css', "https://fonts.googleapis.com/css?family=Amatic+SC:400,700&display=swap",
					"https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900&display=swap",
					"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", "../../css/style.css"],
				page: '../pages/product',
				inCart: inCart
			});
		} else {
			// ... (gestione del caso in cui il prodotto non viene trovato)
		}
	}
});

module.exports = router;