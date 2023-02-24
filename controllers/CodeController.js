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
    const found = await Code.findOne({code: code}).exec()
    if(!found) return res.status(404).json({status: 404, message:"code doesn't exist"})
    if(found.used === true) return res.status(403).json({status: 403,   message:"Already used"})
    found.used = true
    found.save()
    return res.json(found)
}

const deleteCode = async(req, res) => {

}

module.exports = {createCode, getAllCode, redeemCode, deleteCode}
  