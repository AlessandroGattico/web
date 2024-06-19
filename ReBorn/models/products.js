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
				resolve(product);
			}
		});
	});
};

exports.getProductImagesById = function (productId) {
	return new Promise((resolve, reject) => {
		const sql = `
            SELECT ph.photo AS images
            FROM photos ph
            WHERE ph.product_id = ?
        `;

		db.all(sql, [productId], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				const images = rows.map(row => row.images);
				resolve(images);
			}
		});
	});
};


exports.getProductsByCategory = function (categoryName) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT p.*, json_group_array(ph.photo) AS images
      FROM product p
      LEFT JOIN photos ph ON p.id = ph.product_id
      WHERE p.categoria = ?
      GROUP BY p.id
    `;

		db.all(sql, [categoryName], (err, rows) => {
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
					photo: row.photo,
					images: JSON.parse(row.images || '[]')
				}));
				resolve(products);
			}
		});
	});
};


exports.getRandomProducts = function (limit = 4, categoria, idProd) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT *
      FROM product
      WHERE available = 1 AND categoria = ? AND id != ?
      ORDER BY RANDOM()
      LIMIT ?
    `;

		db.all(sql, [categoria, idProd, limit], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

exports.getLatestProducts = function (limit = 8) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT *
      FROM product
      WHERE available = 1
      ORDER BY insert_time DESC
      LIMIT ?
    `;

		db.all(sql, [limit], (err, rows) => {
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



exports.addToFavs = function (productId, userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      INSERT INTO preferiti (product_id, user_id) 
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

exports.removeFromFavs = function (productId, userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      DELETE FROM preferiti 
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

exports.getFavsUserId = function (userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT c.id AS favs_item_id, p.*
      FROM preferiti c
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

exports.addToVenduti = function (productId, userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      INSERT INTO venduti (product_id, user_id) 
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

exports.getVendutiUserId = function (userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      SELECT c.id AS sold_item_id, p.*
      FROM venduti c
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


