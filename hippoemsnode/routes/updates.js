const express = require('express');
const router = express.Router();
const updateController = require('../controller/updateController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentuploads/'); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storing
  }
});

const updatedocument = multer({ storage: storage });


router.post("/", updatedocument.single('file'), updateController.createUpdate);
router.delete('/:id',updateController.deleteUpdate)

router.use('/documentuploads', express.static('documentuploads'));

// Route for handling GET requests to retrieve updates
router.get("/", updateController.getUpdate);
router.get("/:ern", updateController.getUpdateByern);

module.exports = router;

