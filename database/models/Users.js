import { db } from './db_connection';
// const db = require('./db_connection');
const bcrypt = require('bcryptjs');

class User {
	constructor(
		firstname,
		lastname,
		username,
		role,
		phone,
		password,
		date_created,
		date_modified
	) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.username = username;
		this.role = role;
		this.phone = phone;
		this.password = password;
		this.date_created = date_created;
		this.date_modified = date_modified;
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
			date_created TEXT,
			date_modified TEXT
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
			 VALUES(?,?,?,?,?,?,?,?,?) `,
			[
				this.lastID,
				user.firstname,
				user.lastname,
				user.username,
				user.role,
				user.phone,
				user.password,
				user.date_created,
				user.date_modified,
			]
		);

		const data = await db.get(`SELECT * FROM users where id=?`, res);
		return data;
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

	static getLastId(user) {
		const res = db.get(`SELECT * FROM users where id=?`, user.id);
		return res;
	}

	static async delete(id) {
		await db.run(`DELETE FROM users WHERE id = ${id}`);
		return { message: 'deleted' };
	}
	static async update(user) {
		const res = await db.update(
			`UPDATE users SET firstname=?, lastname=?,username=?,
		role=?,phone=?,password=?,date_created=?,date_modified=? WHERE id=?`,
			[
				user.firstname,
				user.lastname,
				user.username,
				user.role,
				user.phone,
				user.password,
				user.date_created,
				user.date_modified,
				user.id,
			]
		);
		console.log(`-----changes:update:${res}`);
		return res;
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
