const express = require("express");
const router = express.Router();
const prod = require('../models/products');
const cat = require('../models/categs')

router.get("/", async (req, res) => {
	if (req.user && req.user.role === "ADMIN") {
		res.redirect('/admin/users')
	} else if (req.user === 'undefined') {
		res.redirect('/')
	} else {
		const categs = await cat.getCategorieFromDb();
		const cart = await prod.getCartItemsByUserId(req.user.id);
		const listed = await prod.getListedUser(req.user.id);
		const sold = await prod.getVendutiUserId(req.user.id);
		const acq = await prod.getAcquistatiUserId(req.user.id);

		res.render('layouts/layout', {
			title: 'ReBorn - Profile',
			page: '../pages/profile',
			user: req.user,
			session: req.session,
			error: req.flash('error'),
			errorMessage: req.flash('error').length > 0,
			styles: false,
			scripts: false,
			categorie: categs,
			carrello: cart,
			listed: listed,
			sold: sold,
			acq: acq,
		})
	}
});

module.exports = router;