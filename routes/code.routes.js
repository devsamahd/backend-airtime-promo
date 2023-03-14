const express = require('express')
const { createCode, getAllCode, redeemCode, deleteCode, getSingleOrgData } = require('../controllers/CodeController')
const cache = require('../middleware/redisCache')
const router = express.Router()

router.route('/')
    .get(cache, getAllCode)
    .post(createCode)
    .put(redeemCode)
    .delete(deleteCode)
router.route('/:orgid')
    .get(cache, getSingleOrgData)
module.exports = router