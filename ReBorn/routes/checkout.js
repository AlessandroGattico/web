const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');
const prod = require('../models/products.js');
const userDao = require("../models/user_dao");

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

			const indirizzo = await userDao.getUserAddress(req.user.id);

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
				carrello: carrello,
				indirizzo: indirizzo,
				totale: total
			})
		} else {
			res.redirect('/login');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Errore del server');
	}
});

router.post('/buy', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/dashboard')
		} else if (req.user && req.user.role === 'USER') {

		} else {
			res.redirect('/login');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Errore del server');
	}
});

module.exports = router;