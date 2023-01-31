const cors = require('cors')
require('dotenv').config()
const express = require('express')
const sequelize = require('./config/db')

const app = express();
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cors())

const start = async () => {
    try {
        await sequelize.authenticate().then(() => {
            console.log("DATABASE CONNECTED! ");
        })
            .catch(err => {
                console.log(err);
            })
        await sequelize.sync()
        app.listen(PORT, () => console.log(`server started, port:${PORT}`))
    } catch (error) {
        console.log(error)
    }
}
start()