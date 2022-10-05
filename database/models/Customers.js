import {db} from './db_connection'

class Customer{

    constructor(name,shop_name,shop_address,phone){
        this.name = name,
        this.shop_name = shop_name,
        this.shop_address = shop_address,
        this.phone  = phone
        
    }

    static createTable(){
        let sql = `CREATE TABLE IF NOT EXISTS  customers(
            id  INTEGER PRIMARY KEY,
            name    TEXT,
            shop_name TEXT,
            shop_address TEXT,
            phone TEXT
        )`

        return db.run(sql)
    }

    static async insert(name,shop_name,shop_address,phone){
    
       const res = await db.run(` INSERT INTO customers VALUES(?,?,?,?,?) `,
                [this.lastID,name,shop_name,shop_address,phone],(err)=>{
                    if (error) {
                        console.log(error)
                        return
                    } else {
                       console.log("Last ID: " + this.lastID)
                       return
                    }
            })
    }

    static getAll(){
      return db.all(`SELECT * FROM customers`)
    }

    static delete(id){
        db.run(`DELETE FROM customers WHERE id = ${id}`)
        return console.log("item deleted")
    }
}

export default Customer