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

App.get('/', (req, res)=>{return res.status(200).json({message:"server is running, Hurray!"})})

App.use('/generateCode', require('./routes/code.routes'))
App.use('/org', require('./routes/org.routes'))

mongoose.connection.once('open',()=>{
    const httpServer =  App.listen(PORT, ()=>{ console.log('connected') })
    httpServer.setTimeout(1000)
})
