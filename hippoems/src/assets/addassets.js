import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormControlLabel, Paper, Radio, RadioGroup, Typography, Divider, InputLabel, Input, useMediaQuery } from '@mui/material';
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material/styles';

export default function Addassets() {
  const [file, setFile] = useState(null);
  const [selectedStockPoint, setSelectedStockPoint] = useState('Pedagantyada');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile view

  const handleStockPointChange = (event) => {
    setSelectedStockPoint(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'No file selected',
        text: 'Please choose a file to upload.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_HIPPOEMS}/${selectedStockPoint.toLowerCase()}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Stocks Updated at ${selectedStockPoint} Stock Point`,
          showConfirmButton: false,
          timer: 1500,
          background: 'black',
          color: 'white'
        });
        navigate('/assets');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text: 'Error uploading file. Please try again later.'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: 'Error uploading file. Please try again later.'
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: { xs: '60px', sm: '110px' } }}>
      <Paper elevation={4} sx={{ padding: { xs: 2, sm: 4 }, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold', color: '#1976d2' }}>
          Select Stock-Point
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <FormControl component="fieldset" fullWidth>
          <RadioGroup row={!isMobile} aria-label="stock-point" name="stock-point" value={selectedStockPoint} onChange={handleStockPointChange}>
            <FormControlLabel value="Pedagantyada" control={<Radio />} label="Pedagantyada" />
            <FormControlLabel value="Seethammadhara" control={<Radio />} label="Seethammadhara" />
          </RadioGroup>
        </FormControl>
        <Box sx={{ marginTop: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            We Accept Only CSV (comma-separated values) Type List Only
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <InputLabel htmlFor="actual-btn" sx={{ display: 'block', marginTop: 2, marginBottom: 1 }}>
              <Button variant="contained" component="span" sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' }, width: '100%' }}>
                + Choose File
              </Button>
            </InputLabel>
            <Input type="file" id="actual-btn" inputProps={{ accept: '.csv' }} onChange={handleFileChange} style={{ display: 'none' }} />
            <Typography variant="body2" sx={{ marginTop: 2, color: 'gray' }}>
              &#8645; Choose file or drop files here
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Button type="submit" variant="contained" color="success" fullWidth sx={{ fontWeight: 'bold' }}>
              Upload
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}
