const express = require('express');
const router = express.Router();
const admin = require('../../models/admin/admin')

router.get('/', async (req, res) => {
	if (req.user && req.user.role === 'ADMIN') {
		const products = await admin.getAllProductsAdmin();

		res.render('layouts/layoutAdmin', {
			title: 'Admin - Dashboard',
			page: '../pages/admin/products',
			user: req.user,
			session: req.session,
			error: false,
			errorMessage: '',
			prodotti: products,
			styles: false,
			scripts: false,
		})
	} else {
		res.redirect('/login');
	}
})

module.exports = router;