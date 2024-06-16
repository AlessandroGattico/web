const db = require('../config/database.js');

exports.getCategorieFromDb = function () {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT name FROM categories';

		db.all(sql, [], (err, results) => {
			if (err) {
				reject(err);
			} else {
				const categorie = results.map(row => row.name);
				resolve(categorie);
			}
		});
	});
}
