const Org = require("../schemas/Org.model")

const createOrg = async(req, res) => {
    const orgName = req.body.orgname
    const addorg = new Org({
        orgName
    })
    const data = await addorg.save()
    return res.json(data)
}

const updateOrg = async(req, res) => {
    const orgId = req.body.orgId
    const newName = req.body.orgName
    const found = await Org.findOne({_id: orgId}).exec()
    if(!found) return res.json({message: 'Org doesn\'t exist'})
    found.orgName = newName
    const data = await found.save()
    return res.json(data)
}

const getAllOrg = async(req, res) => {
    const orgs = await Org.find().populate({path:'codeCount'})
    return res.json(orgs)
}

const getSingleOrg = async(req, res) => {
    const id = req.params.orgid
    const data =await Org.findOne({_id: id}).populate({path:'codeCount usedCode unusedAirtimeCode unusedRaffleCode raffleCode airtimeCode'}).lean()
    return res.json(data)
}
const deleteOrg = async(req, res) => {
    const orgId = req.params.orgid
    const found = await Org.findOne({_id: orgId}).exec()
    if (!found) return res.status(404).json({message:"not found"})
    found.remove()
    const re=await found.save()
    return res.json(re)
}

module.exports = {createOrg, updateOrg, getAllOrg, getSingleOrg, deleteOrg}