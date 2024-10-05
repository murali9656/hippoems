const express= require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
app.use(cors(corsOptions));
const connection = require('./connection/connection');
app.use(bodyParser.json());
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { count } = require('console');

app.use('/enquirydocuments', express.static('documentuploads'));
app.use('/enquirydocuments2', express.static('enquirydocuments'));
app.use('/company',require('./routes/company'));
app.use('/enquiry',require('./routes/enquiry'));
app.use('/orders', require('./routes/orders'));
app.use('/versions',require('./routes/versions'));
app.use('/versionproducts',require('./routes/versionproducts'));
app.use('/updates',require('./routes/updates'));
app.use('/employee',require('./routes/employee'));
app.use('/myreports',require('./routes/myreports'))


app.post('/adminupdate/:id',((req,res)=>{
  connection.query('UPDATE `enquires` SET `user_id`="'+req.body.user_id+'",`owner`="'+req.body.owner+'",`company`="'+req.body.company+'",`person`="'+req.body.person+'",`gst`="'+req.body.gst+'",`number`="'+req.body.number+'",`email`="'+req.body.email+'",`state`="'+req.body.state+'",`city`="'+req.body.city+'",`subject`="'+req.body.subject+'",`source`="'+req.body.source+'",`sector`="'+req.body.sector+'",`stage`="'+req.body.stage+'",`customer_type`="'+req.body.customertype+'",`status`="'+req.body.status+'",`due_date`="'+req.body.duedate+'",`special_notes`="'+req.body.specialnotes+'" WHERE id="'+req.params.id+'"',((err,row)=>{
    if(!err){
      res.status(200).send('Updated..')
    }
    else{
      res.status(500).send('Error')
      console.log(err)
    }
  }))
}))


app.get('/reports', (req, res) => {
  const query = `
    SELECT 
      enquires.*, 
      enquriy_products.product, 
      enquriy_products.category, 
      enquriy_products.quantity, 
      enquriy_products.unitprice,
      enquriy_products.pgst,
      enquriy_products.totalprice, 
      (SELECT COUNT(*) FROM updates WHERE updates.ern = enquires.enquiryreferncenumber) AS row_count,
      (SELECT MAX(update_on) FROM updates WHERE updates.ern = enquires.enquiryreferncenumber) AS last_update_date
    FROM enquires
    JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
    LEFT JOIN updates ON enquires.enquiryreferncenumber = updates.ern
    WHERE enquires.status != 'complete'
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    } else {
      // Group products by enquiry reference number
      const groupedResults = results.reduce((acc, curr) => {
        const { enquiryreferncenumber, product, category, quantity, unitprice, pgst, totalprice, ...rest } = curr;
        if (!acc[enquiryreferncenumber]) {
          acc[enquiryreferncenumber] = { ...rest, products: [] };
        }
        acc[enquiryreferncenumber].products.push({ product, category, quantity, unitprice, pgst, totalprice });
        return acc;
      }, {});

      // Convert object back to array
      const transformedResults = Object.values(groupedResults);
      res.json(transformedResults);
    }
  });
});

app.get('/owners',((req,res)=>{
  connection.query('SELECT * FROM `users` WHERE role="marketing"',((err,rows)=>{
    if(!err){
      res.status(200).send(rows)
    }
    else{
      console.log(err);
      res.status(500).send('Error fetching data')
    }
  }))
}))


app.post('/send-email', (req, res) => {
  const { username, email, contact_number, password } = req.body;
 


  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'muralipspk99@gmail.com',
      pass: 'bhrnrrzyoxjfxtpw'
    }
  });

  const mailOptions = {
    from: 'muralipspk99@gmail.com',
    to: email,
    subject: 'Login Credentials for Your Account',
    html: `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://iili.io/drzYlbR.png" alt="Flowtech" style="max-width: 150px;">
        </div>
        <p style="font-size: 16px; color: #333;">Dear ${username},</p>
        <p style="font-size: 14px; color: #555;">Your account has been created successfully. Please use the following credentials to log in:</p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="font-size: 14px; color: #555; margin-bottom: 10px;"><strong>Name:</strong> ${username}</li>
          <li style="font-size: 14px; color: #555; margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
          <li style="font-size: 14px; color: #555; margin-bottom: 10px;"><strong>Contact Number:</strong> ${contact_number}</li>
          <li style="font-size: 14px; color: #555; margin-bottom: 10px;"><strong>Password:</strong> ${password}</li>
        </ul>
        <strong>Note: </strong><span>Please Use Email and Password as Login Credentials..</span> 
        <p style="font-size: 14px; color: #555;">Thank you!</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://www.flowtechfluid.in/index.php" style="font-size: 14px; color: #007bff; text-decoration: none;">Visit our website</a>
        </div>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send("Error sending email");
    } else {
      return res.status(200).send("Email sent successfully");
    }
  });
});



