const mongoose = require('mongoose')

const statSchema = new mongoose.Schema({
    version: {type: Number, default: 0.1},
    hm: {type: Boolean, default:true},
    ha: {type: Boolean, default:false}
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
statSchema.virtual('usableCodesCount', {
    ref: 'codes',
    localField:'hm',
    foreignField: 'usable',
    count: true
})
statSchema.virtual('usedCodesCount', {
    ref: 'codes',
    localField:'ha',
    foreignField: 'usable',
    count: true
})
statSchema.virtual('orgCount', {
    ref: 'orgs',
    localField: 'hm',
    foreignField: 'active',
    count:true
})



statSchema.methods.toJSON = function () {
    const _stat = this
    const stat = _stat.toObject()

    delete stat.version;
    return stat
}

module.exports = mongoose.model('stats', statSchema)