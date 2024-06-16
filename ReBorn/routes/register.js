const express = require('express');
const router = express.Router();
const userDao = require('../models/user_dao.js');
const cat = require('../models/categs.js');

router.get('/', async function (req, res, next) {
	try {
		const categs = await cat.getCategorieFromDb();
		res.render('layouts/layout', {
			title: 'ReBorn - Register',
			header: '../partials/header',
			categorie: categs,
			page: '../pages/register',
			user: null,
		});
	} catch (err) {
		console.error('Errore nel recupero delle categorie:', err);
		res.status(500).send('Errore interno del server.');
	}
});

router.post('/register', async function (req, res, next) {
	console.log('Dati ricevuti:', req.body);

	if (Object.keys(req.body).length === 0) {
		console.error('Il corpo della richiesta è vuoto!');
		return res.status(400).send('Errore: nessun dato ricevuto');
	}

	const {username, password, confirmPassword, nome, cognome, via, zipcode, citta, provincia, paese} = req.body;

	try {
		const categs = await cat.getCategorieFromDb();
		const existUser = await userDao.controlUserExist({username});

		if (existUser === false) {
			if (password !== confirmPassword) {
				res.render('layouts/layout', {
					title: 'ReBorn - Register',
					header: '../partials/header',
					categorie: categs,
					page: '../pages/register',
					user: null,
					errorMessage: "Le password devono coincidere, per favore riprova.",
					error: true
				});
			} else if (password.includes(' ') || password.length < 8) {
				res.render('layouts/layout', {
					title: 'ReBorn - Register',
					header: '../partials/header',
					categorie: categs,
					page: '../pages/register',
					user: null,
					errorMessage: "Le password devono essere lunghe almeno 8 caratteri e non devono contenere spazi, per favore riprova.",
					error: true
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
				header: '../partials/header',
				categorie: categs,
				page: '../pages/register',
				user: null,
				errorMessage: "Questa email risulta già registrata, per favore riprova.",
				error: true
			});
		}
	} catch (err) {
		console.error('Errore durante la registrazione:', err);
		res.status(500).send('Errore interno del server.');
	}
});

module.exports = router;
