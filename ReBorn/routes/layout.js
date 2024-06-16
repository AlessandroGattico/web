const express = require('express');
const router = express.Router();
const db = require('../config/database');
const cat = require('../models/categs');
const path = require("path");
const fs = require("fs");

router.get('/', async function (req, res, next) {
	try {
		const categs = await cat.getCategorieFromDb();

		if (req.user && req.user.role === 'ADMIN') {
			res.render('layouts/layout', {
				title: 'ReBorn - Admin',
				header: '../partials/headerAdmin',
				page: '../pages/admin/dashboard',
				user: req.user
			});
		} else {
			const directoryPath = path.join(__dirname, '../public/img/slider');

			fs.readdir(directoryPath, function (err, files) {
				if (err) {
					console.error("Error finding files: ", err);
					return res.status(500).send("Error finding files.");
				}

				files = files.filter(file => file.endsWith('.png') || file.endsWith('.PNG'));

				res.render('layouts/layout', {
					images: files,
					title: 'ReBorn - Home',
					header: '../partials/header',
					page: '../pages/index',
					categorie: categs,
					user: req.user
				});
			});
		}

	} catch (error) {
		console.error('Failed to fetch categories or render page:', error);
		res.status(500).send('Error while fetching data');
	}
});

module.exports = router;
