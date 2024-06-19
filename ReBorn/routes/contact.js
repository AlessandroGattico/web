const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');

router.get('/', async (req, res) => {
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
});

router.post('/send', async (req, res) => {
	if (req.user && req.user.role === 'ADMIN') {
		res.redirect('/admin/dashboard')
	} else {
		res.redirect('/')
	}
})

module.exports = router;