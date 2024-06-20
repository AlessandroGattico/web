const express = require('express');
const router = express.Router();
const cat = require('../models/categs.js');
const multer = require('multer');
const sell = require('../models/products');

const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.get('/', async function (req, res, next) {
	if (req.user && req.user.role === 'ADMIN') {
		res.render('layouts/layoutAdmin', {
			title: 'Admin - Dashboard',
			page: '../pages/admin/dashboard',
			errorMessage: 'Pagina accessibile solo da utente standard',
			error: false,
			session: req.session,
			user: req.user,
			styles: ["css/categoria.css"],
			scripts: false,
		});
	} else if (req.user && req.user.role === 'USER') {
		const categs = await cat.getCategorieFromDb();

		res.render('layouts/layout', {
			title: 'ReBorn - Vendi',
			categorie: categs,
			page: '../pages/vendi',
			errorMessage: req.flash('error'),
			error: req.flash('error').length > 0,
			session: req.session,
			user: req.user,
			styles: ["css/categoria.css"],
			scripts: false,
		});
	} else {
		res.redirect('/login')
	}
});

router.post('/vendi', upload.fields([
	{name: 'photo', maxCount: 1},
	{name: 'additionalPhotos', maxCount: 4}
]), async (req, res) => {
	try {
		const newProduct = {
			nome: req.body.name,
			descrizione: req.body.description,
			prezzo: req.body.price,
			categoria: req.body.category,
			owner: req.user.id,
		};

		if (req.files['photo']) {
			const photoBuffer = req.files['photo'][0].buffer;
			newProduct.photo = `data:${req.files['photo'][0].mimetype};base64,${photoBuffer.toString('base64')}`;
		}

		const productId = await sell.insertNewProduct(newProduct);

		if (req.files['additionalPhotos'] && req.files['additionalPhotos'].length > 0) {
			const additionalPhotos = req.files['additionalPhotos'].map(file => ({
				photo: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
				product_id: productId
			}));

			await sell.insertProductPhotos(productId, additionalPhotos);
		} else {
		}

		res.redirect('/');
	} catch (err) {
		req.flash('error', 'Errore durante l\'inserimento del prodotto');
		res.redirect('/vendi');
	}
});


module.exports = router;