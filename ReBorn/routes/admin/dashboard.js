const express = require('express');
const router = express.Router();
const cat = require('../../models/categs');
const admin = require("../../models/admin/dashboard");

router.get('/', async (req, res) => {
	if (req.user && req.user.role === 'ADMIN') {
		const registeredUsers = await admin.getUtentiRegistratiUltimi30Giorni();
		const productsListed = await admin.getProdottiVendutiUltimi30Giorni();
		const productsPurchased = await admin.getProdottiAcquistatiUltimi30Giorni();
		const categorie = await cat.getCategorieFromDb();

		res.render('layouts/layoutAdmin', {
			title: 'Admin - Dashboard',
			page: '../pages/admin/dashboard',
			user: req.user,
			session: req.session,
			products: productsPurchased,
			listed: productsListed,
			users: registeredUsers,
			categorie: categorie,
			error: false,
			errorMessage: '',
			scripts: ["https://cdn.jsdelivr.net/npm/chart.js"],
			styles: ["../css/style.css"],
		})
	} else {
		res.redirect('/login')
	}
})

router.get('/prodotti-venduti', async (req, res) => {
	try {
		const categoria = req.query.categoria || '';
		const data = await admin.getProdottiVendutiUltimi30Giorni(categoria);

		const chartData = {
			labels: data.labels,
			datasets: [{
				label: categoria ? categoria : 'Tutti i prodotti',
				data: data.data,
				fill: true,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			}]
		};

		res.json(chartData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Errore del server');
	}
});

router.get('/prodotti-acquistati', async (req, res) => {
	try {
		const categoria = req.query.categoria || '';
		const data = await admin.getProdottiAcquistatiUltimi30Giorni(categoria);

		const chartData = {
			labels: data.labels,
			datasets: [{
				label: categoria ? categoria : 'Tutti i prodotti',
				data: data.data,
				fill: true,
				borderColor: 'rgb(255, 99, 132)',
				tension: 0.1
			}]
		};

		res.json(chartData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Errore del server');
	}
});

module.exports = router;