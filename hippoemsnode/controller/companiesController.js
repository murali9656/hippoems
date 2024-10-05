const connection = require('../connection/connection');
const creatCompany = (req,res) =>{

    // console.log(req.body);

    connection.query('INSERT INTO `companies`(`company`, `gst`, `person`, `number`, `email`, `state`, `city`, `user_id`) VALUES("' + req.body.name + '","' + req.body.gst + '","' + req.body.contactPerson + '","' + req.body.contactNumber + '","' + req.body.contactEmail + '","'+req.body.state+'","'+req.body.city+'","'+req.body.userId+'")', (err, row, fields) => {

        if (!err) {
            res.status(200).send("Company Created Successfully...")
        }
        else {
            res.status(500).send('Internal server error');
            console.log(err)
        }

    })
};

const viewCompanies = (req, res) => {
    connection.query("SELECT DISTINCT company_name AS value, company_name AS label FROM companies ORDER BY company_name ASC", (err, row) => {
        if (!err) {
            res.status(200).send(row);
        } else {
            console.log(err);
            res.status(500).send("Internal server error");
        }
    });
};

// const singleCompany=(req,res)=>{
//     connection.query('SELECT * FROM `companies` WHERE id="'+req.params.id+'"',(err,row)=>{
//         if(!err){
//             res.status(200).send(row);
//         }
//         else{
//             res.status(400).send("No data found with given ID")
//         }
//     })
// }

const searchByname = (req, res) => {
    const { selectedcompany } = req.params;
    
    if(selectedcompany){
    connection.query('SELECT DISTINCT contact_personame AS value, contact_personame AS label FROM `companies` WHERE company_name = ?', [selectedcompany], (err, row) => {
        if (!err) {
            res.send(row);
        } else {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });}
    
};

const updateCompany = (req, res) => {
    // console.log(req.body)
    connection.query('UPDATE `companies` SET `company_name`="' + req.body.company + '", `gst`="' + req.body.gst + '", `contact_personame`="' + req.body.person + '", `contact_number`="' + req.body.number + '", `contact_email`="' + req.body.email + '" WHERE id="' + req.params.id + '"', (err, row) => {
        if (!err) {
            res.status(200).send("details updated.....")
        } else {
            res.status(400).send("err : ", err)
        }
    })
}






const deleteCompany = (req,res) =>{
    // console.log(req.params.id)
    connection.query('DELETE FROM `companies` WHERE id="' + req.params.id + '"', (err, row, fields) => {

        if (!err) {
            res.status(200).send("Company Deleted Successfully....")
        }
        else {
            res.status(400).send("An Error  Occurred while deleting the company");
        }


    })
}

module.exports = {creatCompany,deleteCompany,viewCompanies,searchByname,updateCompany};