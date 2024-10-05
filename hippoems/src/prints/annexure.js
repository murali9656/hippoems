import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button } from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function Annexure() {
  const location = useLocation();
  const eid = location.state;
  const [data, setData] = useState({
    refernce: "",
    owner: "",
    company: "",
    person: "",
    gst: "",
    email: "",
    number: "",
    state: "",
    city: "",
    subject: "",
    source: "",
    sector: "",
    stage: "",
    customertype: "",
    status: ""
  });
  const [existproducts, setExistproducts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/enquiry/${eid}`).then((res) => {
      if (res.status === 200) {
        setData({
          refernce: res.data[0].ern,
          owner: res.data[0].owner,
          company: res.data[0].company,
          person: res.data[0].person,
          gst: res.data[0].gst,
          email: res.data[0].email,
          number: res.data[0].number,
          state: res.data[0].state,
          city: res.data[0].city,
          subject: res.data[0].subject,
          source: res.data[0].source,
          sector: res.data[0].sector,
          stage: res.data[0].stage,
          customertype: res.data[0].customer_type,
          status: res.data[0].status
        });
        setExistproducts(res.data[0].products || []);
      } else {
        Swal.fire({
          title: 'Error',
          text: res.data.message || 'Something went wrong',
          icon: 'error',
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
      });
    });
  }, [eid]);

  // Calculate total price dynamically
  const calculateTotalPrice = () => {
    return existproducts.reduce((total, product) => total + (parseFloat(product.totalprice) || 0), 0);
  };

  // Calculate total quantity dynamically
  const calculateQuantity = () => {
    return existproducts.reduce((total, product) => total + (parseInt(product.quantity, 10) || 0), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        width: '85%',
        background: 'white',
        p: 4,
        position: 'relative',
        left: '7%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
        borderRadius: '8px', // Optional: rounded corners
        '@media print': {
          p: 0,
          boxShadow: 'none', // Remove shadow for print
          '@page': {
            margin: '0cm',
          },
          '.logo': {
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            marginBottom: '10px',
          },
          '.header': {
            marginTop: '-1cm',
            textAlign: 'left',
            marginBottom: '1cm',
          },
          '.enquiry': {
            marginLeft: '0px'
          },
          '.print-hidden': {
            display: 'none',
          },
          table: {
            width: '100%',
          },
          '.print-button': {
            display: 'none', // Hide button when printing
          },
        },
      }}
    >
      <Box
        className="logo"
        sx={{
          position: 'absolute',
          top: 36,
          right: 50,
          width: '200px',
          marginBottom: '10px',
        }}
      >
        <img src="flowtech.png" alt="Company Logo" style={{ width: '100%' }} />
      </Box>

      <Box className="header" sx={{ textAlign: 'left' }}>
        <Typography variant="h5" gutterBottom>
          FLOWTECH FLUID SYSTEMS (P) LTD.
        </Typography>
        <Typography variant="body1">Office: 55-14-75, APSEB Colony, Seethammadhara, Visakhapatnam 530013</Typography>
        <Typography variant="body1">Tel: 0891 2543704, 2531535</Typography>
        <Typography variant="body1">Email: contact@flowtechfluid.in | www: www.flowtechfluid.in</Typography>
        <Typography variant="body1">CIN: U31401AP2013PTC089360 | GSTIN: 37AACCF2395J1ZD</Typography>
      </Box>
      <hr />

      {/* Enquiry Details */}
      <Box sx={{ mt: 4, mb: 2, ml: 15 }} className="enquiry">
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textDecoration: 'underline', color: '#0a9fc7' }}>
          Enquiry Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Enquiry Reference Number:</strong> {data.refernce}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Company Name:</strong> {data.company}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>GST:</strong> {data.gst}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Contact Person:</strong> {data.person}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Contact Email:</strong> {data.email}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Contact Number:</strong> {data.number}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>State:</strong> {data.state}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>City:</strong> {data.city}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Status:</strong> {data.status}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Sector:</strong> {data.sector}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Stage:</strong> {data.stage}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Customer Type:</strong> {data.customertype}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Annexure 1 Title */}
      <Typography
        variant="h6"
        gutterBottom
        align="center"
        sx={{ textDecoration: 'underline', fontWeight: 'bold', marginTop: '2cm', color: '#0a9fc7' }}
      >
        Annexure 1 - Product Details
      </Typography>

      {/* Product Details Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Sl. No</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Product</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Unit Price</TableCell>
              <TableCell align="center">GST (%)</TableCell>
              <TableCell align="center">Total (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {existproducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{product.category}</TableCell>
                <TableCell align="center">{product.product}</TableCell>
                <TableCell align="center">{product.quantity}</TableCell>
                <TableCell align="center">₹{product.unitprice}</TableCell>
                <TableCell align="center">{product.pgst}%</TableCell>
                <TableCell align="center">₹{Math.floor(product.totalprice)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">Total</TableCell>
              <TableCell align='center'>{calculateQuantity()}</TableCell>
              <TableCell colSpan={2}></TableCell>
              <TableCell align="center">₹{Math.floor(calculateTotalPrice())}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Print Button */}
      <Box
        className="print-button"
        sx={{
          mt: 4,
          textAlign: 'center',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
}
