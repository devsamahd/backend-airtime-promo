const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
    code:{type:String, required:true},
    value:{type:Number, required:true},
    type:{type:String, required:true},
    orgId: {type:mongoose.Types.ObjectId, required: true}
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

codeSchema.virtual('used', {
    ref:'useds',
    localField: '_id',
    foreignField: 'refId',
    justOne:true
})  

module.exports = mongoose.model('codes',codeSchema)