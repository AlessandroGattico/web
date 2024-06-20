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
		res.status(500).send('Errore del server');
	}
});

router.post('/buy', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/dashboard')
		} else if (req.user && req.user.role === 'USER') {
			const userId = req.user.id;

			const cartItems = await prod.getCartItemsByUserId(userId);

			let total = 0;
			for (const item of cartItems) {
				total += item.prezzo;
			}

			const saldoUtente = parseFloat(req.user.saldo)

			if (saldoUtente >= total) {
				const updatedUsers = [];

				for (const item of cartItems) {
					const nuovoSaldoUtente = saldoUtente - item.prezzo;
					updatedUsers.push(userDao.updateBorsellino(userId, nuovoSaldoUtente));

					const product = await prod.getProductById(item.id);
					const ownerId = product.owner;
					const nuovoSaldoProprietario = await userDao.getBorsellinoUser(ownerId) + item.prezzo;
					updatedUsers.push(userDao.updateBorsellino(ownerId, nuovoSaldoProprietario));

					await prod.addToAcquistati(item.id, userId);

					await prod.updateProductAvailability(item.id, 0);

					await prod.removeFromCart(item.id, userId);
				}

				await Promise.all(updatedUsers);

				req.flash('success', 'Acquisto completato con successo!');
				res.redirect('/');
			} else {
				req.flash('error', 'Saldo insufficiente per completare l\'acquisto');
				res.redirect('/cart');
			}
		} else {
			res.redirect('/login');
		}
	} catch (err) {
		req.flash('error', 'Errore durante il checkout');
		res.redirect('/cart');
	}
});

module.exports = router;