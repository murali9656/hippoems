const connection = require('../connection/connection');

const createVersions = (req, res) => {
  const originalVid = parseFloat(req.body.vid);
  const currentDate = new Date().toISOString().slice(0, 10);

  connection.query(
    'SELECT MAX(vid) AS vid FROM `versions` WHERE FLOOR(vid) = FLOOR(?)',
    [originalVid],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
      }

      let newVid;
      if (result[0].vid == null) {
        newVid = originalVid.toFixed(1);
      } else {
        const maxVid = parseFloat(result[0].vid);

        if (!isNaN(maxVid)) {
          const incrementedVid = incrementVersionNumber(maxVid);
          newVid = incrementedVid.toFixed(1);
        } else {
          return res.status(500).send("Error calculating new version number");
        }
      }

      const insertQuery = `
        INSERT INTO versions 
        (vid, version_id, user_id, enquiryreferncenumber, owner, company, person, gst, number, email, state, city, subject,source, sector, stage, customer_type, status, reason_for_reject, due_date,special_notes,ern,created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        newVid,
        newVid,
        req.body.uid || '',
        req.body.enquiryreferncenumber || '',
        req.body.owner || '',
        req.body.company || '',
        req.body.person || '',
        req.body.gst || '',
        req.body.number || '',
        req.body.email || '',
        req.body.state || '',
        req.body.city || '',
        req.body.subject || '',
        req.body.source || '',
        req.body.sector || '',
        req.body.stage || '',
        req.body.customertype || '',
        req.body.status || '',
        req.body.reason_for_reject || '',
        req.body.duedate || '',
        req.body.specialnotes || '',
        req.body.enquiryreferncenumber,
        currentDate
      ];

      connection.query(insertQuery, values, (err, result) => {
        if (!err) {
          res.status(200).send({ message: 'Version created', newVid: newVid });
        } else {
          console.log(err);
          res.status(500).send('Internal server error');
        }
      });
    }
  );
};

// Function to increment the version number correctly
function incrementVersionNumber(currentVersion) {
  const precision = 1e12; // Higher precision to handle floating-point issues
  return Math.round((currentVersion + 0.1) * precision) / precision;
}




// const deleteVersions = (req, res) => {
//   const versionId = req.params.id;

//   // Delete from versions_products first
//   connection.query('DELETE FROM versions_products WHERE version_id = ?', [versionId], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(400).send("Unable to delete versions_products");
//     }

//     // If versions_products deletion is successful, delete from versions table
//     connection.query('DELETE FROM versions WHERE vid = ?', [versionId], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(400).send("Unable to delete version");
//       }
      
//       // If both deletions are successful
//       res.status(200).send("Deleted successfully");
//     });
//   });
// };

// const viewVersions = (req, res) => {
//   const query = `
//     SELECT 
//       versions.*, 
//       versions_products.product, 
//       versions_products.category, 
//       versions_products.quantity, 
//       versions_products.unitprice, 
//       versions_products.totalprice,
//       CAST(versions.vid AS CHAR) AS version_id_str
//     FROM versions
//     JOIN versions_products ON versions.vid = versions_products.vid
//   `;

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('Error fetching data');
//     } else {
//       // Group products by version ID
//       const groupedResults = results.reduce((acc, curr) => {
//         const { version_id_str, product, category, quantity, unitprice, totalprice, ...rest } = curr;
//         if (!acc[version_id_str]) {
//           acc[version_id_str] = { ...rest, products: [] };
//         }
//         acc[version_id_str].products.push({ product, category, quantity, unitprice, totalprice });
//         return acc;
//       }, {});

//       // Convert object back to array
//       const transformedResults = Object.values(groupedResults);

//       res.json(transformedResults);
//     }
//   });
// };




const singleVersions = (req, res) => {
  const query = `
    SELECT versions.*, versions_products.category, versions_products.product, 
           versions_products.quantity, versions_products.unitprice, 
           versions_products.pgst, versions_products.totalprice
    FROM versions
    JOIN versions_products ON versions.vid = versions_products.vid
    WHERE versions.user_id = ${req.params.id};
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    } else {
      // Group products by version (vid) and enquiry reference number
      const groupedResults = results.reduce((acc, curr) => {
        const { vid, enquiryreferncenumber, category, product, quantity, unitprice, pgst, totalprice, ...rest } = curr;
        
        // Use a unique key combining version id (vid) and enquiry reference number
        const versionKey = `${enquiryreferncenumber}_${vid}`;
        
        if (!acc[versionKey]) {
          acc[versionKey] = { ...rest, products: [] };
        }

        // Add product details to the appropriate version
        acc[versionKey].products.push({ category, product, quantity, unitprice, pgst, totalprice });
        return acc;
      }, {});

      // Convert object back to an array
      const transformedResults = Object.values(groupedResults);
      
      res.status(200).json(transformedResults);
    }
  });
};

  

module.exports = {createVersions,singleVersions};