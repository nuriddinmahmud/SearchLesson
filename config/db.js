const {Sequelize, DataTypes} =  require("sequelize")

const db = new Sequelize(
    'root', 
    '12345678',
    'db',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)


async function connect(){
    await db.authenticate()
    console.log('Connection has been established successfully.')
    // db.sync({force: true})
    console.log('Database synced.')
}

module.exports = {db, DataTypes, connect}