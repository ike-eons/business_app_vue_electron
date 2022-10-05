import {db} from './db_connection'

class StockItem{

    constructor(stock_id,product_id,unit_cost,quantity){
        this.stock_id = stock_id,
        this.product_id = product_id,
        this.unit_cost = unit_cost,
        this.quantity = quantity
        
    }

    static createTable(){

       let sql = `CREATE TABLE IF NOT EXISTS  stock_items(
            id  INTEGER PRIMARY KEY,
            stock_id INTEGER,
            product_id INTEGER,
            unit_cost   FLOAT,
            quantity    INTEGER,
            FOREIGN KEY(stock_id)
                REFERENCES stocks(id),
            FOREIGN KEY(product_id)
                REFERENCES products(id)
        )`

        return db.run(sql)
    }

    static insert(stock_id,product_id,unit_cost,quantity){
        return db.run(` INSERT INTO stock_items VALUES(?,?,?,?,?) `,
                [this.lastID,stock_id,product_id,unit_cost,quantity]
            )
    }
    static getAll(){
      return db.all(`SELECT * FROM stock_items`)
    }

    static delete(id){
        db.run(`DELETE FROM stock_items WHERE id = ${id}`)
        return console.log("item deleted")
    }
}

export default StockItem