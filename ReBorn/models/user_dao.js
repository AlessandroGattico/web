const bcrypt = require('bcrypt');
const db = require('../config/database.js');

exports.insertNewUser = function (utente) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(utente.password, 10)
			.then((hash) => {
				utente.password = hash;

				const role = 'USER';
				const sql = `INSERT INTO utenti (nome, cognome, mail, password, role)
                             VALUES (?, ?, ?, ?, ?);`;

				db.run(sql, [utente.nome, utente.cognome, utente.username, utente.password, role], function (err) {
					if (err) {
						reject(err);
					} else {
						const userId = this.lastID;
						const addressSql = `INSERT INTO indirizzi (user_id, indirizzo, city, state, zip_code, provincia, is_default)
                                            VALUES (?, ?, ?, ?, ?, ?, ?)`;

						db.run(addressSql, [userId, utente.via, utente.citta, utente.paese, utente.zipcode, utente.provincia, true], function (err) {
							if (err) {
								reject(err);
							} else {
								resolve();
							}
						});
					}
				});
			})
			.catch((err) => {
				reject(err);
			});
	});
};

exports.getUser = function (email, password) {
	return new Promise((resolve, reject) => {
		let sql = 'SELECT * FROM utenti WHERE mail = ?';

		db.get(sql, [email], (err, row) => {
			if (err) {
				reject(err);
			} else if (row === undefined) {
				resolve({error: 'User not found.'});
			} else {
				const user = {
					id: row.id,
					mail: row.mail,
					password: row.password,
					nome: row.nome,
					cognome: row.cognome,
				}

				let check = false;

				if (bcrypt.compareSync(password, row.password)) {
					check = true;
				}

				resolve({user, check});
			}
		});
	});
};


exports.getUserById = function (id) {
	return new Promise((resolve, reject) => {
		const query = 'SELECT * FROM utenti WHERE id = ?';
		db.get(query, [id], (error, row) => {
			if (error) {
				reject(error);
			} else {
				resolve(row);
			}
		});
	});
};


exports.getCheckUser = function (mail) {
	return new Promise((resolve, reject) => {
		let query = `SELECT *
                     FROM utenti
                     WHERE mail = ?;`;

		db.run(query, [mail.username], (error, data) => {
			if (error) {
				reject(error);
			} else if (data[0] === undefined) {
				const ris = 'FREE';

				resolve({ris});
			} else {
				const user = data[0].username;

				resolve(user);
			}
		});
	});
};


exports.insertUser = function (user) {
	return new Promise((resolve, reject) => {
		user.psw = bcrypt.hashSync(user.psw, 10);

		let query = `INSERT INTO utenti (nome, cognome, mail, password, role)
                     VALUES (?, ?, ?, ?, ?)`;

		db.run(query, [user.nome, user.cognome, user.mail, user.psw, 'USER'], (error) => {
			if (error) {
				reject(error);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.updateUser = function (newUser) {
	return new Promise((resolve, reject) => {
		let query = `UPDATE utenti
                     SET mail    = ?,
                         nome    = ?,
                         cognome = ?
                     WHERE mail = ?`;

		db.run(query, [newUser.mail, newUser.nome, newUser.cognome], (error) => {
			if (error) {
				reject(error);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.ctrlOldPassword = function (password) {
	return new Promise((resolve, reject) => {
		password.oldPassword = bcrypt.hashSync(password.oldPassword, 10);

		let query = `SELECT *
                     FROM utenti
                     WHERE password = ?
                       AND mail = ?`;

		db.run(query, [password.oldPassword, userLog.mail], (error, data) => {
			if (error) {
				reject(error);
			} else if (data[0] === undefined) {
				resolve({error: 'User non trovato'});
			} else {
				const oldPassword = data[0].password;
				resolve(oldPassword);
			}
		});
	});
};

exports.controlUserExist = function (email) {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM utenti WHERE mail = ?';

		db.get(sql, [email], (err, row) => {
			if (err) {
				reject(err);
			} else if (row === undefined) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
};

exports.updatePassword = function (newPassword) {
	return new Promise((resolve, reject) => {
		newPassword = bcrypt.hashSync(newPassword, 10);

		let query = `UPDATE utenti
                     SET password = ?
                     WHERE mail = ?`;

		db.run(query, [newPassword, userLog.mail], (error) => {
			if (error) {
				reject(error);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.getUserByEmail = function (email) {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM utenti WHERE mail = ?';

		db.get(sql, [email], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
};

exports.getUserAddress = function (userId) {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM indirizzi WHERE user_id = ?';

		db.get(sql, [userId], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
};


exports.updateBorsellino = function (userId, newAmount) {
	return new Promise((resolve, reject) => {
		const sql = `
      UPDATE utenti
      SET saldo = ?
      WHERE id = ?
    `;

		db.run(sql, [newAmount, userId], function (err, row) {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
};

exports.getBorsellinoUser = function (userId) {
	return new Promise((resolve, reject) => {
		const sql = `
      	SELECT saldo
      	FROM utenti 
      	WHERE id = ?;
    `;

		db.all(sql, [userId], function (err, row) {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
};
