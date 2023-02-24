const express = require('express')
const { createCode, getAllCode, redeemCode, deleteCode } = require('../controllers/CodeController')
const router = express.Router()

router.route('/')
    .get(getAllCode)
    .post(createCode)
    .put(redeemCode)
    .delete(deleteCode)

module.exports = router