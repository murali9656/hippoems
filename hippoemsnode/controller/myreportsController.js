const connection = require('../connection/connection');

const creatReport = (req, res) => {
    const columnsString = JSON.stringify(req.body.selectedColumns);
  
    const query = 'INSERT INTO `reports`(`reportname`, `description`, `date`, `columns`, `user_id`) VALUES (?, ?, ?, ?, ?)';
  
    connection.query(query, [
      req.body.folderName,
      req.body.description,
      req.body.createdOn,
      columnsString, 
      req.body.user_id
    ], (err, row) => {
      if (!err) {
        res.status(200).send('Report Created Successfully');
      } else {
        res.status(500).send('Error Creating Report');
        console.log(err);
      }
    });
  };

  const viewReports=(req,res)=>{
    connection.query('SELECT * FROM `reports`',((err,rows)=>{
        if(!err){
            res.status(200).send(rows)
        }
        else{
            res.status(500).send('Error fetching reports');
            console.log(err)
        }
    }))
  }


  const singleReport=(req,res)=>{
    connection.query('SELECT * FROM `reports` WHERE id="'+req.params.id+'"',((err,row)=>{
      if(!err){
        res.status(200).send(row)
      }
      else{
        res.status(500).send('internal server error');
        console.log(err)
      }
    }))
  }

  const deleteReport=(req,res)=>{
    connection.query('DELETE FROM `reports` WHERE id="'+req.params.id+'"',((err,row)=>{
      if(!err){
        res.status(200).send('Report deleted successfully')
      }
      else{
        res.status(500).send('Internal server error');
        console.log(err)
      }
    }))
  }
  


module.exports = {creatReport,viewReports,singleReport,deleteReport};