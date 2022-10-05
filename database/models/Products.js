import {db} from './db_connection'

class Product{

    constructor(description,stock_price,sales_price,category_id){
        this.description = description,
        this.stock_price = stock_price,
        this.sales_price = sales_price,
        this.category_id = category_id
        
    }

    static createTable(){
        let sql = `CREATE TABLE IF NOT EXISTS  products(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            stock_price FLOAT,
            sales_price FLOAT,
            category_id INTEGER,
            FOREIGN KEY(category_id)
                REFERENCES categories(id)
        )`

        return db.run(sql)
    }

    static insert(description,stock_price,sales_price,category_id){
        return db.run(` INSERT INTO products VALUES(?,?,?,?,?) `,
                [this.lastID,description,stock_price,sales_price,category_id]
            )
    }
    static getAll(){
      return db.all(`SELECT * FROM products`)
    }

    static async getLastId(){
      const res =  await db.get(`SELECT id FROM products ORDER BY id desc limit 1`,[],(err,row)=>{
            if(err){
                return console.log(err)
            }
            return console.log(row)
        })
        return res
      
    }

    static delete(id){
        db.run(`DELETE FROM products WHERE id = ${id}`)
        return console.log("item deleted")
    }
}

export default Product