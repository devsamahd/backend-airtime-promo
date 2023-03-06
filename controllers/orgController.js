const Org = require("../schemas/org.model")

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
    const found = await Org.findOne({_id: orgId})
    if(!found) return res.json({message: 'Org doesn\'t exist'})
    found.orgName = newName
    const data = found.save()
    return res.json(data)
}


const getAllOrg = async(req, res) => {
    const orgs = await Org.find().populate({path:'codeCount'})
    return res.json(orgs)
}


const deleteOrg = async(req, res) => {
    
}

module.exports = {createOrg, updateOrg, getAllOrg, deleteOrg}