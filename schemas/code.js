const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
    code:{type:String, required:true},
    value:{type:Number, required:true},
    type:{type:String, required:true},
    used:{type: Boolean, default: false}
},{timestamps:true})

module.exports = mongoose.model('codes',codeSchema)