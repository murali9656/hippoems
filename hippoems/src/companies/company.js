import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, Button, Box, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, Grid, Autocomplete,Typography,useTheme,useMediaQuery 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';

const statesWithCities = {
  // Your state and city data
  AndhraPradesh: ['Visakhapatnam', 'Vijayawada', 'Guntur','Nellore','Kurnool','Kakinada','Rajahmundry','Kadapa','Mangalagiri','Tirupati','Tadepalli','Anantapuram','Vizianagaram','Ongole','Eluru','Proddatur','Nandyala','Adoni','Madanapalle','Machilipatnam','Tenali','Chittoor','Hindupur','Srikakulam','Bhimavaram','Tadepalligudem','Guntakal','Dharmavaram','Gudivada','Narasaraopet','Kadiri','Chilakaluripet'],
  ArunachalPradesh: ['Tawang', 'West Kameng', 'East Kameng','Pakke-Kessang','Kurung Kumey','Papum Pare','Itanagar','Kra Daadi','Lower Subansiri','Kamle','Keyi Panyor','Tawang','West Kameng','East Kameng','Pakke-Kessang','Kurung Kumey','Papum Pare','Itanagar','Kra Daadi','Lower Subansiri','Kamle','Keyi Panyor','Upper Subansiri','Shi-Yomi','West Siang','Siang','Lower Siang','Lepa-Rada','Upper Siang','East Siang','Dibang Valley','Lower Dibang Valley','Lohit','Anjaw','Namsai','Changlang','Tirap','Longding','Upper Subansiri','Shi-Yomi','West Siang','Siang','Lower Siang','Lepa-Rada','Upper Siang','East Siang','Dibang Valley','Lower Dibang Valley','Lohit','Anjaw','Namsai','Changlang','Tirap','Longding'],
  Telangana: ['Adilabad','Kumuram Bheem Asifabad','Mancherial','Nirmal','Nizamabad','Jagtial','Peddapalli','Kamareddy','Rajanna Sircilla','Karimnagar','Jayashankar Bhupalpally','Sangareddy','Medak','Siddipet','Jangaon','Hanamkonda','Warangal','Mulugu','Bhadradri kothagudem','Khammam','Mahabubabad','Suryapet','Nalgonda','Yadadri Bhuvanagiri','Medchal–Malkajgiri','Hyderabad','Ranga Reddy','Vikarabad','Narayanpet','Mahabubnagar','Nagarkurnool','Mancherial','Nirmal','Nizamabad','Jagtial','Peddapalli','Kamareddy','Rajanna Sircilla','Karimnagar','Jayashankar Bhupalpally','Sangareddy','Medak','Siddipet','Jangaon','Hanamkonda','Warangal','Mulugu','Bhadradri kothagudem','Khammam','Mahabubabad','Suryapet','Nalgonda','Yadadri Bhuvanagiri','Medchal–Malkajgiri','Ranga Reddy','Vikarabad','Narayanpet','Mahabubnagar','Nagarkurnool','Wanaparthy','Jogulamba Gadwal'],
  Assam: ['Baksa','Barpeta','Biswanath','Bongaigaon','Cachar','Charaideo','Chirang','Darrang','Dhemaji','Dhubri','Dibrugarh','Dima Hasao(North Cachar Hills)','Goalpara','Golaghat','Hailakandi','Hojai','Jorhat','Kamrup','Kamrup Metropolitan','Nagaon','Karbi Anglong','Karimaganj','Kokrajhar','Lakhimpur','Majuli','Morigaon','Nalbari','Sivasagar','Sonitpur','South Salamara Mankachar','Tinsukia','Udakguri','West Karbi Anglong','Bajali','Tamulpur'],
  Bihar: ['Araria','Arwal','Aurangabd']
}

