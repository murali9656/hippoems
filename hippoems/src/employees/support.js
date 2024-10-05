import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, 
  Modal, Box, Typography, Grid, IconButton, InputAdornment, useMediaQuery, useTheme
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Support() {
  const [marketingTeam, setMarketingTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', contact: '', role: 'support' });
  const [editEmployee, setEditEmployee] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/employee/support`).then((res) => {
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

  const handleTogglePasswordVisibility = (id) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAddEmployee = () => {
    axios.post(`${process.env.REACT_APP_HIPPOEMS}/employee`, newEmployee).then((res) => {
      if (res.status === 200) {
        setMarketingTeam([...marketingTeam, { ...newEmployee, id: marketingTeam.length + 1 }]);
        setIsModalOpen(false);
        setNewEmployee({ name: '', email: '', password: '', contact: '', role: 'support' });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Account Created Successfully...',
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
        title: 'The Internet?',
        text: 'Check your internet connection',
        icon: 'question',
      });
    });
  };

  const handleEditEmployee = () => {
    axios.put(`${process.env.REACT_APP_HIPPOEMS}/employee/${editEmployee.id}`, editEmployee).then((res) => {
      if (res.status === 200) {
        setMarketingTeam(marketingTeam.map(member => member.id === editEmployee.id ? editEmployee : member));
        setIsEditModalOpen(false);
        setEditEmployee(null);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Employee Updated Successfully...',
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
        title: 'The Internet?',
        text: 'Check your internet connection',
        icon: 'question',
      });
    });
  };

  const filteredMarketingTeam = marketingTeam.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div style={{ marginTop: '20px' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h5" style={{fontFamily: 'Franklin Gothic Medium Cond',textDecoration:'underline',color:'#0a9fc7'}}>Support Team:</Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Add Employee
        </Button>
      </Box>

      {isMobile ? (
        <Grid container spacing={2}>
          {filteredMarketingTeam.map((member, index) => (
            <Grid item xs={12} key={member.id}>
              <Box border={1} borderColor="grey.400" p={2} mb={2} borderRadius={1}>
                <Typography variant="h6" style={{fontWeight:'bold',textDecoration:'underline 1px green',color:'#0a9fc7'}}> Employee {index + 1}</Typography>
                <Typography><span style={{fontWeight:'bold'}}>Name:</span> {member.username}</Typography>
                <Typography><span style={{fontWeight:'bold'}}>Email:</span> {member.email}</Typography>
                <Typography style={{fontWeight:'bold'}}>
                  Password: 
                  <TextField
                    type={passwordVisibility[member.id] ? 'text' : 'password'}
                    value={member.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility(member.id)}
                          >
                            {passwordVisibility[member.id] ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    size="small"
                    margin="normal"
                  />
                </Typography>
                <Typography><span style={{fontWeight:'bold'}}>Contact Number:</span> {member.contact_number}</Typography>
                <Typography><span style={{fontWeight:'bold'}}>Role:</span> {member.role}</Typography>
                <Box display="flex" mt={2}>
                  <Button variant="outlined" endIcon={<ForwardToInboxIcon />} color="success" size="small" sx={{ marginRight: 1 }}>Send</Button>
                  <Button endIcon={<EditIcon />} variant="outlined" color="primary" size="small" sx={{ marginRight: 1 }} onClick={() => { setEditEmployee(member); setIsEditModalOpen(true); }}>Edit</Button>
                  <Button endIcon={<DeleteForeverIcon />} variant="outlined" color="secondary" onClick={() => handleDelete(member.id)} size="small">Delete</Button>
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
              <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Password</TableCell>
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
                <TableCell>
                  <TextField
                    type={passwordVisibility[member.id] ? 'text' : 'password'}
                    value={member.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility(member.id)}
                          >
                            {passwordVisibility[member.id] ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    size="small"
                  />
                </TableCell>
                <TableCell>{member.contact_number}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Button variant="outlined" endIcon={<ForwardToInboxIcon />} color="success" size="small" sx={{ marginRight: 1 }}>Send</Button>
                  <Button endIcon={<EditIcon />} variant="outlined" color="primary" size="small" sx={{ marginRight: 1 }} onClick={() => { setEditEmployee(member); setIsEditModalOpen(true); }}>Edit</Button>
                  <Button endIcon={<DeleteForeverIcon />} variant="outlined" color="secondary" onClick={() => handleDelete(member.id)} size="small">Delete</Button>
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
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 1,
            margin: 'auto',
            mt: 10,
          }}
        >
          <Typography variant="h6" mb={2}>Add Employee</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={newPasswordVisible ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={newEmployee.password}
            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                    {newPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEmployee.contact}
            onChange={(e) => setNewEmployee({ ...newEmployee, contact: e.target.value })}
          />
          <TextField
            label="Role"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newEmployee.role}
            disabled
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleAddEmployee}>Add</Button>
            <Button variant="outlined" color="secondary" onClick={() => setIsModalOpen(false)} sx={{ ml: 2 }}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 1,
            margin: 'auto',
            mt: 10,
          }}
        >
          <Typography variant="h6" mb={2}>Edit Employee</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editEmployee?.username || ''}
            onChange={(e) => setEditEmployee({ ...editEmployee, username: e.target.value })}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editEmployee?.email || ''}
            onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={newPasswordVisible ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={editEmployee?.password || ''}
            onChange={(e) => setEditEmployee({ ...editEmployee, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                    {newPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editEmployee?.contact_number || ''}
            onChange={(e) => setEditEmployee({ ...editEmployee, contact_number: e.target.value })}
          />
          <TextField
            label="Role"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editEmployee?.role || ''}
            disabled
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleEditEmployee}>Save</Button>
            <Button variant="outlined" color="secondary" onClick={() => setIsEditModalOpen(false)} sx={{ ml: 2 }}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
