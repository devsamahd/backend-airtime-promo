const Code =  require('../schemas/code')
const randomizer = require('randomstring')


const createCode = async(req, res) => {
    const airtimeValue = [50,100,150,200]
    console.log(req.body)
    const quantity = req.body.quantity
    try{
        for (let i = 0; i < quantity; i++){
            const rand = Math.floor(Math.random()*3)
            const newCode = {
                value: airtimeValue[rand],
                code: randomizer.generate(6)
            }
            const code = new Code(newCode)
            await code.save()
            }
        return res.json({message: `${quantity} new code(s) generated`})
    }catch(err){
        return console.log(err)
    }
}

const getAllCode = async(req, res) => {
    const codes = await Code.find()
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
    if(found.used === true) return res.status(403).json({status: 403,   message:"Already used"})

    
    const value = found.value
    function pad2(n) { return n < 10 ? '0' + n : n }
    const date = new Date();
    const dd = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() )
    const reqid = dd+randomizer.generate(5)
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic ZWFvZ29sZWt3dUBnbWFpbC5jb206WFI2UThMSFc=")
    let formdata = new FormData();
    formdata.append("serviceID", provider);
    formdata.append("amount", value);
    formdata.append("phone", number);
    formdata.append("request_id", reqid);

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
    };

    const fet = await fetch(" https://vtpass.com/api/pay", requestOptions)
    const response = await fet.json()

    if(!response.content) return res.status(400).json(response)
    if(response.content.transactions.status !== "delivered") return res.status(401).json({message:"oops transaction failed"})
    found.used = true
    found.save()
    return res.json(found)
}catch(e){
    console.log(e)
}
}

const deleteCode = async(req, res) => {

}

module.exports = {createCode, getAllCode, redeemCode, deleteCode}
  