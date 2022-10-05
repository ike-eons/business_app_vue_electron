import { db } from './db_connection';

class Category {
	constructor(name, description) {
		(this.name = name), (this.description = description);
	}

	static createTable() {
		let sql = `CREATE TABLE IF NOT EXISTS  categories(
            id  INTEGER PRIMARY KEY,
            name    TEXT,
            description TEXT
        )`;

		return db.run(sql);
	}

	static async insert(name, description) {
		await db.run(
			` INSERT INTO categories VALUES(?,?,?) `,
			[this.lastID, name, description],
			(err) => {
				if (err) {
					console.log(err);
					return;
				} else {
					console.log('Last ID: ' + this.lastID);
					return;
				}
			}
		);
	}

	static async getLastId() {
		// `SELECT id FROM invoices ORDERED BY id desc limit 1`
		const res = await db.get(
			`SELECT id FROM categories ORDER BY id desc limit 1`,
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

	static getAll() {
		return db.all(`SELECT * FROM categories`);
	}

	static async update(id, name, description) {
		return db.run('UPDATE categories SET name=?,description=? WHERE id=?', [
			name,
			description,
			id,
		]);
	}

	static delete(id) {
		db.run(`DELETE FROM categories WHERE id = ${id}`);
		return console.log('item deleted');
	}
}

export default Category;
