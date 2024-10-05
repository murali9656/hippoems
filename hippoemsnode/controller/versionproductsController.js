const connection = require('../connection/connection');

const createversionproduct = (req, res) => {
    
    const orderData = req.body; // Array of objects containing product, quantity, and referenceNumber
    // Using Promise.all to execute all database insertions asynchronously
    Promise.all(orderData.map(order => {
        return new Promise((resolve, reject) => {
            const {vid, product, category, quantity, unitprice, pgst, totalprice, referenceNumber } = order;
            
            connection.query('INSERT INTO `versions_products` (`vid`, `version_id`,`product`,`category`, `quantity`, unitprice, pgst, totalprice,`enquiryreferncenumber`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [vid, vid, product, category, quantity,unitprice, pgst, totalprice, referenceNumber], (err, result) => {
                if (err) {
                    console.error('Error creating order:', err);
                    reject(err); // Reject the promise if there's an error
                } else {
                    // console.log('Order created successfully');
                    resolve(result); // Resolve the promise if insertion is successful
                }
            });
        });
    }))
    .then(() => {
        res.status(200).send('Orders created successfully');
    })
    .catch(error => {
        console.error('Error creating orders:', error);
        res.status(500).send('Error creating orders');
    });
};


const viewversionproduct=(req,res)=>{
    connection.query('SELECT * FROM `versions_products`',(err,row)=>{
        if(!err){
            res.send(row)
        }
        else{
            console.log(err);
            res.send("error throw")
        }
    })
}


module.exports = {createversionproduct,viewversionproduct};