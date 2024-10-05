const connection = require('../connection/connection');
const creatEnquiry = (req, res) => {
    const paymentTerms = JSON.stringify(req.body.paymennterms);
    const paymentDays = JSON.stringify(req.body.paymentdays);
      // Check if req.file exists to determine if documents should be included
  const filename = req.file !==undefined ? req.file.filename : null;



  // Determine the value for documents column
  const documents = filename || 'default_document.pdf'; // Use a default document name if no file is uploaded

    const sql = `
        INSERT INTO enquires 
        (user_id, enquiryreferncenumber, owner, company, person, gst, number, email, state, city, subject, source, sector, stage, customer_type, status, reason_for_reject, due_date, documents, special_notes, enquiry_for, delivery_period, no_of_weeks, customgst, payment_terms, payment_days, validity, note, ern, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        req.body.user_id,
        req.body.ern,
        req.body.owner,
        req.body.company,
        req.body.person,
        req.body.gst,
        req.body.number,
        req.body.email,
        req.body.state,
        req.body.city,
        req.body.subject,
        req.body.source,
        req.body.sector,
        req.body.stage,
        req.body.customertype,
        req.body.status,
        '---',  // Placeholder for reason_for_reject
        req.body.duedate,
        documents,  // Assuming filename refers to documents
        req.body.specialnotes,
        req.body.enquiryfor,
        req.body.deliveryperiod,
        req.body.numberOfWeeks,
        req.body.customGst,
        paymentTerms,
        paymentDays,
        req.body.validity,
        req.body.note,
        req.body.ern,
        req.body.createdon
    ];

    connection.query(sql, values, ((err, rows) => {
       if(!err){
        res.status(200).send('Enquiry added successfully.')
       }
       else{
        res.status(500).send('Error adding enquiry')
        console.log('add enquiry query error :'+ err)
       }
    }));
};




const singleEnquiry = (req, res) => {
  const query = `
    SELECT enquires.*, enquires.enquiryreferncenumber, enquriy_products.id, 
           enquriy_products.product, enquriy_products.category, enquriy_products.quantity, 
           enquriy_products.unitprice, enquriy_products.pgst, enquriy_products.totalprice
    FROM enquires
    JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
    WHERE enquires.id = ?;
  `;

  const { id } = req.params;


  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).send('Error fetching data');
      } else {
          // Group products by enquiry reference number
          const groupedResults = results.reduce((acc, curr) => {
              const { enquiryreferncenumber, id, product, category, quantity, unitprice, pgst, totalprice, ...rest } = curr;
              
              if (!acc[enquiryreferncenumber]) {
                  acc[enquiryreferncenumber] = { ...rest, enquiry_id: id, products: [] };
              }
              acc[enquiryreferncenumber].products.push({ id, product, category, quantity, unitprice, pgst, totalprice });
              return acc;
          }, {});

          // Convert object back to array
          const transformedResults = Object.values(groupedResults);

          res.json(transformedResults);
      }
  });
};


  const updateEnquiry = (req, res) => {
    
    const { company, person, gst, number, email, state, city, subject, source, sector, stage, customertype, duedate, specialnotes } = req.body;
    const { id } = req.params;
  
    const query = `
      UPDATE enquires 
      SET company = ?, person = ?, gst = ?, number = ?, email = ?, state = ?, city = ?, subject = ?, source = ?, sector = ?, stage = ?, customer_type = ?, due_date = ?, special_notes = ?
      WHERE id = ?
    `;
  
    const values = [company, person, gst, number, email, state, city, subject, source, sector, stage, customertype, duedate, specialnotes, id];
  
    connection.query(query, values, (err, result) => {
      if (!err) {
        res.status(200).send('updated');
      } else {
        console.log('Update enquiry query error: ' + err);
        res.status(500).send('internal server error');
      }
    });
  };


  const viewenquiry = (req, res) => {
    const query = `
      SELECT enquires.*, enquriy_products.id AS product_id, enquriy_products.product, enquriy_products.category, enquriy_products.quantity, enquriy_products.unitprice, enquriy_products.pgst, enquriy_products.totalprice
      FROM enquires
      JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber;
    `;
  
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
      } else {
        // Group products by enquiry reference number
        const groupedResults = results.reduce((acc, curr) => {
          const { enquiryreferncenumber, id, product_id, product, category, quantity, unitprice, pgst, totalprice, ...rest } = curr;
          
          if (!acc[enquiryreferncenumber]) {
            acc[enquiryreferncenumber] = { ...rest, enquiry_id: id, products: [] };
          }
          acc[enquiryreferncenumber].products.push({ product_id, product, category, quantity, unitprice, pgst, totalprice });
          return acc;
        }, {});
  
        // Convert object back to array
        const transformedResults = Object.values(groupedResults);
  
        res.json(transformedResults);
      }
    });
  };


  const deleteEnquiry = (req, res) => {
    const { id } = req.params;
  
    // Step 1: First query to get the enquiry reference number based on the enquiry id
    const getEnquiryRefQuery = `
      SELECT enquiryreferncenumber 
      FROM enquires 
      WHERE id = ?;
    `;
  
    connection.query(getEnquiryRefQuery, [id], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching enquiry reference number');
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send('Enquiry not found');
        return;
      }
  
      const enquiryRefNumber = results[0].enquiryreferncenumber;
  
      // Step 2: Delete the products related to this enquiry
      const deleteProductsQuery = `
        DELETE FROM enquriy_products 
        WHERE enquiryreferncenumber = ?;
      `;
  
      connection.query(deleteProductsQuery, [enquiryRefNumber], (error) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error deleting products');
          return;
        }
  
        // Step 3: Delete the enquiry itself
        const deleteEnquiryQuery = `
          DELETE FROM enquires 
          WHERE id = ?;
        `;
  
        connection.query(deleteEnquiryQuery, [id], (error) => {
          if (error) {
            console.error(error);
            res.status(500).send('Error deleting enquiry');
          } else {
            res.status(200).send('Enquiry and related products deleted successfully');
          }
        });
      });
    });
  };
  




  
    




module.exports = {creatEnquiry, singleEnquiry, updateEnquiry,viewenquiry,deleteEnquiry};