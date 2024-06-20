const express = require('express');
const router = express.Router();
const db = require('../config/database');
const cat = require('../models/categs');
const prod = require('../models/products');
const path = require("path");
const fs = require("fs");

router.get('/', async function (req, res, next) {
	if (req.user && req.user.role === 'ADMIN') {
		res.redirect('/admin/users')
	} else {
		let id = 1;

		if (req.user) {
			id = req.user.id;
		}

		const directoryPath = path.join(__dirname, '../public/img/slider');
		const categs = await cat.getCategorieFromDb();
		const products = await prod.getLatestProducts(8, id)

		fs.readdir(directoryPath, function (err, files) {
			if (err) {
				console.error("Error finding files: ", err);
				return res.status(500).send("Error finding files.");
			}

			files = files.filter(file => file.endsWith('.png') || file.endsWith('.PNG'));

			res.render('layouts/layout', {
				images: files,
				title: 'ReBorn - Home',
				page: '../pages/index',
				categorie: categs,
				user: req.user,
				session: req.session,
				products: products,
				styles: ["css/categoria.css", "css/product.css"],
				scripts: false,
				errorMessage: req.flash('error'),
				error: req.flash('error').length > 0,
			});
		});
	}
});

module.exports = router;
