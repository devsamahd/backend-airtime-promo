const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
    code:{type:String, required:true},
    value:{type:Number, required:true},
    type:{type:String, required:true},
    usable: {type:Boolean, default: true},
    orgId: {type:mongoose.Types.ObjectId, index:true, required: true}
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

codeSchema.methods.toJSON = function () {
    const _code = this
    const code = _code.toObject()

    delete code.orgId
    delete code.updatedAt
    return code
}

module.exports = mongoose.model('codes',codeSchema)