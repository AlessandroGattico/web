const db = require('../config/database.js');

const searchProducts = (categoria, prezzoMax, city, provincia, callback) => {
	const sql = `
        SELECT p.*, u.nome as user_name, a.city, a.provincia
        FROM product p
        JOIN utenti u ON p.owner = u.id
        JOIN indirizzi a ON u.id = a.user_id
        WHERE p.categoria = ? AND p.prezzo <= ? AND (a.city = ? OR a.provincia = ?)
        AND a.is_default = 1
        ORDER BY p.insert_time DESC;
    `;
	db.all(sql, [categoria, prezzoMax, city, provincia], (err, rows) => {
		if (err) {
			callback(err);
		} else {
			callback(null, rows);
		}
	});
};

module.exports = {
	searchProducts
};
