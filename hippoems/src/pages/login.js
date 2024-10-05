import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, FormControlLabel, Checkbox, Link } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState(false);
  const usenav=useNavigate();

  const handler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const submithandler = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!emailError && data.email && data.password) {
      axios.post(`${process.env.REACT_APP_HIPPOEMS}/login`,data).then((res)=>{
        if(res.status===200 && res.data[0].role==='admin'){
          usenav('/');
          localStorage.setItem('id',res.data[0].id);
          localStorage.setItem('name',res.data[0].username);
          localStorage.setItem('role',res.data[0].role);
          window.location.reload()
        }

       else if(res.status===200 && res.data[0].role==='marketing'){
          usenav('/marketteamhome');
          localStorage.setItem('id',res.data[0].id);
          localStorage.setItem('name',res.data[0].username);
          localStorage.setItem('role',res.data[0].role);
          window.location.reload()
        }
     
        else if(res.status===200 && res.data[0].role==='support'){
          usenav('/adminhome');
          localStorage.setItem('id',res.data[0].id);
          localStorage.setItem('name',res.data[0].username);
          localStorage.setItem('role',res.data[0].role);
          window.location.reload()
        }
        else{
          Swal.fire({
            icon: "error",
            title: res.data,
            text: "Something went wrong!",
    
          });
        }
      }).catch((err)=>{
        Swal.fire({
          title: "The Internet?",
          text: "Check your internet connection",
          icon: "question"
        });
      })
    } else {
      alert("Please fill out the form correctly.");
    }

  };

  return (
    <Grid container component="main" style={{ marginTop: '70px', height: '80vh' }}>
      {/* Left Side - Content */}
      <Grid 
        item 
        xs={12} 
        md={6} 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f4f8',
          padding: '20px'
        }}
      >
        <Box maxWidth="sm">
          <Typography variant="h5" gutterBottom style={{ fontWeight: 600, color: '#333' }}>
            Welcome to Hippo Enquiry Management System
          </Typography>
          <Typography variant="body1" style={{ color: '#555', lineHeight: '1.6' }}>
            An Enquiry Management System simplifies business operations by streamlining the process 
            of capturing, tracking, and responding to customer inquiries. It centralizes all enquiries 
            in one place, ensuring that no leads are lost and enabling quick follow-ups. The system also 
            provides valuable insights through reporting and analytics, helping businesses understand 
            customer needs and preferences. By automating routine tasks and enhancing communication, 
            it improves efficiency, boosts customer satisfaction, and ultimately drives growth.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side - Login Form */}
      <Grid 
        item 
        xs={12} 
        md={6} 
        component={Paper} 
        elevation={6} 
        square 
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box 
          component="form" 
          noValidate 
          autoComplete="off" 
          onSubmit={submithandler} // Attach the submit handler to the form
          style={{ 
            width: '100%', 
            maxWidth: '400px', 
            padding: '10px', 
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            backgroundColor: '#ffffff'
          }}
        >
          <Typography variant="h5" gutterBottom align="center" style={{ fontWeight: 700, color: 'green', textDecoration: 'underline' }}>
            Welcome to HippoEms
          </Typography>

          <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 700, color: '#1976d2' }}>
            Login
          </Typography>
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            margin="normal"
            variant="outlined"
            onChange={handler}
            onBlur={(e) => validateEmail(e.target.value)} // Validate on blur
            required
            error={emailError}
            helperText={emailError ? "Please enter a valid email address" : ""}
            InputProps={{
              style: { borderRadius: '8px' },
            }}
            style={{ marginBottom: '10px' }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            margin="normal"
            variant="outlined"
            required
            onChange={handler}
            InputProps={{
              style: { borderRadius: '8px' },
            }}
            style={{ marginBottom: '10px' }}
          />

          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            style={{ marginBottom: '10px' }}
          >
            <FormControlLabel 
              control={<Checkbox value="remember" color="primary" />} 
              label="Remember me" 
            />
            <Link href="#" variant="body2" style={{ color: '#1976d2' }}>
              Forgot password?
            </Link>
          </Box>

          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            style={{ 
              marginTop: '10px',
              padding: '10px 0',
              borderRadius: '8px',
              fontWeight: 600,
              backgroundColor: '#1976d2'
            }}
            type="submit"
            disabled={emailError || !data.email || !data.password} // Disable the button if there are errors
          >
            Login
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
