const connection = require('../connection/connection');

const createUpdate = (req, res) => {
    const filename = req.file && req.file.filename ? req.file.filename : '---';
  
    const { ern, user, update, date } = JSON.parse(req.body.details);
  
     console.log(ern, date, update, user);
  
    const query = 'INSERT INTO `updates` ( `ern`, `update_owner`, `updates`, `documents`, `update_on`) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [ern, user, update, filename, date], (err, result) => {
      if (!err) {
        res.status(200).send('Updated');
      } else {
        console.error('server error'+err);
        res.status(500).send('Internal Server Error');
      }
    });
  }
  

const getUpdate=(req,res)=>{
    connection.query('SELECT * FROM `updates`',(err,row)=>{
            if(!err){
              res.send(row)
        
            }
            else{
              console.log(err)
            }
          })
}

const deleteUpdate = (req, res) => {
  const id = req.params.id;

  connection.query('DELETE FROM `updates` WHERE id = ?', [id], (err, result) => {
      if (err) {
          console.error('Error deleting update:', err);
          res.status(500).send('Server error');
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).send('Update not found');
          return;
      }

      res.send('Update deleted successfully');
  });
};

const getUpdateByern = (req, res) => {
    const referncenumber = req.params.ern;
   
    connection.query('SELECT * FROM `updates` WHERE ern = ?', [referncenumber], (err, result) => {
        if (err) {
            console.error('Error fetching update:', err);
            res.status(500).send('Server error');
            return;
        }
  
        res.status(200).json(result);
    });
};


module.exports = {createUpdate,getUpdate,deleteUpdate,getUpdateByern};