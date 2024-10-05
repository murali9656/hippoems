import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, InputLabel, Input, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Addupdate() {
    const location = useLocation();
    const ern=location.state;
    const [file,setFile]=useState(null);
    var presentdate = new Date().toLocaleDateString();
    var user= localStorage.getItem('name');
    const [data,setData]=useState({owner:user,ern:ern,update:'',date:presentdate});



    const handleFileChange=(e)=>{
        setFile(e.target.files[0]);
    }

    const handler = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      

   
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const details={ern:data.ern,user:data.owner,update:data.update,date:data.date}
    const formData = new FormData();
             formData.append('details', JSON.stringify(details));
             formData.append('file', file);

    axios.post(`${process.env.REACT_APP_HIPPOEMS}/updates`,formData).then((res)=>{
        if(res.status===200){
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Update submited successfully..",
                showConfirmButton: false,
                timer: 1500
              }); }
              else{
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: res.data,
                  });
              }
    }).catch((err)=>{
        Swal.fire({
            title: "The Internet?",
            text: "Check your internet connection and try again!",
            icon: "question"
          });
    })
   
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: { xs: '100%', sm: '80%', md: '60%' },
        mx: 'auto',
        mt: 5,
        p: 4,
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{
          color: '#3f51b5',
          fontWeight: 'bold',
          letterSpacing: 0.5,
          mb: 2,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)', // Subtle text shadow
          textDecoration:'underline'
        }}
      >
        Add New Update
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Reference Number Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enquiry Reference Number(Auto fill)"
              variant="outlined"
              name="referenceNumber"
              value={ern}
              aria-readonly
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  transition: 'box-shadow 0.3s ease-in-out',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#3f51b5',
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Enter Your Update Here"
              multiline
              rows={5}
              fullWidth
              variant="outlined"
              name="update"
              onChange={handler}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#3f51b5',
                },
              }}
            />
          </Grid>

          {/* File Upload Field */}
          <Grid item xs={12}>
            <InputLabel
              htmlFor="file-upload"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#3f51b5',
                fontSize: '16px',
                mb: 1,
              }}
            >
              <CloudUploadIcon sx={{ mr: 1 }} />
              Upload Document (Optional)
            </InputLabel>
            <Input
              id="file-upload"
              fullWidth
              type="file"
              onChange={handleFileChange}
              sx={{
                borderRadius: '8px',
                py: 1,
                px: 2,
                border: '1px solid #ccc',
                '&:hover': {
                  borderColor: '#3f51b5',
                },
              }}
              inputProps={{ accept: '.pdf,.doc,.docx,.png,.jpg,.jpeg' }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                backgroundColor: '#3f51b5',
                borderRadius: '30px',
                padding: '5px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#2c3e9a',
                  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              Submit Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
