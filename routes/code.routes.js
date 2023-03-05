const express = require('express')
const { createCode, getAllCode, redeemCode, deleteCode, getSingleOrgData } = require('../controllers/CodeController')
const router = express.Router()

router.route('/')
    .get(getAllCode)
    .post(createCode)
    .put(redeemCode)
    .delete(deleteCode)
router.route('/:orgid')
    .get(getSingleOrgData)
module.exports = router