const Code =  require('../schemas/Code.model')
const randomizer = require('randomstring')
const fetch = require('node-fetch')
const FormData = require('form-data')
const Used = require('../schemas/virtuals/Used.model')


const createCode = async(req, res) => {
    
    const quantity = req.body.quantity
    const airtimeValue = req.body.value
    const type = req.body.type
    const orgId = req.body.orgId
    try{
        for (let i = 0; i < quantity; i++){
            const newCode = {
                
                value: type==='airtime'? airtimeValue: 0,
                code: randomizer.generate(6),
                type, 
                orgId
            }
            const code = new Code(newCode)
            const used = new Used({refId: code._id})
            await used.save()
            await code.save()
            }
        return res.json({message: `${quantity} new code(s) generated`})
    }catch(err){
        return console.log(err)
    }
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
    if(found.used.status === true) return res.status(403).json({status: 403,   message:"Already used"})

    
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
    headers: {"Authorization":"Basic ZWFvZ29sZWt3dUBnbWFpbC5jb206WFI2UThMSFc="},
    body: formdata,
    redirect: 'follow'
    };

    const fet = await fetch(" https://vtpass.com/api/pay", requestOptions)
    const response = await fet.json()

    if(!response.content) return res.status(400).json(response)
    if(response.content.transactions.status !== "delivered") return res.status(401).json({message:"oops transaction failed"})
    const used = Used.
    found.save()
    return res.json(found)
}catch(e){
    console.log(e)
}
}

const deleteCode = async(req, res) => {

}

module.exports = {createCode, getAllCode, redeemCode, deleteCode}
  