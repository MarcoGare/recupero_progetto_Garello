const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('.conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql,par = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, par, function (err, result) {
           if (err) {
              console.error(err);
              reject();
           }
           console.log('done');
           resolve(result);
        });
    })
}

const database = {
    init: (name) => {
        let sql = `INSERT INTO type (name) VALUES (${name})`;
        return executeQuery(sql)
    },
    createTable: async()  => {
        return await executeQuery(`
        CREATE TABLE IF NOT EXISTS todo
            ( 
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            data DATE NOT NULL,
            complete BOOLEAN
            )`);
        
    },
    insert: async (todo) => {
        let sql = `
    INSERT INTO todo( data, name, complete)
    VALUES (?, ?, ?)`;
        return await executeQuery(sql, [ todo.data, todo.name, todo.complete]);
    },
    select: () =>{
        const sql = `
        SELECT id, data, name, complete
        FROM todo`;
        return executeQuery(sql);
    },
    delete: (id) =>{
        let sql = `
        DELETE FROM todo WHERE id=$ID`;
        sql = sql.replace("$ID",id);
        return executeQuery(sql);
    },
    
}

database.createTable().then(() => {
    //PER RESETTARE LA TABELLA
    //executeQuery("DROP TABLE todo");
});
module.exports = database;