const connection = require('../connection/connection');

const creatEmployee=(req,res)=>{
    connection.query('INSERT INTO `users`(`username`, `email`, `password`, `contact_number`, `role`) VALUES ("'+req.body.name+'","'+req.body.email+'","'+req.body.password+'","'+req.body.contact+'","'+req.body.role+'")',((err,row)=>{
        if(!err){
          res.status(200).send('Add Successfullyyyy')
        }
        else{
          console.log(err);
          res.status(500).send('Internal server error...')
        }
      }))
};

const employeebyRole = (req, res) => {
    const role = req.params.role;

    // Use parameterized queries to avoid SQL injection
    const query = 'SELECT * FROM `users` WHERE `role` = ?';
    connection.query(query, [role], (err, rows) => {
        if (!err) {
            res.status(200).send(rows);
        } else {
            console.error(err);
            res.status(500).send('Internal server error...');
        }
    });
};

const updateUser=(req,res)=>{
    connection.query('UPDATE `users` SET `username` = "'+req.body.username+'", `email` = "'+req.body.email+'", `password`="'+req.body.password+'", `contact_number`="'+req.body.contact_number+'" WHERE id="'+req.params.id+'"',((err,result)=>{
        if(!err){
            res.status(200).send('Update Successfullyyyy')
        }
        else{
            console.log(err);
            res.status(500).send('Internal server error...')
        }
    }))
}

const deleteUser=(req,res)=>{
    connection.query('DELETE FROM `users` WHERE id="'+req.params.id+'"',((err,result)=>{
        if(!err){
            res.status(200).send('Delete Successfullyyyy')
        }
        else{
            console.log(err);
            res.status(500).send('Internal server error...')
        }
    }))
}

module.exports = {creatEmployee,employeebyRole,updateUser,deleteUser}