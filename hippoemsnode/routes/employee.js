const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');

router.route('/')
    .post(employeeController.creatEmployee)

//     .get(employeeController.viewCompanies)

router.route('/:id')
.put(employeeController.updateUser)
.delete(employeeController.deleteUser)

router.get('/:role', employeeController.employeebyRole);


   

// router.route('/:role')
//     .get(employeeController.employeebyRole);



module.exports = router;