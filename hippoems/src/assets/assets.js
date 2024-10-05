import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Button, Grid, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material/styles';

export default function Assets() {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const [Seethammadara, setSeethammdara] = useState([]);
  const [Pedagantyada, setPedagantyada] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getseethammadaraassets`)
      .then((res) => {
        if (res.status === 200) {
          setSeethammdara(res.data);
        } else {
          Swal.fire({
            icon: 'error',
            title: res.data,
            text: 'Error uploading file. Please try again later.'
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Server error",
          text: "Check your internet connection. Please try again later.",
          icon: "question"
        });
      });

    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getpedagantyadaassets`)
      .then((res) => {
        if (res.status === 200) {
          setPedagantyada(res.data);
        } else {
          Swal.fire({
            icon: 'error',
            title: res.data,
            text: 'Error uploading file. Please try again later.'
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Server error",
          text: "Check your internet connection. Please try again later.",
          icon: "question"
        });
      });
  }, []);

  const filteredData = (tabIndex === 0 ? Seethammadara : Pedagantyada).filter(
    item =>
      item.category.toLowerCase().includes(searchTerm) ||
      item.product.toLowerCase().includes(searchTerm)
  );

  const navigateToAddAssets = () => {
    navigate('/addassets');
  };

  const renderGrid = () => (
    <Grid container spacing={2}>
      {filteredData.map((row, index) => (
        <Grid item xs={12} key={row.id}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1"><strong>Sl. No:</strong> {index + 1}</Typography>
            <Typography variant="subtitle1"><strong>Category:</strong> {row.category}</Typography>
            <Typography variant="subtitle1"><strong>Product:</strong> {row.product}</Typography>
            <Typography variant="subtitle1"><strong>Quantity Available:</strong> {row.quantity}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ maxHeight: '400px', overflowY: 'auto' }}>
      <Table stickyHeader>
        <TableHead  style={{ background: '#0a9fc7' }}>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#0a9fc7', color: 'white', fontWeight: 'bold' }}>Sl. No</TableCell>
            <TableCell sx={{ backgroundColor: '#0a9fc7', color: 'white', fontWeight: 'bold' }}>Category</TableCell>
            <TableCell sx={{ backgroundColor: '#0a9fc7', color: 'white', fontWeight: 'bold' }}>Product</TableCell>
            <TableCell sx={{ backgroundColor: '#0a9fc7', color: 'white', fontWeight: 'bold' }}>No of Quantity Available</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.product}</TableCell>
              <TableCell>{row.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h5" align="center">
        Assets
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}
      >
        <TextField
          label="Search by Category or Product"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleSearchChange}
          sx={{ mr: { sm: 2 }, mb: { xs: 0, sm: 0 } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={navigateToAddAssets}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Update Products
        </Button>
      </Box>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab label="Seethammadara" />
        <Tab label="Pedagantyada" />
      </Tabs>
      <Box sx={{ p: { xs: 1, sm: 0 } }}>
        {isMobile ? renderGrid() : renderTable()}
      </Box>
    </Box>
  );
}
