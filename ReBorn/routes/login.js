const express = require('express');
const passport = require('passport');
const router = express.Router();
const cat = require('../models/categories.js');


router.get('/', async function (req, res, next) {
	const categs = await cat.getCategorieFromDb();

	res.render('layouts/layout', {
		title: 'ReBorn - Login',
		header: '../partials/header',
		categorie: categs,
		page: '../pages/login',
		errorMessage: '',
		error: false,
		session: req.session,
		user: null
	});
});

router.post('/login', function (req, res, next) {
	passport.authenticate('local', async function (err, user, info) {
		if (err) {
			return next(err);
		}

		if (!user) {
			const categs = await cat.getCategorieFromDb();

			return res.render('layouts/layout', {
				title: 'ReBorn - Login',
				header: '../partials/header',
				categorie: categs,
				page: '../pages/login',
				session: req.session,
				user: null,
				errorMessage: "Le credenziali inserite sono errate, per favore riprova.",
				error: true
			});
		}

		req.login(user, function (err) {
			if (err) {
				return next(err);
			}

			userLog = user;

			res.redirect('/');
		});
	})(req, res, next);
});

router.get('/logout', function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		} else {
			userLog = undefined;
			res.redirect('/login');
		}
	});
});


module.exports = router;