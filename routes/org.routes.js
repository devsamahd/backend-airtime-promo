const { createOrg, updateOrg, deleteOrg, getAllOrg, getSingleOrg } = require('../controllers/orgController')

const router = require('express').Router()

router.route('/')
        .get(getAllOrg)
        .post(createOrg)
        .put(updateOrg)
        

router.route('/:orgid')
        .get(getSingleOrg)
        .delete(deleteOrg)


module.exports = router