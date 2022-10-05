import {db} from './db_connection'

class Payment{
    constructor(invoice_id,customer_id,amount_paid){
        this.invoice_id = invoice_id,
        this.customer_id = customer_id,
        this.amount_paid = amount_paid
    }

    static createTable(){
        
        let sql = `CREATE TABLE IF NOT EXISTS  payments(
            id  INTEGER PRIMARY KEY,
            invoice_id INTEGER,
            customer_id INTEGER,
            amount_paid DOUBLE,
            FOREIGN KEY(invoice_id)
                REFERENCES invoices(id)
            FOREIGN KEY(customer_id)
                REFERENCES  customers(id)
        )`

        return db.run(sql)
        
    }

    static async insert(invoice_id,customer_id,amount_paid){
        db.run(`INSERT INTO inventories VALUES(?,?,?,?)`,
            [this.lastID,invoice_id,customer_id,amount_paid])
    }

    

    static getAll(){
        return db.all('SELECT * FROM  payments')
    }

    static delete(id){
        db.run(`DELETE FROM payments WHERE id = ${id}`)
        return console.log("payment deleted")
    }
}


export default Payment