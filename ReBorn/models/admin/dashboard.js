const db = require("../../config/database");

exports.getUtentiRegistratiUltimi30Giorni = function () {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT COUNT(*) AS count, DATE(insert_time) AS date
      FROM utenti
      WHERE insert_time >= DATE('now', '-30 days')
      GROUP BY DATE(insert_time)
    `;

		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const labels = [];
				const data = [];
				rows.forEach(row => {
					labels.push(row.date);
					data.push(row.count);
				});
				resolve({labels, data});
			}
		});
	});
};

exports.getProdottiVendutiUltimi30Giorni = function (categoria = '') { // Aggiunto parametro categoria opzionale
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT COUNT(*) AS count, DATE(p.insert_time) AS date
      FROM product p
      JOIN venduti v ON p.id = v.product_id
      WHERE p.insert_time >= DATE('now', '-30 days')
        AND (p.categoria = ? OR ? = '') 
      GROUP BY DATE(p.insert_time)
    `;

		db.all(sql, [categoria, categoria], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const labels = [];
				const data = [];
				rows.forEach(row => {
					labels.push(row.date);
					data.push(row.count);
				});
				resolve({labels, data});
			}
		});
	});
};

exports.getProdottiAcquistatiUltimi30Giorni = function (categoria = '') { // Aggiunto parametro categoria opzionale
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT COUNT(*) AS count, DATE(p.insert_time) AS date
      FROM product p
      JOIN acquistati a ON p.id = a.product_id
      WHERE p.insert_time >= DATE('now', '-30 days')
        AND (p.categoria = ? OR ? = '') -- Filtro per categoria (o tutte se categoria è vuota)
      GROUP BY DATE(p.insert_time)
    `;

		db.all(sql, [categoria, categoria], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const labels = [];
				const data = [];
				rows.forEach(row => {
					labels.push(row.date);
					data.push(row.count);
				});
				resolve({labels, data});
			}
		});
	});
};
