const Stats = require("../schemas/stats.model")

const populateStats = async(req, res) => {
    const stats = await Stats.find().populate({path: 'usableCodesCount usedCodesCount orgCount'}).limit(1)
    return res.json(stats)
}
const initiateStates = async(req, res) => {
    const stats = new Stats({})
    const save = await stats.save()
    res.json(save)
}

module.exports = {populateStats, initiateStates}