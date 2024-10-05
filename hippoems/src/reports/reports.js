import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Collapse, Box, Typography, Grid, useMediaQuery, useTheme,
  Button, TextField, TablePagination, Dialog, DialogActions, DialogContent,
  DialogTitle, Checkbox, FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Badge from '@mui/material/Badge';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const uid = localStorage.getItem('id');
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    ern: true,
    owner: true,
    subject: true,
    company: true,
    person: true,
    gst: true,
    number: true,
    email: true,
    state: true,
    city: true,
    updates: true,
    update_date:true,
    products: true,
    source: true,
    status: true,
    reasonForReject: true,
    sector: true,
    stage: true,
    customer_type: true,
    due_date: true,
    special_notes: true,
    payment_terms: true,
    created_on: true
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/reports`)
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleColumnToggle = (column) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const openCustomizationDialog = () => {
    setOpenDialog(true);
  };

  const closeCustomizationDialog = () => {
    setOpenDialog(false);
  };

  const updatehandler=(ern)=>{
    navigate('/updatelist',{state:ern})
  }

  const columnHeaders = [
    { key: 'ern', label: 'Reference Number' },
    { key: 'owner', label: 'Owner' },
    { key: 'subject', label: 'Subject' },
    { key: 'company', label: 'Company' },
    { key: 'person', label: 'Person' },
    { key: 'gst', label: 'GST' },
    { key: 'number', label: 'Number' },
    { key: 'email', label: 'Email' },
    { key: 'state', label: 'State' },
    { key: 'city', label: 'City' },
    { key: 'updates', label: 'Updates Count'},
    { key: 'update_date', label:'Last Update On'},
    { key: 'products', label: 'Products' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status' },
    { key: 'sector', label: 'Sector' },
    { key: 'stage', label: 'Stage' },
    { key: 'customer_type', label: 'Customer Type' },
    { key: 'due_date', label: 'Due Date' },
    { key: 'special_notes', label: 'Special Notes' },
    { key: 'payment_terms', label: 'Payment Terms' },
    { key: 'created_on', label: 'Enquiry Date' }
  ];

  return (
    <div>
    <Box sx={{ position: 'relative', padding: 2 }}>
      <Box sx={{ position: 'fixed', top: '70px', left: 0, right: 0, backgroundColor: 'white', zIndex: 1, padding: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Typography
              variant='h4'
              style={{
                color: '#0a9fc7',
                marginBottom: '10px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                textDecoration: 'underline'
              }} gutterBottom>
              Reports
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" alignItems="center">
            <TextField variant="outlined" label="Search" fullWidth />
          </Grid>
          <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={openCustomizationDialog}
            >
              Customize Reports
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ marginTop: '80px' }}>
        <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: 'white', fontWeight: 'bold', padding: 2, fontSize: isMobile ? '0.8rem' : '1rem', backgroundColor: '#0a9fc7' }}>S.No</TableCell>
                {columnHeaders.map((header) => (
                  columnVisibility[header.key] && (
                    <TableCell
                      key={header.key}
                      style={{ color: 'white', fontWeight: 'bold', padding: 2, fontSize: isMobile ? '0.8rem' : '1rem', backgroundColor: '#0a9fc7' }}
                    >
                      {header.label}
                    </TableCell>
                  )
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <>
                  <TableRow key={row.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    {columnVisibility.ern && <TableCell>{row.ern}</TableCell>}
                    {columnVisibility.owner && <TableCell>{row.owner}</TableCell>}
                    {columnVisibility.subject && <TableCell>{row.subject}</TableCell>}
                    {columnVisibility.company && <TableCell>{row.company}</TableCell>}
                    {columnVisibility.person && <TableCell>{row.person}</TableCell>}
                    {columnVisibility.gst && <TableCell>{row.gst}</TableCell>}
                    {columnVisibility.number && <TableCell>{row.number}</TableCell>}
                    {columnVisibility.email && <TableCell>{row.email}</TableCell>}
                    {columnVisibility.state && <TableCell>{row.state}</TableCell>}
                    {columnVisibility.city && <TableCell>{row.city}</TableCell>}
                    {columnVisibility.updates && <TableCell> <IconButton color="info">
                      <Badge badgeContent={row.row_count} color="secondary" onClick={()=>updatehandler(row.ern)}>
                        <NotificationsActiveIcon />
                      </Badge>
                    </IconButton></TableCell>}
                    {columnVisibility.update_date && <TableCell>{row.last_update_date=== null ? '---' : row.last_update_date}</TableCell>}
                    {columnVisibility.products && (
                      <TableCell>
                        {row.products?.length > 0 && (
                          <>
                            <IconButton onClick={() => handleExpandClick(row.id)}>
                              {expandedRows[row.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.source && <TableCell>{row.source}</TableCell>}
                    {columnVisibility.status && <TableCell>{row.status}</TableCell>}
                    {columnVisibility.sector && <TableCell>{row.sector}</TableCell>}
                    {columnVisibility.stage && <TableCell>{row.stage}</TableCell>}
                    {columnVisibility.customer_type && <TableCell>{row.customer_type}</TableCell>}
                    {columnVisibility.due_date && <TableCell>{row.due_date}</TableCell>}
                    {columnVisibility.special_notes && <TableCell>{row.special_notes==="undefined" ? '---' :row.special_notes}</TableCell>}
                    {columnVisibility.payment_terms && <TableCell>
                      <IconButton onClick={() => handleExpandClick(row.id + 'payment')}>
                        {expandedRows[row.id + 'payment'] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      </TableCell>}
                    {columnVisibility.created_on && <TableCell>{row.created_on}</TableCell>}
                  </TableRow>
                  
                  {expandedRows[row.id] && columnVisibility.products && (
                    <TableRow>
                      <TableCell colSpan={columnHeaders.length + 1}>
                        <Collapse in={expandedRows[row.id]} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Table size="small" aria-label="product-details" style={{width:'40%',marginLeft:'25%'}}>
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>S.no</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Category</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Product</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Quantity</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Unitprice</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Gst</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Total</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {row.products?.map((product, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.product}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.unitprice}</TableCell>
                                    <TableCell>{product.pgst}%</TableCell>
                                    <TableBody>{Math.floor(product.totalprice)}</TableBody>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    
                  )}

                   {expandedRows[row.id + 'payment'] && columnVisibility.payment_terms && (
                    <TableRow>
                      <TableCell colSpan={columnHeaders.length + 1}>
                        <Collapse in={expandedRows[row.id + 'payment']} timeout="auto" unmountOnExit>
                          <Box margin={2}>
                            <Table size="small" aria-label="product-details" style={{width:'40%',marginLeft:'65%'}}>
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>For</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Delivery Period</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Gst</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Payment Terms</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Payment Days</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Validity</TableCell>
                                  <TableCell style={{ backgroundColor: '#0a9fc7',color:'white'}}>Note</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                
                                  <TableRow>
                                    <TableCell>{row.enquiry_for}</TableCell>
                                    <TableCell>{row.delivery_period === "Enter Number of Weeks" ? `${row.no_of_weeks} Weeks`  : row.delivery_period}</TableCell>
                                    <TableCell style={{padding:5}}>{row.customgst==='undefined' ? '---':row.customgst}</TableCell>
                                    <TableCell>{row.payment_terms  ? JSON.parse(row.payment_terms).map((term, index) => (
                                      <div key={index}>
                                               <ul>
                                                 <li>{term.option} {term.percentage}%</li>
                                                     </ul>
                                                 </div>
                                                ))
                                          : 'No payment terms available'}</TableCell>
                                    <TableCell>
                                    {row.payment_days
                                                    ? JSON.parse(row.payment_days).map((term, index) => (
                                                   <div key={index}>
                                                      <ul>
                                                     <li>{term.option}: {term.days}Days</li>
                                                           </ul>
                                                      </div>
                                                            ))
                                                  : '---'}
                                    </TableCell>
                                    <TableCell>{row.validity==='undefined' ? '----':row.validity}</TableCell>
                                    <TableBody>{row.note==="undefined" ? '----' : row.note}</TableBody>
                                  </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Dialog for column customization */}
      <Dialog open={openDialog} onClose={closeCustomizationDialog}>
        <DialogTitle>Customize Reports</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {columnHeaders.map((header) => (
              <Grid item xs={6} key={header.key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={columnVisibility[header.key]}
                      onChange={() => handleColumnToggle(header.key)}
                    />
                  }
                  label={header.label}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCustomizationDialog} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </div>
  );
};

export default Reports;
