const connection = require('../connection/connection');

const createOrder = (req, res) => {
    const orderData = req.body; // Array of objects containing product, quantity, unitprice, gst, totalprice, and referenceNumber

    // Array to store promises for database insertions
    const insertionPromises = orderData.map(order => {
        return new Promise((resolve, reject) => {
            const { product, quantity, unitprice, pgst, totalprice, referenceNumber } = order;
            
            // Fetch category from seethammadhara and pedagantyada tables based on product name
            connection.query(`
                SELECT category FROM seethammadara WHERE product = ?
                UNION
                SELECT category FROM pedagantyada WHERE product = ?
            `, [product, product], (err, results) => {
                if (err) {
                    res.status(500).send('Internal server error');
                    console.error('Error fetching category:', err);
                    reject(err); // Reject the promise if there's an error fetching category
                } else {
                    if (results.length > 0) {
                        const category = results[0].category;

                        // Insert into enquriy_products table with product, category, quantity, unitprice, gst, totalprice, and referenceNumber
                        connection.query('INSERT INTO enquriy_products ( product, category, quantity, unitprice, pgst, totalprice, enquiryreferncenumber) VALUES (?, ?, ?, ?, ?, ?, ?)', [ product, category, quantity, unitprice, pgst, totalprice, referenceNumber], (err, result) => {
                            if (err) {
                                res.status(500).send('Internal server error');
                                console.error('Error creating order:', err);
                                reject(err); // Reject the promise if there's an error inserting order
                            } else {
                                resolve(result); // Resolve the promise if insertion is successful
                            }
                        });
                    } else {
                        res.status(500).send('Internal server error');
                        const error = new Error(`Category not found for product: ${product}`);
                        reject(error); // Reject if category is not found for the product
                    }
                }
            });
        });
    });

    // Execute all insertion promises
    Promise.all(insertionPromises)
        .then(() => {
            res.status(200).json({ message: 'Orders created successfully' });
        })
        .catch((error) => {
            console.error('Error creating orders:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};


const deleteOrder=(req,res)=>{
    connection.query('DELETE FROM `enquriy_products` WHERE `id`="'+req.params.id+'"',((err,row)=>{
        if(!err){
            res.status(200).send('product removed from order...')
        }
        else{
            res.status(500).send('internal server error')
        }
    }))
};


const updateOrder = (req, res) => {
    // console.log(req.body);
    // console.log(req.params.id)
    const orderId = req.params.id;
    const { product, quantity, unitprice, pgst, totalprice } = req.body;
          

                // Update the existing order with the provided data
                connection.query('UPDATE enquriy_products SET product = ?, quantity = ?, unitprice = ?,pgst = ?, totalprice = ? WHERE id = ?', [product, quantity, unitprice, pgst, totalprice, orderId], (err, result) => {
                    if (err) {
                        console.error('Error updating order:', err);
                        res.status(500).json({ error: 'Error updating order' });
                    } else {
                        res.status(200).json({ message: 'Order updated successfully' });
                    }
                });
            };


module.exports = { createOrder, deleteOrder, updateOrder };