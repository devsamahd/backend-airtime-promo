const Code =  require('../schemas/code.model')
const randomizer = require('randomstring')
const fetch = require('node-fetch')
const FormData = require('form-data')
const Used = require('../schemas/used.model')


const createCode = async(req, res) => {
    
    const quantity = req.body.quantity
    const airtimeValue = req.body.value
    const type = req.body.type
    const orgId = req.body.orgId
    try{
        const codes = []
        for (let i = 0; i < quantity; i++){
            
            const newCode = {
                
                value: type==='airtime'? airtimeValue: 0,
                code: randomizer.generate({length:2,charset: 'hex',capitalization: 'uppercase'})+randomizer.generate({length:1,charset: 'numeric'})+randomizer.generate({length:1,charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:2,charset: 'hex',capitalization: 'uppercase'}),
                type, 
                orgId
            }
            codes.push(newCode)
            }
        await Code.insertMany(codes)
        return res.json({message: `${quantity} new code(s) generated`})
    }catch(err){
        return console.log(err)
    }
}



const getSingleOrgData = async(req, res) => {
    const orgid = req.params.orgid
    if(!req.query?.skip && !req.query?.limit && !req.query?.type && !req.query?.status){
        const data = await Code.find({orgId: orgid}).populate({
            path:'used'
        }).sort({createdAt: -1}).hint({orgId: 1}).exec()
        return res.json(data)
    }else if(!req.query?.skip || !req.query?.limit){
    const {type, status }= req.query
    const data = await Code.find({orgId: orgid}).populate({path:'used'}).sort({createdAt: -1})
    const resp = (data.filter(res => (res.type).includes(type) && ((res.usable).toString()).includes(status.toString())))
    
    return res.json(resp)
    }else if(!req.query?.type && !req.query?.status && req.query.skip){
        const { skip }= req.query
        const limit = req.query.limit || 10
        
        const resp = await Code.find({orgId: orgid}).populate({path:'used'}).sort({createdAt: -1}).skip(skip).limit(limit)

        const count = await Code.find({orgId: orgid}).populate({path:'used'}).sort({createdAt: -1}).count()

        return res.json({resp, count})
        
    }
    const { skip, limit, type, status }= req.query
    
    const data = await Code.find({orgId: orgid}).populate({path:'used'}).sort({createdAt: -1})
    const resp = (data.filter(res => (res.type).includes(type) && ((res.usable).toString()).includes(status.toString()))).slice(skip, parseInt(skip)+parseInt(limit))
    const countData = await Code.find({orgId: orgid}).populate({path:'used'}).sort({createdAt: -1})
    const count = (countData.filter(res => (res.type).includes(type) && ((res.usable).toString()).includes(status.toString()))).length
    return res.json({resp, count})
}



const getAllCode = async(req, res) => {
    const codes = await Code.find().populate({
        path:'used'
    })
    return res.json(codes)
}

const redeemCode = async(req, res) => {
    const code = req.body.code
    const number = req.body.number
    const regex = new RegExp(["^", code, "$"].join(""), "i")
    try{
        const found = await Code.findOne({code: regex }).exec()
        if(!found) return res.status(404).json({status: 404, message:"code doesn't exist"})
        const used =await Used.findOne({refId: found._id}).exec()
        if(used?.status === true) return res.status(403).json({status: 403, message:"Already used"})
        
        if(found.type !== "raffle"){  
        
        const value = found.value
        function pad2(n) { return n < 10 ? '0' + n : n }
        const date = new Date();
        const dd = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() )
        const reqid = dd+randomizer.generate(5)
        
        let formdata = new FormData();
        formdata.append("serviceID", "mtn");
        formdata.append("amount", value);
        formdata.append("phone", number);
        formdata.append("request_id", reqid);

        let requestOptions = {
        method: 'POST',
        headers: {"Authorization":process.env.BASIC_AUTH},
        body: formdata,
        redirect: 'follow'
        };

        const fet = await fetch("https://vtpass.com/api/pay", requestOptions)
        const response = await fet.json()

        if(!response.content) return res.status(400).json(response)
        if(response.content.transactions.status !== "delivered") return res.status(401).json({status:"401",message:"oops transaction failed"})
        await Used.insertMany([{refId: found._id, number:number, status:true}])
        found.usable = false
        found.save()
        return res.json(found)
    }
    await Used.insertMany([{refId: found._id, number:number, status:true}])
    found.usable = false
    found.save()
    return res.json(found)
}catch(e){
    console.log(e)
}
}

const deleteCode = async(req, res) => {

}

module.exports = {createCode, getAllCode, redeemCode, getSingleOrgData, deleteCode}
  