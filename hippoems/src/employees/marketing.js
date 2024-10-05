import React, { useState, useEffect } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, 
  Modal, Box, Typography, Grid, InputAdornment, IconButton, useMediaQuery
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Marketing() {
  const [marketingTeam, setMarketingTeam] = useState([]);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', contact: '', role: 'marketing' });
  const [editEmployee, setEditEmployee] = useState({ id: '', username: '', email: '', password: '', contact_number: '', role: 'marketing' });

  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/employee/${'marketing'}`).then((res) => {
      if (res.status === 200) {
        setMarketingTeam(res.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data,
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: 'The Internet?',
        text: 'Check your internet connection',
        icon: 'question',
      });
    });
  }, []);

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${process.env.REACT_APP_HIPPOEMS}/employee/${id}`).then((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            setMarketingTeam(marketingTeam.filter(member => member.id !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.data,
            });
          }
        }).catch((err) => {
          Swal.fire({
            title: 'The Internet?',
            text: 'Check your internet connection',
            icon: 'question',
          });
        });
      }
    });
  };

  const handleAddEmployee = () => {
    axios.post(`${process.env.REACT_APP_HIPPOEMS}/employee`, newEmployee).then((res) => {
      if (res.status === 200) {
        setMarketingTeam([...marketingTeam, { ...newEmployee, id: marketingTeam.length + 1 }]);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Account Created Successfully...',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsModalOpen(false);
        setNewEmployee({ name: '', email: '', password: '', contact: '', role: 'marketing' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data,
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: 'The Internet?',
        text: 'Check your internet connection',
        icon: 'question',
      });
    });
  };

  const handleUpdateEmployee = () => {
    axios.put(`${process.env.REACT_APP_HIPPOEMS}/employee/${editEmployee.id}`, editEmployee).then((res) => {
      if (res.status === 200) {
        setMarketingTeam(marketingTeam.map(member =>
          member.id === editEmployee.id ? editEmployee : member
        ));
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Account Updated Successfully...',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsEditModalOpen(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data,
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: 'The Internet?',
        text: 'Check your internet connection',
        icon: 'question',
      });
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMarketingTeam = marketingTeam.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTogglePasswordVisibility = (id) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSendEmail = (employee) => {
    axios.post(`${process.env.REACT_APP_HIPPOEMS}/send-email`, employee)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Email sent to ${employee.email} successfully!`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.data,
          });
        }
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response?.data || err.message,
        });
      });
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5"  style={{fontFamily: 'Franklin Gothic Medium Cond',textDecoration:'underline',color:'#0a9fc7'}}>Marketing Team :</Typography>
        <TextField 
          label="Search" 
          variant="outlined" 
          size="small" 
          value={searchTerm} 
          onChange={handleSearch}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setIsModalOpen(true)}
        >
          Add Employee
        </Button>
      </Box>

      {isMobile ? (
        <Grid container spacing={2}>
          {filteredMarketingTeam.map((member, index) => (
            <Grid item xs={12} key={member.id}>
              <Box 
                sx={{
                  p: 2, 
                  mb: 2, 
                  border: '1px solid #ddd', 
                  borderRadius: 2, 
                  display: 'flex', 
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h6" style={{fontWeight:'bold',textDecoration:'underline 1px green',color:'#0a9fc7'}}>{index + 1}. {member.username}</Typography>
                <Typography><span style={{fontWeight:'bold'}}>Email:</span>&nbsp; {member.email}</Typography>
                <Typography><span style={{fontWeight:'bold'}}>Contact Number:</span>&nbsp; {member.contact_number}</Typography>
                <Typography><span style={{fontWeight:'bold'}}>Role:</span>&nbsp; {member.role}</Typography>
                <Box mt={2} display="flex" flexDirection="column">
                  <Button 
                    variant="outlined" 
                    endIcon={<ForwardToInboxIcon />} 
                    color="success" 
                    size="small" 
                    onClick={() => handleSendEmail(member)}
                    sx={{ mb: 1 }}
                  >
                    Send
                  </Button>
                  <Button 
                    endIcon={<EditIcon />} 
                    onClick={() => handleEdit(member)} 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    sx={{ mb: 1 }}
                  >
                    Edit
                  </Button>
                  <Button 
                    endIcon={<DeleteForeverIcon />} 
                    onClick={() => handleDelete(member.id)} 
                    variant="outlined" 
                    color="secondary" 
                    size="small"
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Table>
          <TableHead style={{ background: '#0a9fc7' }}>
            <TableRow>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Sl. No</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Contact Number</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMarketingTeam.map((member, index) => (
              <TableRow key={member.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{member.username}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.contact_number}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Button 
                    endIcon={<ForwardToInboxIcon />} 
                    color="success" 
                    size="small" 
                    onClick={() => handleSendEmail(member)}
                  >
                    Send
                  </Button>
                  <Button 
                    endIcon={<EditIcon />} 
                    onClick={() => handleEdit(member)} 
                    color="primary" 
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    Edit
                  </Button>
                  <Button 
                    endIcon={<DeleteForeverIcon />} 
                    onClick={() => handleDelete(member.id)} 
                    color="secondary" 
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Employee Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box 
          sx={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 400, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 24, 
            p: 4
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Employee
          </Typography>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={passwordVisibility['new'] ? 'text' : 'password'}
            value={newEmployee.password}
            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPasswordVisibility((prev) => ({ ...prev, 'new': !prev['new'] }))}
                  >
                    {passwordVisibility['new'] ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            variant="outlined"
            margin="normal"
            value={newEmployee.contact}
            onChange={(e) => setNewEmployee({ ...newEmployee, contact: e.target.value })}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEmployee}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsModalOpen(false)}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box 
          sx={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 400, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 24, 
            p: 4
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Employee
          </Typography>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={editEmployee.username}
            onChange={(e) => setEditEmployee({ ...editEmployee, username: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={editEmployee.email}
            onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={passwordVisibility[editEmployee.id] ? 'text' : 'password'}
            value={editEmployee.password}
            onChange={(e) => setEditEmployee({ ...editEmployee, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePasswordVisibility(editEmployee.id)}
                  >
                    {passwordVisibility[editEmployee.id] ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Contact Number"
            variant="outlined"
            margin="normal"
            value={editEmployee.contact_number}
            onChange={(e) => setEditEmployee({ ...editEmployee, contact_number: e.target.value })}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateEmployee}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsEditModalOpen(false)}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
