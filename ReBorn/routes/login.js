const express = require('express');
const router = express.Router();
const passport = require('passport');
const {check, validationResult} = require('express-validator');
const cat = require('../models/categs.js');
const prod = require("../models/products");
const userDao = require("../models/user_dao");

router.get('/', async (req, res) => {
	if (req.user) {
		res.redirect('/')
	} else {
		const categs = await cat.getCategorieFromDb();

		res.render('layouts/layout', {
			title: 'ReBorn - Login',
			categorie: categs,
			page: '../pages/login',
			errorMessage: req.flash('error'),
			error: req.flash('error').length > 0,
			session: req.session,
			user: req.user,
			scripts: false,
			styles: false
		});
	}
});

router.post('/login', [
	check('username').isEmail().withMessage('Inserisci un indirizzo email valido'),
	check('password').notEmpty().withMessage('La password è obbligatoria')
], (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		req.flash('error', errors.array().map(err => err.msg));
		return res.redirect('/login');
	}

	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			req.flash('error', info.message);
			return res.redirect('/login');
		}

		req.logIn(user, async (err) => {
			if (err) {
				return next(err);
			}

			userLog = user

			if (user.role === 'ADMIN') {
				return res.redirect('/admin/users');
			} else {
				const carrello = await prod.getCartItemsByUserId(req.user.id)
				const acquistati = await prod.getAcquistatiUserId(req.user.id);
				const indirizzo = await userDao.getUserAddress(req.user.id);

				req.user.carrello = carrello
				req.user.acquistati = acquistati
				req.user.indirizzo = indirizzo

				return res.redirect('/');
			}
		});
	})(req, res, next);
});


router.get('/logout', function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		} else {
			userLog = undefined;
			res.redirect('/');
		}
	});
});


module.exports = router;