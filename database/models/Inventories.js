import {db} from './db_connection'

class Inventory{
    constructor(product_id,available_quantity,available_amount){
        this.product_id = product_id
        this.available_amount = available_amount
        this.available_quantity = available_quantity
    }

    static createTable(){
        
        let sql = `CREATE TABLE IF NOT EXISTS  inventories(
            id  INTEGER PRIMARY KEY,
            product_id INTEGER,
            available_quantity INTEGER,
            available_amount DOUBLE,
            FOREIGN KEY(product_id)
                REFERENCES products(id)
        )`

        return db.run(sql)
        
    }

    static async insert(product_id,available_amount,available_quantity){
        db.run(`INSERT INTO inventories VALUES(?,?,?,?)`,
            [this.lastID,product_id,available_quantity,available_amount])
    }

    static async updateOnInvoice(product_id,available_amount,available_quantity){
        let row = await db.get('SELECT * FROM inventories WHERE product_id = ?',
                [product_id])

                let amt = available_amount - row.available_amount
                let qty =available_quantity- row.available_quantity
        // console.log(row)
        // console.log(amt)
        // console.log(qty)
        return db.run( `UPDATE inventories SET available_quantity=?, available_amount=? WHERE product_id = ?`,
                [qty,amt,product_id])   
    }

    static updateOnStock(product_id,available_amount,available_quantity){
        let row = db.all('SELECT * FROM inventories WHERE product_id = ?',
        [product_id])

        let amt = available_amount + row.available_amount
        let qty =available_quantity + row.available_quantity

        return db.run( `UPDATE inventories SET available_quantity=?, available_amount=? WHERE product_id = ?`,
                [qty,amt,product_id ])   
            }
    static getAll(){
        return db.all('SELECT * FROM inventories')
    }
}


export default Inventory