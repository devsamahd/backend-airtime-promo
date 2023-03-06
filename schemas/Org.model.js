const mongoose = require('mongoose')
const orgSchema = new mongoose.Schema({
        orgName: {type:String, required:true},
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})
orgSchema.virtual('codeCount',{
        ref:'codes',
        foreignField: 'orgId',
        localField: '_id',
        count: true
})

module.exports = mongoose.model('orgs', orgSchema)