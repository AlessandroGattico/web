const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');

router.get('/', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/dashboard')
		} else {
			const categorie = await cat.getCategorieFromDb();

			res.render('layouts/layout', {
				title: 'ReBorn - Contact',
				page: '../pages/contact',
				errorMessage: req.flash('error'),
				error: req.flash('error').length > 0,
				styles: false,
				scripts: false,
				user: req.user,
				session: req.session,
				categorie: categorie,
			})
		}
	} catch (err) {
		res.status(500).send('Errore del server');
	}
});

router.post('/send', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.redirect('/admin/dashboard')
		} else {
			res.redirect('/')
		}
	} catch (err) {
		res.status(500).send('Errore del server');
	}
})

module.exports = router;