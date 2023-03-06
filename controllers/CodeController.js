const Code =  require('../schemas/code.model')
const randomizer = require('randomstring')
const fetch = require('node-fetch')
const FormData = require('form-data')
const Used = require('../schemas/virtuals/used.model')


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
                code: randomizer.generate(6),
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
    const data = await Code.find({orgId: orgid}).populate({
        path:'used'
    })
    return res.json(data)
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

    
    try{
    const client = require('twilio')()
    
    const provider = await client.lookups.v1.phoneNumbers('+234'+number)
    .fetch({ type: ['carrier'] })
    .then(phone_number => {
        return phone_number.carrier.name === "MTN"? 'mtn': phone_number.carrier.name === "Airtel Nigeria" ? 'airtel' : phone_number.carrier.name === "Globacom (GLO)" ? 'glo' : phone_number.carrier.name === "9Mobile Nigeria (Etisalat)" ? 'etisalat' : null
    })
    const found = await Code.findOne({code: code}).exec()
    if(!found) return res.status(404).json({status: 404, message:"code doesn't exist"})
    const used = Used.findOne({refId: found._id})
    if(used) return res.status(403).json({status: 403, message:"Already used"})

    
    const value = found.value
    function pad2(n) { return n < 10 ? '0' + n : n }
    const date = new Date();
    const dd = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() )
    const reqid = dd+randomizer.generate(5)
    
    let formdata = new FormData();
    formdata.append("serviceID", provider);
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
    
    const usedNow = new Used({refId: found._id, number:number, status:true})
    return res.json(found)
}catch(e){
    console.log(e)
}
}

const deleteCode = async(req, res) => {

}

module.exports = {createCode, getAllCode, redeemCode, getSingleOrgData, deleteCode}
  