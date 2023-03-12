const mongoose = require('mongoose')
const Code = require('./code.model')
const orgSchema = new mongoose.Schema({
        orgName: {type:String, required:true}
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

orgSchema.virtual('usedCode',{
        ref:'codes',
        foreignField: 'orgId',
        localField: '_id',
        match:{usable:false},
        count: true
})
orgSchema.virtual('unusedAirtimeCode',{
        ref:'codes',
        foreignField: 'orgId',
        localField: '_id',
        match:{usable:true, type: 'airtime'},
        count: true
})
orgSchema.virtual('airtimeCode',{
        ref:'codes',
        foreignField: 'orgId',
        localField: '_id',
        match:{ type: 'airtime'},
        count: true
})
orgSchema.virtual('unusedRaffleCode',{
        ref:'codes',
        foreignField: 'orgId',
        localField: '_id',
        match:{usable:true, type: 'raffle'},
        count: true
})
orgSchema.virtual('raffleCode',{
        ref:'codes',
        foreignField: 'orgId',
        localField: '_id',
        match:{type: 'raffle'},
        count: true
})

orgSchema.pre('remove',async function(next){
        const orgId = this._id
        await Code.deleteMany({orgId: orgId})
        next()
})

module.exports = mongoose.model('orgs', orgSchema)