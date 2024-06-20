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

exports.getCategoryStats = function () {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT
        c.id,
        c.name,
        COUNT(DISTINCT p.id) AS num_oggetti,
        COUNT(DISTINCT a.product_id) AS num_acquistati,
        c.insert_time 
      FROM categories c
      LEFT JOIN product p ON c.name = p.categoria
      LEFT JOIN acquistati a ON p.id = a.product_id
      GROUP BY c.id, c.name, c.insert_time 
    `;

		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const categories = rows.map(row => ({
					id: row.id,
					nome: row.name,
					oggetti: row.num_oggetti,
					acquistati: row.num_acquistati,
					time: row.insert_time
				}));
				resolve(categories);
			}
		});
	});
};

exports.addNew = function (categoria) {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO categories (name) VALUES (?)`;

		db.run(sql, [categoria], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};
