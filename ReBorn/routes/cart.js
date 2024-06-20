const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');
const prod = require('../models/products');

router.get('/', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/dashboard')
		} else if (req.user && req.user.role === 'USER') {
			const categorie = await cat.getCategorieFromDb()

			let total = 0;

			const carrello = await prod.getCartItemsByUserId(req.user.id);

			carrello.forEach(function (item) {
				total += parseFloat(item.prezzo)
			})

			req.user.carrello = carrello

			res.render('layouts/layout', {
				title: 'ReBorn - Cart',
				page: '../pages/cart',
				errorMessage: req.flash('error'),
				error: req.flash('error').length > 0,
				styles: ["css/cart.css"],
				scripts: false,
				user: req.user,
				session: req.session,
				categorie: categorie,
				carrello: req.user.carrello,
				total
			})
		} else {
			res.redirect('/login');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Errore del server');
	}
});

router.get('/add/:productId', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/dashboard')
		} else if (req.user && req.user.role === 'USER') {
			const productId = req.params.productId;
			const userId = req.user.id;

			await prod.addToCart(productId, userId);
			
			req.user.carrello = await prod.getCartItemsByUserId(req.user.id);

			res.redirect('/');
		} else {
			res.redirect('/login');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Errore del server');
	}
});

router.get('/remove/:productId', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/dashboard')
		} else if (req.user && req.user.role === 'USER') {
			const productId = req.params.productId;
			const userId = req.user.id;

			await prod.removeFromCart(productId, userId);

			req.user.carrello = await prod.getCartItemsByUserId(req.user.id);

			res.redirect('/cart');
		} else {
			res.redirect('/login');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Errore del server');
	}
});

module.exports = router;