app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Using a parameterized query to prevent SQL injection
    connection.query(
      'SELECT * FROM `users` WHERE `email` = ? AND `password` = ?',
      [email, password],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Internal server error');
        }
        
        if (results.length > 0) {
          return res.status(200).send(results);
        } else {
          return res.status(400).send('Invalid Email or Password');
        }
      }
    );
  });

app.get('/getcompanies',(req,res)=>{
  connection.query('SELECT * FROM `companies`',(err,rows)=>{
    if(!err){
      res.status(200).send(rows);
    }
    else{
      console.log(err);
      res.status(500).send('Internal server error...')
    }
  })
});


const upload = multer({ dest: 'uploads/' });
app.post('/pedagantyada', upload.single('csvFile'), (req, res) => {  //API for CSV file uploading
  const csvFilePath = req.file.path;
  
  // Delete existing data from the table before inserting new data
  connection.query('DELETE FROM pedagantyada', (deleteError, deleteResults) => {
    if (deleteError) {
      console.error('Error deleting existing data:', deleteError);
      res.status(500).send('Error deleting existing data. Please try again later.');
      return;
    }

    // Read and parse the CSV file, then insert new data into the database
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Insert data into the database
        const sql = `INSERT INTO pedagantyada (product_id, category, product, quantity) VALUES (?, ?, ?, ?)`;
        const values = [row.id, row.product_category, row.sub_productcategory, row.quantity]; // Adjust as per your CSV structure

        connection.query(sql, values, (insertError, insertResults, fields) => {
          if (insertError) {
            console.error('Error inserting new data:', insertError);
          }
        });
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        res.send('Assets Updated At Seethammadhara Stock Point');
      });
  });
});

app.post('/Seethammadhara', upload.single('csvFile'), (req, res) => {
  const csvFilePath = req.file.path;                                  //API for CSV file uploading Seethammadhara
  
  // Delete existing data from the table before inserting new data
  connection.query('DELETE FROM seethammadara', (deleteError, deleteResults) => {
    if (deleteError) {
      console.error('Error deleting existing data:', deleteError);
      res.status(500).send('Error deleting existing data. Please try again later.');
      return;
    }

    // Read and parse the CSV file, then insert new data into the database
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Insert data into the database
        const sql = `INSERT INTO seethammadara (product_id, category, product, quantity) VALUES (?, ?, ?, ?)`;
        const values = [row.id, row.product_category, row.sub_productcategory, row.quantity]; // Adjust as per your CSV structure

        connection.query(sql, values, (insertError, insertResults, fields) => {
          if (insertError) {
            console.error('Error inserting new data:', insertError);
          }
        });
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        res.send('Assets Updated At Seethammadhara Stock Point');
      });
  });
});

app.get('/getseethammadaraassets',(req,res)=>{
  connection.query('SELECT * FROM seethammadara', (err, rows) =>{
     if(!err){
      res.status(200).send(rows)
     }
     else{
      res.status(500).send('Error fetching data from database');
     }
  })
});

app.get('/getpedagantyadaassets',(req,res)=>{
  connection.query('SELECT * FROM seethammadara', (err, rows) =>{
     if(!err){
      res.status(200).send(rows)
     }
     else{
      res.status(500).send('Error fetching data from database');
     }
  })
});


app.get('/companynames', (req, res) => {
  connection.query('SELECT DISTINCT company FROM companies', (err, rows) => {
    if (!err) {
      // Extract company names from rows and send them as an array
      const companyNames = rows.map(row => row.company);
      res.status(200).json(companyNames);
    } else {
      res.status(500).send('Internal server error');
      console.error(err);
    }
  });
});

