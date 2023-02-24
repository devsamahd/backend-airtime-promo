const express = require('express')
const mongoose = require('mongoose')
const DB = require('./lib/dbConnect')
const cors = require('cors')
const App = express()
require('dotenv').config()
const PORT = process.env.PORT || 310

DB()
App.use(cors())


App.use(express.urlencoded({extended: false}))
App.use(express.json())

App.use('/generateCode',require('./routes/code.routes'))

mongoose.connection.once('open',()=>{
    App.listen(PORT, ()=>{ console.log('connected') })
})
