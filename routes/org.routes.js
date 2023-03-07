const { createOrg, updateOrg, deleteOrg, getAllOrg, getSingleOrg } = require('../controllers/orgController')

const router = require('express').Router()

router.route('/')
        .get(getAllOrg)
        .post(createOrg)
        .put(updateOrg)
        .delete(deleteOrg)

router.route('/:orgid')
        .get(getSingleOrg)



module.exports = router