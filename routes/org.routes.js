const { getAllCode } = require('../controllers/CodeController')
const { createOrg, updateOrg, deleteOrg } = require('../controllers/orgController')

const router = require('express').Router()

router.route('/')
        .get(getAllCode)
        .post(createOrg)
        .put(updateOrg)
        .delete(deleteOrg)