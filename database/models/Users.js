import { db } from './db_connection';
// const db = require('./db_connection');
const bcrypt = require('bcryptjs');

class User {
	constructor(name, username, role, phone, password, date) {
		(this.name = name), (this.username = username), (this.role = role);
		(this.phone = phone), (this.password = password);
		this.date = date;
	}

	static async createTable() {
		let sql = await `CREATE TABLE IF NOT EXISTS  users(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname TEXT,
            lastname TEXT,
            username TEXT NOT NULL UNIQUE,
			role TEXT,
            phone TEXT,
            password TEXT,
			date TEXT
            )`;
		console.log('users table created');
		return db.run(sql);
	}

	static async insert(user) {
		if (user.password) {
			user.password = await modifyPassword(user.password);
		}
		const res = await db.run(
			` INSERT INTO users
			 VALUES(?,?,?,?,?,?,?,?) `,
			[
				this.lastID,
				user.firstname,
				user.lastname,
				user.username,
				user.role,
				user.phone,
				user.password,
				user.date,
			],
			function (err) {
				if (err) {
					reject({ error: err.message });
				}
				resolve(this.lastID);
			}
		);
		return res;
	}
	static async loginUser(user) {
		console.log(user.username);
		let sql = `SELECT * FROM users WHERE username = ? limit 1`;
		const res = await db.get(sql, [user.username], (err, row) => {
			if (err) {
				return console.error(err.message);
			}
			return row
				? console.log(row.id, row.username)
				: console.log(`no user found with the username: ${user.username}`);
		});

		if (!res || !(await comparePassword(user.password, res.password))) {
			console.log('incorrect username or password');
			return { error: 'incorrect username or password' };
		}
		return res;
	}
	static getAll() {
		console.log('**** getting users ***********');
		return db.all(`SELECT * FROM users`, [], (err, rows) => {
			if (err) {
				throw err;
			}
			return rows;
		});
	}

	static getLastId() {
		const res = db.get(
			`SELECT id FROM users ORDER BY id desc limit 1`,
			[],
			(err, row) => {
				if (err) {
					return console.log(err);
				}
				return console.log(row);
			}
		);
		return res;
	}

	static delete(id) {
		db.run(`DELETE FROM users WHERE id = ${id}`);
		return console.log('item deleted');
	}
}

async function modifyPassword(password) {
	const pass = await bcrypt.hash(password, 10);
	return pass;
}
async function comparePassword(login_pass, user_password) {
	const pass = await bcrypt.compare(login_pass, user_password);
	return pass;
}

export default User;
// module.exports = new User();
