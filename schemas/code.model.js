const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
    code:{type:String, required:true},
    value:{type:Number, required:true},
    type:{type:String, required:true},
    used:{type:Boolean, default: false},
    number:{type:Number, default: null},
    orgId: {type:String, default: null}
},{timestamps:true})


module.exports = mongoose.model('codes',codeSchema)