const express = require('express');
const router = express.Router();
const versionsController = require('../controller/versionsController');

//Write enquires api's here
router.route('/')
    .post(versionsController.createVersions)
    // .get(versionsController.viewVersions);

router.route('/:id')

    // .post(enquiryController.updateEnquiry)
    // .delete(versionsController.deleteVersions)
    .get(versionsController.singleVersions);

module.exports = router;

