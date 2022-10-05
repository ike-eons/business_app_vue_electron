import {db} from './db_connection'

class Distributor{

    constructor(company_name,address,phone,email){
        this.company_name = company_name,
        this.address = address,
        this.phone  = phone,
        this.email  = email
        
    }

    static createTable(){
        let sql = `CREATE TABLE IF NOT EXISTS  distributors(
            id  INTEGER PRIMARY KEY,
            company_name    TEXT,
            address TEXT,
            phone TEXT,
            email TEXT
        )`

        return db.run(sql)
    }

    static async insert(company_name,address,phone,email){
    
       const res = await db.run(` INSERT INTO distributors VALUES(?,?,?,?,?) `,
                [this.lastID,company_name,address,phone,email],(err)=>{
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
      return db.all(`SELECT * FROM distributors`)
    }

    static delete(id){
        db.run(`DELETE FROM distributors WHERE id = ${id}`)
        return console.log("item deleted")
    }
}

export default Distributor