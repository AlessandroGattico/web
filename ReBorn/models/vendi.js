const db = require('../config/database.js');

exports.insertNewProduct = function (product) {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO product (nome, descrizione, foto_info, owner, categoria, prezzo) VALUES (?, ?, ?, ?, ?, ?)`;
		db.run(sql, [product.nome, product.descrizione, product.photo, product.owner, product.categoria, product.prezzo], function (err) {
			if (err) {
				console.error('Errore durante l\'inserimento del prodotto:', err);
				reject(err);
			} else {
				const productId = this.lastID;
				console.log('Prodotto inserito con ID:', productId);
				resolve(productId);
			}
		});
	});
};

exports.insertProductPhotos = function (productId, photos) {
	return new Promise((resolve, reject) => {
		const values = photos.flatMap(photo => [photo, productId]);

		const sql = `INSERT INTO photos (photo, product_id) VALUES (?, ?)`;
		photos.forEach((photo) => {
			db.run(sql, [photo, productId], function (err) {
				if (err) {
					console.error('Errore durante l\'inserimento delle foto:', err);
					reject(err);
				} else {
					console.log('Foto inserite correttamente');
					resolve();
				}
			});
		});
	});
};