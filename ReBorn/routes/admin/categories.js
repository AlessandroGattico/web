const express = require('express');
const router = express.Router();
const userDao = require('../../models/user_dao')
const cat = require('../../models/categs');

router.get('/', async (req, res) => {
	if (req.user && req.user.role === 'ADMIN') {
		const products = await userDao.getAllProductsAdmin();
		const categorie = await cat.getCategoryStats();

		res.render('layouts/layoutAdmin', {
			title: 'Admin - Dashboard',
			page: '../pages/admin/categories',
			user: req.user,
			session: req.session,
			error: false,
			errorMessage: '',
			prodotti: products,
			styles: false,
			scripts: false,
			categorie: categorie
		})
	} else {
		res.redirect('/login');
	}
})

module.exports = router;