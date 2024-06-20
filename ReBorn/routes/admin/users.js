const express = require('express');
const router = express.Router();
const admin = require('../../models/admin/admin')

router.get('/', async (req, res) => {
	if (req.user && req.user.role === 'ADMIN') {
		const users = await admin.getUsers();

		res.render('layouts/layoutAdmin', {
			title: 'Admin - Dashboard',
			page: '../pages/admin/users',
			user: req.user,
			session: req.session,
			error: false,
			errorMessage: '',
			users: users,
			styles: false,
			scripts: false,
		})
	} else {
		res.redirect('/login');
	}
})

module.exports = router;