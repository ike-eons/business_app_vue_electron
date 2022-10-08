const sqlite3 = require('sqlite3').verbose();
const os = require('os');
const fs = require('fs');

class DatabaseConnection {
	constructor(dbFilePath) {
		dbFilePath = os.homedir();

		//Make database directory if none
		if (!fs.existsSync(`${dbFilePath}/business_app`)) {
			fs.mkdirSync(`${dbFilePath}/business_app`);
		}

		//Create database if does not exit
		if (!fs.existsSync(`${dbFilePath}/business_app/database.sqlite`)) {
			fs.writeFileSync(`${dbFilePath}/business_app/database.sqlite`, '');
		}

		this.sqlitedb = new sqlite3.Database(
			`${dbFilePath}/business_app/database.sqlite`,
			(err) => {
				if (err) {
					console.log('Could not connect to database', err);
					return console.error(err.message);
				} else {
					console.log('connected to database');
				}
			}
		);
	}

	run(sql, params) {
		return new Promise((resolve, reject) => {
			this.sqlitedb.run(sql, params, function (err) {
				if (err) {
					console.log('Error running sql' + sql);
					return reject({
						error: err.name,
						message: err.message,
						stack: err.stack,
						user_message: 'somthing went wrong',
					});
				}
				return resolve(this.lastID);
			});
		});
	}
	update(sql, params) {
		return new Promise((resolve, reject) => {
			this.sqlitedb.run(sql, params, function (err) {
				if (err) {
					console.log('Error running sql' + sql);
					return reject({
						error: err.name,
						message: err.message,
						stack: err.stack,
						user_message: 'somthing went wrong',
					});
				}
				return resolve(this.changes);
			});
		});
	}

	get(sql, params) {
		return new Promise((resolve, reject) => {
			this.sqlitedb.get(sql, params, function (err, row) {
				if (err) {
					return reject(err);
				}
				return resolve(row);
			});
		});
	}

	all(sql, params) {
		return new Promise((resolve, reject) => {
			this.sqlitedb.all(sql, params, function (err, rows) {
				if (err) {
					return reject(err);
				}
				return resolve(rows);
			});
		});
	}
}

// module.exports = new DatabaseConnection();
export let db = new DatabaseConnection();
