const db = require("../../config/database");

exports.getAllProductsAdmin = function () {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT 
        p.id, p.nome, p.descrizione, p.prezzo, p.available, p.insert_time, p.categoria,
        u.mail AS owner_email 
      FROM product p
      JOIN utenti u ON p.owner = u.id
    `;

		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const products = rows.map(row => ({
					id: row.id,
					nome: row.nome,
					descrizione: row.descrizione,
					prezzo: row.prezzo,
					available: row.available,
					proprietario: row.owner_email,
					categoria: row.categoria,
					time: row.insert_time
				}));
				resolve(products);
			}
		});
	});
};

exports.getUsers = function () {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT id, nome, cognome, mail, role, insert_time FROM utenti';

		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const users = rows.map(row => ({
					id: row.id,
					nome: row.nome,
					cognome: row.cognome,
					mail: row.mail,
					role: row.role,
					time: row.insert_time
				}));
				resolve(users);
			}
		});
	});
};
