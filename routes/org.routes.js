const { createOrg, updateOrg, deleteOrg, getAllOrg } = require('../controllers/OrgController')

const router = require('express').Router()

router.route('/')
        .get(getAllOrg)
        .post(createOrg)
        .put(updateOrg)
        .delete(deleteOrg)



module.exports = router