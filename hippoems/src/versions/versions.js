import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Box, Typography
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

function ProductDetails({ products }) {
  return (
    <Collapse in={products.open} timeout="auto" unmountOnExit>
      <Box margin={1}>
        <Typography variant="h6" gutterBottom component="div" style={{width:'40%',marginLeft:"58%",color:'#0a9fc7'}}>
          Product Details
        </Typography>
        <Table size="small" aria-label="products" style={{width:'40%',marginLeft:"58%"}}>
          <TableHead style={{ background: '#0a9fc7' }}>
            <TableRow>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Sl. No</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Unit Price</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>GST</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.details.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.product}</TableCell>
                <TableCell>{product.unitprice}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.pgst}</TableCell>
                <TableCell>{product.totalprice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Collapse>
  );
}

function VersionsTableRow({ row, index }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{row.version_id}</TableCell>
        <TableCell>{row.ern}</TableCell>
        <TableCell>{row.owner}</TableCell>
        <TableCell>{row.company}</TableCell>
        <TableCell>{row.person}</TableCell>
        <TableCell>{row.gst}</TableCell>
        <TableCell>{row.number}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.state}</TableCell>
        <TableCell>{row.city}</TableCell>
        <TableCell>{row.subject}</TableCell>
        <TableCell>{row.source}</TableCell>
        <TableCell>{row.sector}</TableCell>
        <TableCell>{row.stage}</TableCell>
        <TableCell>{row.customer_type}</TableCell>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>{row.due_date}</TableCell>
        <TableCell>{row.special_notes}</TableCell>
        <TableCell>{row.created_on}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={24}>
          <ProductDetails products={{ open, details: row.products }} />
        </TableCell>
      </TableRow>
    </>
  );
}

export default function Versions() {
  const uid = localStorage.getItem('id');
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HIPPOEMS}/versions/${uid}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data)
          setData(res.data);
        } else {
          Swal.fire({
            title: 'Error',
            text: res.data.message || 'Something went wrong',
            icon: 'error',
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong. Try again later',
          icon: 'error',
        });
      });
  }, [uid]);

  return (
    <div>
    <Typography
  variant='h5'
  style={{
    color: '#0a9fc7',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' ,
    textDecoration:'underline'
  }}
>
  Enquiry versions:
</Typography>

    <TableContainer component={Paper}>
      <Table aria-label="versions table" style={{ backgroundColor: '#f0f4f8' }}>
        <TableHead style={{ background: '#0a9fc7' }}>
          <TableRow>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Sl. No</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Version ID</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Reference Number</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Owner</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Person</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>GST</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Number</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>State</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Source</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Sector</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Stage</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Customer Type</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Products</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Due Date</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Special Notes</TableCell>
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Created On</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <VersionsTableRow key={index} row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
