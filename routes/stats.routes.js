const {populateStats, initiateStates} = require('../controllers/statsController')

const router = require('express').Router()

router.route('/')
            .get(populateStats)
            .post(initiateStates)

module.exports = router