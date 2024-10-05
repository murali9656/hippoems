const express = require('express');
const router = express.Router();
const companiesController = require('../controller/companiesController');

router.route('/')
    .post(companiesController.creatCompany)

    .get(companiesController.viewCompanies)

router.route('/:id')
    .delete(companiesController.deleteCompany)
    .post(companiesController.updateCompany)
    // .get(companiesController.singleCompany)

router.route('/:selectedcompany')
    .get(companiesController.searchByname);



module.exports = router;