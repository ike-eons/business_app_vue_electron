import {db} from './db_connection'

class InvoiceItem{

    constructor(invoice_id,product_id,unit_cost,quantity){
        this.invoice_id = invoice_id,
        this.product_id = product_id,
        this.unit_cost = unit_cost,
        this.quantity = quantity
        
    }

    static createTable(){

       let sql = `CREATE TABLE IF NOT EXISTS  invoice_items(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id INTEGER,
            product_id INTEGER,
            unit_cost   FLOAT,
            quantity    INTEGER,
            FOREIGN KEY(invoice_id)
                REFERENCES invoices(id),
            FOREIGN KEY(product_id)
                REFERENCES products(id)
        )`

        return db.run(sql)
    }

    static insert(invoice_id,product_id,unit_cost,quantity){
        return db.run(` INSERT INTO invoice_items VALUES(?,?,?,?,?) `,
                [this.lastID,invoice_id,product_id,unit_cost,quantity]
            )
    }
    static getAll(){
      return db.all(`SELECT * FROM invoice_items`)
    }

    static delete(id){
        db.run(`DELETE FROM invoice_items WHERE id = ${id}`)
        return console.log("item deleted")
    }
}

export default InvoiceItem