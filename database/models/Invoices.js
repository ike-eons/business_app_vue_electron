import {db} from './db_connection'

class Invoice{

    constructor(total,date){
        this.total = total,
        this.date = date
        
    }

    static createTable(){
        let sql = `CREATE TABLE IF NOT EXISTS  invoices(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            total    FLOAT,
            date DATETIME
        )`

        return db.run(sql)
    }

    static insert(total,date){
        return db.run(` INSERT INTO invoices VALUES(?,?,?) `,
                [this.lastID,total,date]
            )
    }
    static getAll(){
      return db.all(`SELECT * FROM invoices`)
    }

    static show(id){
        let invoice = db.get(`SELECT * FROM invoices where id=?`,[id],(err,row)=>{
            if(err){
                return console.log(err)
            }
        })
        return invoice
    }
    
    static delete(id){
        db.run(`DELETE FROM invoices WHERE id = ${id}`)
        return console.log("item deleted")
    }

    static async getLastId(){
        const res =  await db.get(`SELECT id FROM invoices ORDER BY id desc limit 1`,[],(err,row)=>{
            if(err){
                return console.log(err)
            }
            return console.log(row)
        })

        return res
      
    }
}

export default Invoice