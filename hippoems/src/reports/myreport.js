import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField, Modal, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Myreport() {
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [newFolder, setNewFolder] = useState({
    folderName: '',
    description: '',
    selectedColumns: []
  });
  const [columns, setColumns] = useState([]);
  const usenav = useNavigate();
  const uid = localStorage.getItem('id');

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
        axios.delete(`${process.env.REACT_APP_HIPPOEMS}/myreports/${id}`).then((res)=>{
          if(res.status===200){
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: res.data || 'Something went wrong',
              icon: 'error',
            });
          }
        }).catch((err)=>{
          Swal.fire({
            title: 'Error',
            text: err,
            icon: 'error',
          });
        })
      }
    });
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getcolumns`).then((res) => {
      if (res.status === 200) {
        setColumns(res.data);
      } else {
        Swal.fire({
          title: 'Error',
          text: res.data || 'Something went wrong',
          icon: 'error',
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: 'Error',
        text: err,
        icon: 'error',
      });
    });

    axios.get(`${process.env.REACT_APP_HIPPOEMS}/userreports/${uid}`).then((res) => {
      if (res.status === 200) {
        setReportData(res.data);
      } else {
        Swal.fire({
          title: 'Error',
          text: res.data || 'Something went wrong',
          icon: 'error',
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: 'Error',
        text: err,
        icon: 'error',
      });
    });
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setNewFolder((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (event) => {
    const { value, checked } = event.target;
    setNewFolder((prevState) => ({
      ...prevState,
      selectedColumns: checked
        ? [...prevState.selectedColumns, value]
        : prevState.selectedColumns.filter((column) => column !== value)
    }));
  };

  const handleSubmit = () => {
    const newFolderData = {
      folderName: newFolder.folderName,
      description: newFolder.description,
      createdOn: new Date().toISOString().split('T')[0],
      user_id: localStorage.getItem('id'),
      selectedColumns: newFolder.selectedColumns
    };
    axios.post(`${process.env.REACT_APP_HIPPOEMS}/myreports`, newFolderData).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setReportData([...reportData, newFolderData]);
        handleClose();
      } else {
        Swal.fire({
          title: 'Error',
          text: res.data || 'Something went wrong',
          icon: 'error',
        });
      }
    }).catch((Err) => {
      Swal.fire({
        title: 'Error',
        text: Err,
        icon: 'error',
      });
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredReports = reportData.filter((report) =>
    report.reportname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const folderhandler = (id) => {
    usenav('/customreports', {state: id});
  };

  return (
    <div>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ textDecoration: 'underline', color: '#0a9fc7' }}>My Reports</h2>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
          Create Folder
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{backgroundColor: '#0a9fc7' }}>
              <TableCell style={{fontWeight:'bold',color:'white'}}>Sl. No</TableCell>
              <TableCell style={{fontWeight:'bold',color:'white'}}>Folder Name</TableCell>
              <TableCell style={{fontWeight:'bold',color:'white'}}>Description</TableCell>
              <TableCell style={{fontWeight:'bold',color:'white'}}>Created On</TableCell>
              <TableCell style={{fontWeight:'bold',color:'white'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <IconButton style={{ textDecoration: 'none', color: '#1976d2' }}>
                    <FolderIcon color="primary" />
                    <span onClick={() => folderhandler(row.id)} style={{fontSize:'17px'}}>{row.reportname}</span>
                  </IconButton>
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-folder-modal"
        aria-describedby="create-folder-description"
      >
        <Box sx={{ width: 400, p: 3, mx: 'auto', mt: '1%', bgcolor: 'background.paper', borderRadius: 1 }}>
          <h3>Create New Folder</h3>
          <TextField
            label="Folder Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="folderName"
            value={newFolder.folderName}
            onChange={handleFieldChange}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            name="description"
            value={newFolder.description}
            onChange={handleFieldChange}
          />
          <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2, border: '1px solid #ccc', borderRadius: 1, padding: 1 }}>
            <FormGroup>
              {columns.map((column) => (
                <FormControlLabel
                  key={column.value}
                  control={
                    <Checkbox
                      value={column.value}
                      checked={newFolder.selectedColumns.includes(column.value)}
                      onChange={handleSelectChange}
                    />
                  }
                  label={column.value}
                />
              ))}
            </FormGroup>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>Create Folder</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
