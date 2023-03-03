const mongoose = require('mongoose')

const usedSchema = new mongoose.Schema({
    status: {type:Boolean, required:true, default: false},
    number: {type:Number, default: null},
    refId: {type:mongoose.Types.ObjectId, required:true},
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

usedSchema.virtual('code', {
    ref:'codes',
    localField: 'refId',
    foreignField: '_id',
    justOne: true
})

usedSchema.methods.toJSON = function () {
    const _used = this
    const used = _used.toObject()

    delete used.refId;
    return used
}


module.exports = mongoose.model('useds',usedSchema)