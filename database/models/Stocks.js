import {db} from './db_connection'

class Stock{

    constructor(total,stock_reference,distributor_id,date){
        this.total = total,
        this.stock_reference = stock_reference,
        this.distributor_id = distributor_id
        this.date = date
        
    }

    static createTable(){
        let sql = `CREATE TABLE IF NOT EXISTS  stocks(
            id  INTEGER PRIMARY KEY AUTOINCREMENT,
            total    FLOAT,
            distributor_id INTEGER,
            stock_reference TEXT,
            date DATETIME
        )`

        return db.run(sql)
    }

    static insert(total,stock_reference,distributor_id,date){
        return db.run(` INSERT INTO stocks VALUES(?,?,?,?,?) `,
                [this.lastID,total,stock_reference,distributor_id,date]
            )
    }
    static getAll(){
      return db.all(`SELECT * FROM stocks`)
    }

    static delete(id){
        db.run(`DELETE FROM stocks WHERE id = ${id}`)
        return console.log("item deleted")
    }

    static async getLastId(){
        const res =  await db.get(`SELECT id FROM stocks ORDER BY id desc limit 1`,[],(err,row)=>{
            if(err){
                return console.log(err)
            }
            return console.log(row)
        })

        return res
      
    }
}

export default Stock