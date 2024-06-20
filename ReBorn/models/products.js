const db = require("../config/database");

exports.getProductById = function (productId) {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM product WHERE id = ?`;

		db.get(sql, [productId], (err, row) => {
			if (err) {
				reject(err);
			} else if (!row) {
				resolve(null);
			} else {
				const product = {
					id: row.id,
					nome: row.nome,
					descrizione: row.descrizione,
					prezzo: row.prezzo,
					available: row.available,
					owner: row.owner,
					categoria: row.categoria,
					insert_time: row.insert_time,
					photo: row.foto_info,
				};
				resolve(row);
			}
		});
	});
};

exports.getProductImagesById = function (productId) {
	return new Promise((resolve, reject) => {
		const sql = `
            SELECT photo
            FROM photos
            WHERE product_id = ?;
        `;

		db.all(sql, [productId], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				let images = [];
				rows.forEach(row => {
					images.push(row.photo)
				})
				resolve(images);
			}
		});
	});
};


exports.getProductsByCategory = function (categoryName, idUser = 1) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT p.*, json_group_array(ph.photo) AS images
      FROM product p
      LEFT JOIN photos ph ON p.id = ph.product_id
      WHERE p.categoria = ? and p.owner != ? AND p.available = 1
      GROUP BY p.id
    `;

		db.all(sql, [categoryName, idUser], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const products = rows.map(row => ({
					id: row.id,
					nome: row.nome,
					descrizione: row.descrizione,
					prezzo: row.prezzo,
					available: row.available,
					owner: row.owner,
					categoria: row.categoria,
					insert_time: row.insert_time,
					photo: row.foto_info,
					images: JSON.parse(row.images || '[]')
				}));
				resolve(products);
			}
		});
	});
};


exports.getRandomProducts = function (limit = 4, categoria, idProd, idUser = 0) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT *
      FROM product
      WHERE available = 1 AND categoria = ? AND id != ? AND owner != ?
      ORDER BY RANDOM()
      LIMIT ?
    `;

		db.all(sql, [categoria, idProd, idUser, limit], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

exports.getLatestProducts = function (limit = 8, userId = 1) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT *
      FROM product
      WHERE available = 1 AND owner != ?
      ORDER BY insert_time DESC
      LIMIT ?
    `;

		db.all(sql, [userId, limit], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};


exports.addToCart = function (productId, userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      INSERT INTO cart (product_id, user_id) 
      VALUES (?, ?)
    `;
		db.run(sql, [productId, userId], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};

exports.removeFromCart = function (productId, userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      DELETE FROM cart 
      WHERE product_id = ? AND user_id = ?; 
    `;
		db.run(sql, [productId, userId], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};

exports.getCartItemsByUserId = function (userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT c.id AS cart_item_id, p.*
      FROM cart c
      JOIN product p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;

		db.all(sql, [userId], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

exports.addToAcquistati = function (productId, userId) {

	return new Promise((resolve, reject) => {
		const sql = `
      INSERT INTO acquistati (product_id, user_id) 
      VALUES (?, ?)
    `;
		db.run(sql, [productId, userId], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};

exports.getAcquistatiUserId = function (userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT c.id AS acq_item_id, p.*
      FROM acquistati c
      JOIN product p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;

		db.all(sql, [userId], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

exports.getListedUser = function (userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT *
      FROM product 
      WHERE owner = ?;
    `;

		db.all(sql, [userId], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};


exports.getVendutiUserId = function (userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      	SELECT p.id, p.nome, p.descrizione, p.prezzo, p.foto_info, p.categoria
		FROM product p
		JOIN acquistati a ON p.id = a.product_id
		WHERE p.owner = ?;

    `;

		db.all(sql, [userId], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};


exports.searchProducts = function (nome, prezzoMax, locazione) {
	return new Promise((resolve, reject) => {
		let query = 'SELECT * FROM product p ';
		let params = [];

		if (nome || prezzoMax || locazione) {
			query += 'WHERE ';

			const conditions = [];
			if (nome) {
				conditions.push('p.nome LIKE ?');
				params.push(`%${nome}%`);
			}
			if (prezzoMax) {
				conditions.push('p.prezzo <= ?');
				params.push(parseFloat(prezzoMax));
			}

			if (locazione) {
				conditions.push('(p.city LIKE ? OR p.state LIKE ? OR p.provincia LIKE ?)');
				params.push(`%${locazione}%`, `%${locazione}%`, `%${locazione}%`);
			}

			query += conditions.join(' AND ');

			db.all(query, params, (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		} else {
			resolve([])
		}
	});
};

exports.insertNewProduct = function (product) {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO product (nome, descrizione, foto_info, owner, categoria, prezzo) VALUES (?, ?, ?, ?, ?, ?)`;

		db.run(sql, [product.nome, product.descrizione, product.photo, product.owner, product.categoria, product.prezzo], function (err) {
			if (err) {
				reject(err);
			} else {
				const productId = this.lastID;
				resolve(productId);
			}
		});
	});
};

exports.insertProductPhotos = function (productId, photos) {
	return new Promise((resolve, reject) => {

		const sql = `INSERT INTO photos (photo, product_id) VALUES (?, ?)`;

		photos.forEach((photo) => {
			db.run(sql, [photo.photo, productId], function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	});
};

exports.updateProductAvailability = function (productId, newAvailability) {
	return new Promise((resolve, reject) => {
		const sql = `
      UPDATE product
      SET available = ?
      WHERE id = ?
    `;

		db.run(sql, [newAvailability, productId], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};