app.get('/getcontactperson/:company',(req,res)=>{
  connection.query('SELECT DISTINCT person from companies WHERE company="'+req.params.company+'"',(err,rows)=>{
    if(!err){
      const contactPerson=rows.map(row=>row.person);
      res.status(200).send(contactPerson)
    }
    else{
      res.status(500).send('Internal server error');
      console.error(err);
    }
  })
});

app.get('/getcompanydetails/:person',(req,res)=>{
  connection.query('SELECT * FROM companies WHERE person="'+req.params.person+'"', (err, rows) =>{
    if(!err){
      res.status(200).send(rows)
    }
    else{
      res.status(500).send('Internal server error');
      console.error(err);
    }
  })
});

app.get('/getcategory', (req, res) => {
  // Query to get distinct categories from both tables and combine them
  const query = `
    SELECT DISTINCT category FROM pedagantyada
    UNION
    SELECT DISTINCT category FROM seethammadara
  `;

  connection.query(query, (err, rows) => {
    if (!err) {
      // Extract categories from the rows
      const categories = rows.map(row => row.category);
      res.status(200).send(categories);
    } else {
      res.status(500).send('Internal server error');
      console.error(err);
    }
  });
});


app.get('/productsbycategory/:selectdcategory', (req, res) => {
  // Query to select products and quantities from both tables using a UNION
  const query = `
    SELECT product, quantity  FROM pedagantyada  WHERE category = ? UNION  SELECT product, quantity  FROM seethammadara  WHERE category = ? ORDER BY product ASC`;
  
  const category = req.params.selectdcategory;

  connection.query(query, [category, category], (err, rows) => {
    if (!err) {
      // Format the response data to include product and quantity
      const options = rows.map(row => ({
        value: row.product,
        label: `${row.product} - Quantity: ${row.quantity}`
      }));
      res.status(200).send(options);
    } else {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  });
});

app.get('/userreports/:uid',(req,res)=>{
  connection.query('SELECT * FROM `reports` WHERE user_id="'+req.params.uid+'"',((Err,rows)=>{
    if(!Err){
      res.status(200).send(rows);
    }
    else{
      res.status(500).send('Internal server error');
      console.error(Err);
    }
  }))
});
app.get('/adminenquiry', (req, res) => {
  const query = `
  SELECT enquires.*, enquriy_products.product, enquriy_products.category, enquriy_products.quantity, enquriy_products.unitprice, enquriy_products.pgst, enquriy_products.totalprice
  FROM enquires
  JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
`;
connection.query(query, (error, results) => {
  if (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  } else {
    // Group products by enquiry reference numbers
    const groupedResults = results.reduce((acc, curr) => {
      const { enquiryreferncenumber, product,category, quantity, unitprice, pgst, totalprice, ...rest } = curr;
      if (!acc[enquiryreferncenumber]) {
        acc[enquiryreferncenumber] = { ...rest, products: [] };
      }
      acc[enquiryreferncenumber].products.push({ product, category, quantity, unitprice, pgst,totalprice });
      return acc;
    }, {});

    // Convert object back to array
    const transformedResults = Object.values(groupedResults);
         
    res.json(transformedResults);
  }
});
});

app.get('/status/:status', (req, res) => {
  const query = `
  SELECT enquires.*, enquriy_products.product, enquriy_products.category, enquriy_products.quantity, enquriy_products.unitprice, enquriy_products.pgst, enquriy_products.totalprice
  FROM enquires
  JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
  WHERE enquires.status = ?;
`;

const  status  = req.params.status; 

  
connection.query(query, [status], (error, results) => {
  if (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  } else {
    // Group products by enquiry reference numbers
    const groupedResults = results.reduce((acc, curr) => {
      const { enquiryreferncenumber, product,category, quantity, unitprice, pgst, totalprice, ...rest } = curr;
      if (!acc[enquiryreferncenumber]) {
        acc[enquiryreferncenumber] = { ...rest, products: [] };
      }
      acc[enquiryreferncenumber].products.push({ product, category, quantity, unitprice, pgst,totalprice });
      return acc;
    }, {});

    // Convert object back to array
    const transformedResults = Object.values(groupedResults);
         
    res.json(transformedResults);
  }
});
});



app.get('/stage/:stage', (req, res) => {
  
  const query = `
  SELECT enquires.*, enquriy_products.product, enquriy_products.category, enquriy_products.quantity, enquriy_products.unitprice, enquriy_products.pgst, enquriy_products.totalprice
  FROM enquires
  JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
  WHERE enquires.stage = ?;
`;

const  stage  = req.params.stage; 

connection.query(query, [stage], (error, results) => {
  if (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  } else {
    // Group products by enquiry reference numbers
    const groupedResults = results.reduce((acc, curr) => {
      const { enquiryreferncenumber, product,category, quantity, unitprice, pgst, totalprice, ...rest } = curr;
      if (!acc[enquiryreferncenumber]) {
        acc[enquiryreferncenumber] = { ...rest, products: [] };
      }
      acc[enquiryreferncenumber].products.push({ product, category, quantity, unitprice, pgst,totalprice });
      return acc;
    }, {});

    // Convert object back to array
    const transformedResults = Object.values(groupedResults);
         
    res.json(transformedResults);
  }
});
});

app.get('/monthwisecount', (req, res) => {
  const query = `
    SELECT DATE_FORMAT(created_on, '%Y-%m') AS month, COUNT(*) AS enquiry_count
    FROM enquires
    GROUP BY DATE_FORMAT(created_on, '%Y-%m')
    ORDER BY month;
  `;

  connection.query(query, (err, rows) => {
    if (!err) {
      res.status(200).send(rows);
    } else {
      res.status(500).send('Internal server error');
      console.log(err);
    }
  });
});



app.get('/getstatuscount', (req, res) => {
  const query = `
    SELECT status, COUNT(*) AS enquiry_count 
    FROM enquires 
    WHERE status IN ('pending', 'reject', 'accept', 'complete') 
    GROUP BY status
  `;
  
  connection.query(query, (err, rows) => {
    if (!err) {
      res.status(200).send(rows);
    } else {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
});

app.get('/getstagecount', (req, res) => {
  const query = `
    SELECT stage, COUNT(*) AS enquiry_count 
    FROM enquires 
    WHERE stage IN ('Enquiry Regretted', 'Budgetary Offer Submitted', 'Tender Submitted / Offer under Negotiation', 'PO Received', 'Order Confirm but PO on hold', 'Order Lost') 
    GROUP BY stage
  `;
  
  connection.query(query, (err, rows) => {
    if (!err) {
      res.status(200).send(rows);
    } else {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });
});



app.get('/userenquires/:uid', (req, res) => {
  const query = `
  SELECT enquires.*, enquriy_products.product, enquriy_products.category, enquriy_products.quantity, enquriy_products.unitprice, enquriy_products.pgst, enquriy_products.totalprice
  FROM enquires
  JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
  WHERE enquires.user_id = ?;
`;

const  uid  = req.params.uid; 

  
connection.query(query, [uid], (error, results) => {
  if (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  } else {
    // Group products by enquiry reference numbers
    const groupedResults = results.reduce((acc, curr) => {
      const { enquiryreferncenumber, product,category, quantity, unitprice, pgst, totalprice, ...rest } = curr;
      if (!acc[enquiryreferncenumber]) {
        acc[enquiryreferncenumber] = { ...rest, products: [] };
      }
      acc[enquiryreferncenumber].products.push({ product, category, quantity, unitprice, pgst,totalprice });
      return acc;
    }, {});

    // Convert object back to array
    const transformedResults = Object.values(groupedResults);
         
    res.json(transformedResults);
  }
});
});

app.get('/getcolumns', (req, res) => {
  const query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'enquires'";

  connection.query(query, (err, rows) => {
    if (!err) {
      const columns = rows
        .filter(row => row.COLUMN_NAME !== 'id' && row.COLUMN_NAME !== 'ern' && row.COLUMN_NAME !== '	enquiryreferncenumber' && row.COLUMN_NAME !== 'user_id'  && row.COLUMN_NAME !== 'enquiry_for' && row.COLUMN_NAME !== 'delivery_period' && row.COLUMN_NAME !== 'no_of_weeks' && row.COLUMN_NAME !== 'customgst' &&  row.COLUMN_NAME !== 'payment_days' && row.COLUMN_NAME !== 'validity' && row.COLUMN_NAME !== 'note')

        .map(row => ({
          label: row.COLUMN_NAME,
          value: row.COLUMN_NAME
        }));
      res.status(200).send(columns);
    } else {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });
});











server.listen(8000, () => {

    console.log('server running innnnnnn in port 8000 ');


})