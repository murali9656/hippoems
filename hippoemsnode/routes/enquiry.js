const express = require('express');
const router = express.Router();
const enquiryController = require('../controller/enquiryController');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'enquirydocuments/'); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storing
  }
});

const enquirydocuments = multer({ storage: storage });;

router.route('/')
    .post(enquirydocuments.single('file'), enquiryController.creatEnquiry)
  

    .get(enquiryController.viewenquiry)

router.route('/:id')
    .delete(enquiryController.deleteEnquiry)
    .post(enquiryController.updateEnquiry)
    .get(enquiryController.singleEnquiry)


// router.route('/:selectedcompany')
//     .get(companiesController.searchByname);



module.exports = router;