const Company = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); 
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: '',
    gst: '',
    contactPerson: '',
    contactEmail: '',
    contactNumber: '',
    state: '',
    city: '',
    userId: localStorage.getItem('id')
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [editCompany, setEditCompany] = useState(null); // State for edited company
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getcompanies`).then((res) => {
      if (res.status === 200) {
        setCompanies(res.data);
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
        icon: 'question'
      });
    });
  }, []);

  const handleEdit = (company) => {
    setEditCompany(company);
    setCities(statesWithCities[company.state] || []);
    setEditOpen(true);
  };

  const handleDelete = (id) => {
    console.log(`Delete company with id: ${id}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditCompany(null);
  };

  const handleChange = (event, value, reason) => {
    const name = event.target.name || reason;
    const newValue = value || event.target.value;
    
    if (name === 'state') {
      setCities(statesWithCities[newValue] || []);
    }

    setNewCompany({ ...newCompany, [name]: newValue });

    if (editCompany) {
      setEditCompany({ ...editCompany, [name]: newValue });
    }
  };

  const handleAddCompany = () => {
    axios.post(`${process.env.REACT_APP_HIPPOEMS}/company`, newCompany).then(res => {
      if (res.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Company Registered Successfully...',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data,
        });
      }
    }).catch((Err) => {
      Swal.fire({
        title: 'The Internet?',
        text: 'Check your internet connection',
        icon: 'question'
      });
    });
    setOpen(false);
  };

  const handleUpdateCompany = () => {
    axios.put(`${process.env.REACT_APP_HIPPOEMS}/company/${editCompany.id}`, editCompany).then(res => {
      if (res.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Company Updated Successfully...',
          showConfirmButton: false,
          timer: 1500
        });
        setEditOpen(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.data,
        });
      }
    }).catch((Err) => {
      Swal.fire({
        title: 'The Internet?',
        text: 'Check your internet connection',
        icon: 'question'
      });
    });
  };

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f4f8' }}>
        <h2>Registered Companies </h2>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Company
          </Button>
          <TextField 
            variant="outlined" 
            size="small" 
            placeholder="Search Company..." 
            sx={{ backgroundColor: 'white' }} 
          />
        </Box>
      </Box>
      
      {isMobile ? (
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {companies.map((company, index) => (
            <Grid item xs={12} key={company.id}>
              <Box sx={{ border: '1px solid #ddd', borderRadius: 2, padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" sx={{textDecoration:'underline 1px green',color:'#0a9fc7'}}>{index + 1}. {company.company}</Typography>
                <Typography variant="body2"><span style={{fontWeight:'bold'}}>GST:</span>&nbsp; {company.gst}</Typography>
                <Typography variant="body2"><span style={{fontWeight:'bold'}}>Contact Person:</span>&nbsp; {company.person}</Typography>
                <Typography variant="body2"><span style={{fontWeight:'bold'}}>Contact Email:</span>&nbsp; {company.email}</Typography>
                <Typography variant="body2"><span style={{fontWeight:'bold'}}>Contact Number:</span> &nbsp;{company.number}</Typography>
                <Typography variant="body2"><span style={{fontWeight:'bold'}}>State:</span>&nbsp; {company.state}</Typography>
                <Typography variant="body2"><span style={{fontWeight:'bold'}}>City:</span>&nbsp; {company.city}</Typography>
                <Typography variant="body2"><span style={{fontWeight:'bold'}}>User ID: </span>&nbsp;HC{company.user_id}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                  <IconButton color="primary" onClick={() => handleEdit(company)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(company.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table style={{ backgroundColor: '#f0f4f8' }}>
              <TableHead style={{ background: '#0a9fc7' }}>
                <TableRow>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Sl. No</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Company Name</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>GST</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Contact Person</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Contact Email</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Contact Number</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>State</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>User ID</TableCell>
                  <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow key={company.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>FT{company.id}</TableCell>
                    <TableCell>{company.company}</TableCell>
                    <TableCell>{company.gst}</TableCell>
                    <TableCell>{company.person}</TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.number}</TableCell>
                    <TableCell>{company.state}</TableCell>
                    <TableCell>{company.city}</TableCell>
                    <TableCell>{company.user_id}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(company)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(company.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
      )}

      {/* Modal for adding a company */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Company</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Company Name"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="gst"
                label="GST"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="contactPerson"
                label="Contact Person"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="contactEmail"
                label="Contact Email"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="contactNumber"
                label="Contact Number"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                name="state"
                options={Object.keys(statesWithCities)}
                onChange={(event, value) => handleChange(event, value, 'state')}
                renderInput={(params) => <TextField {...params} label="State" variant="outlined" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                name="city"
                options={cities}
                onChange={(event, value) => handleChange(event, value, 'city')}
                renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddCompany} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Modal for editing a company */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent>
          {editCompany && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  value={editCompany.company}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="gst"
                  label="GST"
                  variant="outlined"
                  fullWidth
                  value={editCompany.gst}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contactPerson"
                  label="Contact Person"
                  variant="outlined"
                  fullWidth
                  value={editCompany.person}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contactEmail"
                  label="Contact Email"
                  variant="outlined"
                  fullWidth
                  value={editCompany.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contactNumber"
                  label="Contact Number"
                  variant="outlined"
                  fullWidth
                  value={editCompany.number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  name="state"
                  options={Object.keys(statesWithCities)}
                  value={editCompany.state}
                  onChange={(event, value) => handleChange(event, value, 'state')}
                  renderInput={(params) => <TextField {...params} label="State" variant="outlined" />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  name="city"
                  options={cities}
                  value={editCompany.city}
                  onChange={(event, value) => handleChange(event, value, 'city')}
                  renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleUpdateCompany} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default Company;
