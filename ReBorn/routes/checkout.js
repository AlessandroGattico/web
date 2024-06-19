const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');
const prod = require('../models/products.js');

router.get('/', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/dashboard')
		} else if (req.user && req.user.role === 'USER') {
			const categorie = await cat.getCategorieFromDb()
			const carrello = req.user.carrello

			let total = 0;

			carrello.forEach(function (item) {
				total += parseFloat(item.prezzo)
			})

			res.render('layouts/layout', {
				title: 'ReBorn - Checkout',
				page: '../pages/checkout',
				errorMessage: req.flash('error'),
				error: req.flash('error').length > 0,
				styles: false,
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

			await cart.addToCart(productId, userId);
			res.redirect('/product/:productId');
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

			await cart.removeFromCart(productId, userId);
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