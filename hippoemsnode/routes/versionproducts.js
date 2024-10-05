const express = require('express');
const router = express.Router();
const versionproductsController = require('../controller/versionproductsController');

//Write enquires api's here
router.route('/')
    .post(versionproductsController.createversionproduct)
    .get(versionproductsController.viewversionproduct);

// router.route('/:id')

//     .post(enquiryController.updateOrder)
//     .delete(enquiryController.deleteOrder)
//     .get(enquiryController.singleOrder);

module.exports = router;

