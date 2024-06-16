const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');


router.get('/', async function (req, res, next) {
	const categs = await cat.getCategorieFromDb();

	res.render('layouts/layout', {
		title: 'ReBorn - Categories',
		header: '../partials/header',
		categorie: categs,
		page: '../pages/vendi',
		errorMessage: '',
		error: false,
		session: req.session,
		user: req.user
	});
});