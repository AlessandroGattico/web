const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let dbPath = path.join(__dirname, '../', 'database');

let db = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		return console.error('Error opening database', err.message);
	}
	console.log('Database connected successfully.');
});

module.exports = db;
