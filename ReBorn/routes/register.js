const express = require('express');
const router = express.Router();
const userDao = require('../models/user_dao.js');
const cat = require('../models/categs.js');

router.get('/', async function (req, res, next) {
	const categs = await cat.getCategorieFromDb();

	if (req.user !== undefined) {
		res.redirect('/')
	} else {
		res.render('layouts/layout', {
			title: 'ReBorn - Register',
			categorie: categs,
			page: '../pages/register',
			user: null,
			styles: false,
			scripts: false,
		});
	}
});

router.post('/register', async function (req, res, next) {
	if (Object.keys(req.body).length === 0) {
		console.error('Il corpo della richiesta è vuoto!');
		return res.status(400).send('Errore: nessun dato ricevuto');
	}

	const {username, password, confirmPassword, nome, cognome, via, zipcode, citta, provincia, paese} = req.body;

	const categs = await cat.getCategorieFromDb();
	const existUser = await userDao.controlUserExist(username);

	if (existUser === false) {
		if (password !== confirmPassword) {
			console.log('password')
			res.render('layouts/layout', {
				title: 'ReBorn - Register',
				categorie: categs,
				page: '../pages/register',
				user: null,
				errorMessage: "Le password devono coincidere, per favore riprova.",
				error: true,
				styles: false,
				scripts: false,
			});
		} else if (password.includes(' ') || password.length < 8) {
			console.log('password spazio')
			res.render('layouts/layout', {
				title: 'ReBorn - Register',
				categorie: categs,
				page: '../pages/register',
				user: null,
				errorMessage: "Le password devono essere lunghe almeno 8 caratteri e non devono contenere spazi, per favore riprova.",
				error: true,
				styles: false,
				scripts: false,
			});
		} else {
			const user = {
				username,
				password,
				nome,
				cognome,
				via,
				zipcode,
				citta,
				provincia,
				paese
			};
			await userDao.insertNewUser(user);
			res.redirect('/login');
		}
	} else {
		res.render('layouts/layout', {
			title: 'ReBorn - Register',
			categorie: categs,
			page: '../pages/register',
			user: null,
			errorMessage: "Questa email risulta già registrata, per favore riprova.",
			error: true,
			styles: false,
			scripts: false,
		});
	}
});


module.exports = router;
