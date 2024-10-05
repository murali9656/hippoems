const express = require('express');
const router = express.Router();
const myreportsController = require('../controller/myreportsController');

router.route('/')
    .post(myreportsController.creatReport)

    .get(myreportsController.viewReports)

router.route('/:id')
    .delete(myreportsController.deleteReport)
    // .post(companiesController.updateCompany)
    .get(myreportsController.singleReport)




module.exports = router;