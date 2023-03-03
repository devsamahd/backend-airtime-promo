const mongoose = require('mongoose')

const orgSchema = new mongoose.Schema({
        orgName: {type:String, required:true},
})

module.exports = mongoose.model('orgs', orgSchema)