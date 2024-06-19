const express = require('express');
const router = express.Router();
const userDao = require('../../models/user_dao')

router.get('/', async (req, res) => {
	if (req.user && req.user.role === 'ADMIN') {
		const users = await userDao.getUsers();

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