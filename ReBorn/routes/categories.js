const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');

router.get('/', async (req, res) => {
	try {
		if (req.user && req.user.role === 'ADMIN') {
			res.render('layouts/layoutAdmin', {
				title: 'Admin - Dashboard',
				page: '../pages/admin/dashboard',
				errorMessage: 'Accesso negato. Questa pagina è riservata agli utenti standard.',
				error: true,
				session: req.session,
				user: req.user,
				styles: false,
				scripts: false
			});
		} else {
			const categs = await cat.getCategorieFromDb()
			res.render('layouts/layout', {
				title: 'ReBorn - Categories',
				categorie: categs,
				page: '../pages/categories',
				errorMessage: req.flash('error'),
				error: req.flash('error').length > 0,
				session: req.session,
				user: req.user,
				styles: ['css/categories.css'],
				scripts: false,
			});
		}
	} catch (err) {
		res.status(500).send('Errore del server');
	}
});

module.exports = router;