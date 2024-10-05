import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Collapse, Box, Typography, Grid, useMediaQuery, useTheme, Tooltip,
  Button, TextField, TablePagination, Dialog,DialogActions,DialogContent,DialogTitle
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from 'react-router-dom';

const Authenquiry = () => {
  const uid = localStorage.getItem('id');
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [mobexpandedRows, setMobexpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const usenav = useNavigate();
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [deleteid,setDeleteid]=useState(null)


  const handleDeleteClick = (id) => {
    setDeleteid(id)
    setOpen(true); 
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  const admininput=(e)=>{
    const {name,value}= e.target;
    setCredentials((prevData)=>({...prevData,[name]:value}));
  }


  const handleSubmit = () => {
    setOpen(false);
    axios.post(`${process.env.REACT_APP_HIPPOEMS}/login`,credentials).then((res)=>{
      if(res.status===200 && res.data[0].role==='admin'){

      axios.delete(`${process.env.REACT_APP_HIPPOEMS}/enquiry/${deleteid}`).then((res)=>{
        if(res.status===200){
          Swal.fire({
            title: "Deleted!",
            text: res.data,
            icon: "success"
          });
          setDeleteid(null)
          setTimeout(()=>{
            window.location.reload();
          },1000)
        }
      })
}
      else{
        Swal.fire({
          title: 'Error',
          text: 'Something Went Wrong Or Invali Login Credentials',
          icon: 'error',
        });
      }
    }).catch((err)=>{
      Swal.fire({
        title: 'Error',
        text: 'Internal Server Error',
        icon: 'error',
      });
    })
  };    




  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/adminenquiry`)
      .then((res) => {
        if (res.status === 200) {
          const updatedData = res.data.map((row) => ({
            ...row,
            payment_terms: JSON.parse(row.payment_terms),
            payment_days: JSON.parse(row.payment_days),
          }));
          setData(updatedData);
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
          text: err.message,
          icon: 'error',
        });
      });
  }, [uid]);

  const handleExpandClick = (rowId) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const mobhandleExpandClick = (rowId) => {
    setMobexpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const addenquiry = () => {
    usenav('/addenquiry');
  };

  const edithandler = (eid) => {
    var role=localStorage.getItem('role');
    if(role==="marketing"){
      usenav('/enquiryedit',{ state: eid })
    }
    else{
      usenav('/enquiryedit2', { state: eid })
    }
  };

  const updatehandler=(ern)=>{
    usenav('/addupdate', { state: ern });
  }

  const annexure=(eid)=>{
    usenav('/annexure', { state: eid });
  }

  const coverpagehandler=(eid)=>{
    usenav('/coverpage', {state: eid})
  }

  return (
    <div>
      {!isMobile ? 
    <Box sx={{ position: 'relative', padding: 2 }}>
      <Box sx={{ position: 'fixed', top: '70px', left: 0, right: 0, backgroundColor: 'white', zIndex: 1, padding: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Typography variant='h4'
  style={{
    color: '#0a9fc7',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' ,
    marginBottom: '10px',
    textDecoration:'underline'
  }} gutterBottom>
              Enquiries
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" alignItems="center">
            <TextField variant="outlined" label="Search" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={addenquiry}>
              Add New Enquiry
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ marginTop: '80px' }}>
        <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['Sl. No', 'Reference Number', 'Owner', 'Subject', 'Company', 'Person', 'GST', 'Number', 'Email', 'State', 'City', 'Products', 'Source', 'Status', 'Sector', 'Stage', 'Customertype' ,'Due Date', 'Special Notes', 'Payment Terms', 'Enquiry Date', 'Actions'].map((header) => (
                  <TableCell key={header} style={{ color: 'white', fontWeight: 'bold', padding: 2, fontSize: isMobile ? '0.8rem' : '1rem', backgroundColor: '#0a9fc7' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{row.ern}</TableCell>
                    <TableCell>{row.owner}</TableCell>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.person}</TableCell>
                    <TableCell>{row.gst}</TableCell>
                    <TableCell>{row.number}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.state}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleExpandClick(row.id)}>
                        {expandedRows[row.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.sector}</TableCell>
                    <TableCell>{row.stage}</TableCell>
                    <TableCell>{row.customer_type}</TableCell>
                    <TableCell>{row.due_date}</TableCell>
                    <TableCell>{row.special_notes}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleExpandClick(row.id + 'payment')}>
                        {expandedRows[row.id + 'payment'] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.created_on}</TableCell>
                    <TableCell style={{ display: 'flex', gap: 8 }}>
                      <Tooltip title="Edit" onClick={() => edithandler(row.id)}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update" onClick={() => updatehandler(row.ern)}>
                        <IconButton color="warning">
                          <UpdateIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cover Page" onClick={() => coverpagehandler(row.id)}>
                        <IconButton color="success">
                          <ReceiptLongIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Annexure-1" onClick={() => annexure(row.id)}>
                        <IconButton color="secondary">
                          <ArticleIcon />
                        </IconButton>
                      </Tooltip>
                      {localStorage.getItem('role')==='admin' ? <Tooltip title="Delete">
                        <IconButton color="error" onClick={()=>handleDeleteClick(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>:''}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={21} sx={{ padding: 0 }}>
                      <Collapse in={expandedRows[row.id]}>
                        <Box sx={{ padding: 1, maxWidth: isMobile ? '65%' : '40%', marginX: 'auto', marginLeft: isMobile ? '0' : '50%' }}>
                          <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: 2 }}>
                            <Table>
                              <TableHead style={{ background: '#0a9fc7' }}>
                                <TableRow style={{ height: '20px' }}>
                                  {['Sl. No', 'Category', 'Product', 'Quantity', 'Unit Price', 'GST', 'Total Price'].map((header) => (
                                    <TableCell key={header} style={{ color: 'white', fontWeight: 'bold', padding: 4, fontSize: isMobile ? '0.8rem' : '1rem' }}>
                                      {header}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.products.map((product, index) => (
                                  <TableRow key={index} style={{ height: '30px' }}>
                                    <TableCell style={{ padding: 6 }}>{index + 1}</TableCell>
                                    <TableCell style={{ padding: 6 }}>{product.category}</TableCell>
                                    <TableCell style={{ padding: 6 }}>{product.product}</TableCell>
                                    <TableCell style={{ padding: 6 }}>{product.quantity}</TableCell>
                                    <TableCell style={{ padding: 6 }}>{product.unitprice}</TableCell>
                                    <TableCell style={{ padding: 6 }}>{product.pgst}%</TableCell>
                                    <TableCell style={{ padding: 6 }}>{product.totalprice}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={21} sx={{ padding: 0 }}>
                      <Collapse in={expandedRows[row.id + 'payment']}>
                        <Box sx={{ padding: 1, maxWidth: isMobile ? '65%' : '40%', marginX: 'auto', marginLeft: isMobile ? '0' : '60%' }}>
                        
                          <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: 2 }}>
                            <Table>
                              <TableHead style={{ background: '#0a9fc7' }}>
                                <TableRow style={{height:'30px'}}>
                                  {['For', 'Delivery Period', 'Gst', 'Payment Terms','Payment Days','Validity','Note'].map((header) => (
                                    <TableCell key={header} style={{ color: 'white', fontWeight: 'bold',padding:4, fontSize: isMobile ? '0.8rem' : '1rem' }}>
                                      {header}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                               
                                  <TableRow style={{height:'30px'}}>
                                    <TableCell>{row.enquiry_for}</TableCell>
                                    <TableCell>{row.delivery_period === "Enter Number of Weeks" ? `${row.no_of_weeks} Weeks`  : row.delivery_period}</TableCell>
                           
                                    <TableCell style={{padding:5}}>{row.customgst==='undefined' ? '---':row.customgst}</TableCell>
                                    <TableCell style={{padding:5}}>{row.payment_terms  ? JSON.parse(row.payment_terms).map((term, index) => (
                                      <div key={index}>
                                               <ul>
                                                 <li>{term.option} {term.percentage}%</li>
                                                     </ul>
                                                 </div>
                                                ))
                                          : 'No payment terms available'}
                                              </TableCell>

                                        <TableCell style={{padding:5}}> {row.payment_days
                                                    ? JSON.parse(row.payment_days).map((term, index) => (
                                                   <div key={index}>
                                                      <ul>
                                                     <li>{term.option}: {term.days}Days</li>
                                                           </ul>
                                                      </div>
                                                            ))
                                                  : '---'}</TableCell>
                                                  <TableCell style={{padding:5}}>{row.validity==='undefined' ? '----':row.validity}</TableCell>
                                                  <TableCell style={{padding:5}}>{row.note==="undefined" ? '----' : row.note}</TableCell>
                                  </TableRow>
                              
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                  
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Re-verify Admin Credentials</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            type="email"
            name="email"
            fullWidth
            onChange={admininput}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            name="password"
            fullWidth
            onChange={admininput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Verify and Delete
          </Button>
        </DialogActions>
      </Dialog>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Box>
    : <div>
    <Grid container gap={2}> 

         <Grid sm={6}><TextField
                       variant="outlined"
                       label="Search"
                       sx={{ width: '170px' }} /></Grid>
         <Grid sm={6}><Button variant='contained' onClick={addenquiry}>Add enquiry</Button></Grid>
   </Grid>
   <Grid xs={12}>
    <Typography variant='h5' sx={{mt:1,fontFamily:'Franklin Gothic Medium Cond',color: '#0a9fc7',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' ,}}>Enquiries List</Typography><hr style={{ borderColor: 'green' }} />
   </Grid>
      {data.map((row,index)=><>
   <Grid container spacing={2}>
    <Grid item xs={12}>
      <Paper sx={{ p:2 , mb:2}}>
      <Typography variant="subtitle1"><strong>Sl. No:</strong> {index+1}</Typography>
      <Typography variant="subtitle1"><strong>Refernce no:</strong>{row.ern}</Typography>
      <Typography variant="subtitle1"><strong>Owner:</strong>{row.ern}</Typography>
      <Typography variant="subtitle1"><strong>Subject:</strong>{row.subject==="" || 'undefined' ? '---' : row.subject}</Typography>
      <Typography variant="subtitle1"><strong>Company:</strong>{row.company}</Typography>
      <Typography variant="subtitle1"><strong>Gst:</strong>{row.gst}</Typography>
      <Typography variant="subtitle1"><strong>Person:</strong>{row.person}</Typography>
      <Typography variant="subtitle1"><strong>Email:</strong>{row.email}</Typography>
      <Typography variant="subtitle1"><strong>Number:</strong>{row.number}|</Typography>
      <Typography variant="subtitle1"><strong>State:</strong>{row.state}</Typography>
      <Typography variant="subtitle1"><strong>City:</strong>{row.city}</Typography>
      <Typography variant="subtitle1"><strong>Products:</strong> <IconButton onClick={() => mobhandleExpandClick(row.id)}>
                        {mobexpandedRows[row.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton></Typography>
                      <Collapse in={mobexpandedRows[row.id]}>
                        <Box sx={{ padding: 1, maxWidth: '100%', marginX: 'auto' }}>
                          <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: 0 }}>
                            <Table>
                              <TableHead style={{ background: '#0a9fc7' }}>
                                <TableRow style={{ height: '20px' }}>
                                  {['Sl.No', 'Category', 'Product', 'Quantity', 'Unit Price', 'GST', 'Total Price'].map((header) => (
                                    <TableCell key={header} style={{ color: 'white', fontWeight: 'bold', padding: 2, fontSize:'0.5rem' }}>
                                      {header}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.products.map((product, index) => (
                                  <TableRow key={index} style={{ height: '30px' }}>
                                    <TableCell style={{ padding: 6,fontSize:'0.5rem' }}>{index + 1}</TableCell>
                                    <TableCell style={{ padding: 6 ,fontSize:'0.5rem'}}>{product.category}</TableCell>
                                    <TableCell style={{ padding: 6, fontSize:'0.5rem' }}>{product.product}</TableCell>
                                    <TableCell style={{ padding: 6,fontSize:'0.5rem' }}>{product.quantity}</TableCell>
                                    <TableCell style={{ padding: 6, fontSize:'0.5rem' }}>{product.unitprice}</TableCell>
                                    <TableCell style={{ padding: 6, fontSize:'0.5rem' }}>{product.pgst}%</TableCell>
                                    <TableCell style={{ padding: 6, fontSize:'0.5rem' }}>{(product.totalprice * (1 - Math.random() * 0.1)).toFixed(2)}</TableCell>

                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Collapse>
      <Typography variant="subtitle1"><strong>Source:</strong>{row.source}</Typography>
      <Typography variant="subtitle1"><strong>Sector:</strong>{row.sector}</Typography>
      <Typography variant="subtitle1"><strong>Stage:</strong>{row.stage}</Typography>
      <Typography variant="subtitle1"><strong>Customer Type:</strong>{row.customer_type}</Typography>
      <Typography variant="subtitle1"><strong>Due Date:</strong>{row.due_date}</Typography>
      <Typography variant="subtitle1"><strong>Special Notes:</strong>{row.special_notes}</Typography>
      <Typography variant="subtitle1"><strong>Enquiry date:</strong>{row.created_on}</Typography>
      <Typography variant="subtitle1"><strong>Payment Terms:</strong>
      <IconButton onClick={() => mobhandleExpandClick(row.id + 'payment')}>
                        {mobexpandedRows[row.id + 'payment'] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
      </Typography>
      <Collapse in={mobexpandedRows[row.id + 'payment']}>
                        <Box sx={{ padding: 1, maxWidth: '100%', marginX: 'auto' }}>
                        
                          <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: 2 }}>
                            <Table>
                              <TableHead style={{ background: '#0a9fc7' }}>
                                <TableRow style={{height:'30px'}}>
                                  {['For', 'Delivery Period', 'Gst', 'Payment Terms','Payment Days','Validity','Note'].map((header) => (
                                    <TableCell key={header} style={{ color: 'white', fontWeight: 'bold',padding:2, fontSize:'0.5rem' }}>
                                      {header}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                               
                                  <TableRow style={{height:'30px'}}>
                                    <TableCell style={{fontSize:'0.5rem'}}>{row.enquiry_for}</TableCell>
                                    <TableCell style={{fontSize:'0.5rem'}}>{row.delivery_period === "Enter Number of Weeks" ? `${row.no_of_weeks} Weeks`  : row.delivery_period}</TableCell>
                           
                                    <TableCell style={{padding:5,fontSize:'0.5rem'}}>{row.customgst==='undefined' ? '---':row.customgst}</TableCell>
                                    <TableCell style={{padding:5,fontSize:'0.5rem'}}>{row.payment_terms  ? JSON.parse(row.payment_terms).map((term, index) => (
                                      <div key={index}>
                                               <ul>
                                                 <li>{term.option} {term.percentage}%</li>
                                                     </ul>
                                                 </div>
                                                ))
                                          : 'No payment terms available'}
                                              </TableCell>

                                        <TableCell style={{padding:5,fontSize:'0.5rem'}}> {row.payment_days
                                                    ? JSON.parse(row.payment_days).map((term, index) => (
                                                   <div key={index}>
                                                      <ul>
                                                     <li>{term.option}: {term.days}Days</li>
                                                           </ul>
                                                      </div>
                                                            ))
                                                  : '---'}</TableCell>
                                                  <TableCell style={{padding:5,fontSize:'0.5rem'}}>{row.validity==='undefined' ? '----':row.validity}</TableCell>
                                                  <TableCell style={{padding:5,fontSize:'0.5rem'}}>{row.note==="undefined" ? '----' : row.note}</TableCell>
                                  </TableRow>
                              
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Collapse>
        <Grid container>
          <Grid item xs={2}>
          <Tooltip title="Edit" onClick={() => edithandler(row.id)}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
          </Grid>
          <Grid item xs={2}>
          <Tooltip title="Update" onClick={() => updatehandler(row.ern)}>
                        <IconButton color="warning">
                          <UpdateIcon />
                        </IconButton>
                      </Tooltip>
          </Grid>
          <Grid item xs={2}>  <Tooltip title="Cover Page" onClick={() => coverpagehandler(row.id)}>
                        <IconButton color="success">
                          <ReceiptLongIcon />
                        </IconButton>
                      </Tooltip></Grid>

                      <Grid item xs={2}>  <Tooltip title="Annexure-1" onClick={() => annexure(row.id)}>
                        <IconButton color="secondary">
                          <ArticleIcon />
                        </IconButton>
                      </Tooltip></Grid>
                  
                      <Grid item xs={2}>
                      {localStorage.getItem('role')==='admin' ? <Tooltip title="Delete">
                        <IconButton color="error" onClick={()=>handleDeleteClick(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>:''}
                      </Grid>
        </Grid>

      </Paper>
    </Grid>
   </Grid>
   </>)}



   </div>
    
    }
    </div>
  );
};

export default Authenquiry;
