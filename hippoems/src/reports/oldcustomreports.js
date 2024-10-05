import { Table , TableBody, TableCell, Card,CardContent, Select,InputLabel,FormControl, Typography,Button,MenuItem, useTheme,TableContainer, useMediaQuery, Collapse,Box, Paper, IconButton, TableHead, TableRow, Grid, TextField} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { CloudDownload as CloudDownloadIcon } from '@mui/icons-material';

export default function Customreports() {
  const location = useLocation();
  const id = location.state;
  const uid=localStorage.getItem('id');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [owners,setOwners]=useState([]);
  const [customers,setCustomers]=useState([]);
  const [states,setStates]= useState(['AndhraPradesh','ArunachalPradesh','Telangana','Assam','Bihar']);

  const [data, setData] = useState({ name: "", description: "", date:"" });
  const [columns, setColumns] = useState({});  // Changed to object
  const [enquiry,setEnquiry]=useState([]);
  const [filteredenquiry,setFilteredenquiry]=useState([]);
  const [filters,setFilters]= useState({
    owner:"",
    created_on:"",
    company:"",
    state:"",
  })
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/enquiry`).then((res)=>{
      if(res.status===200){
        console.log(res.data);
        const uniqueOwners = [...new Set(res.data.map(item => item.owner))];
        const uniquecustomers = [...new Set(res.data.map(item => item.company))]
        setOwners(uniqueOwners);
        setCustomers(uniquecustomers);
      }
      else{
        Swal.fire({
          title: 'Error',
          text: res.data.message || 'Something went wrong',
          icon: 'error',
        });
      }
    }).catch((Err)=>{
      Swal.fire({
        title: 'Error',
        text: Err.message || 'Failed to fetch report data',
        icon: 'error',
      });
    })



    axios.get(`${process.env.REACT_APP_HIPPOEMS}/myreports/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setData({
            name: res.data[0].reportname,
            description: res.data[0].description,
            date: res.data[0].date
          });

          // Parse the array from the backend and convert to an object
          const parsedColumns = JSON.parse(res.data[0].columns);

          const columnsObject = parsedColumns.reduce((acc, column) => {
            acc[column] = column;  // Key and value both are column name
          
            return acc;
          }, {});

          setColumns(columnsObject);
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
          text: err.message || 'Failed to fetch report data',
          icon: 'error',
        });
      });



      axios.get(`${process.env.REACT_APP_HIPPOEMS}/userenquires/${uid}`)
      .then((res) => {
        console.log(res.data)
        if (res.status === 200) {
          const updatedData = res.data.map((row) => ({
            ...row,
            payment_terms: JSON.parse(row.payment_terms),
            payment_days: JSON.parse(row.payment_days),
          }));
          setEnquiry(updatedData);
          setFilteredenquiry(updatedData);
         
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
     
  }, [id,uid]);

  const handleExpandClick = (rowId) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const handlefilterchange=(e)=>{
    const {name,value}=e.target
    setFilters({...filters, [name]:value});
    let filtered = enquiry;

    


    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] && filterKey === 'product') {
        filtered = filtered.filter(row =>
          row.products.some(prod => prod.product.toLowerCase().includes(filters[filterKey].toLowerCase()))
        );
      }
    });

  setFilteredenquiry(filtered);
  }

 
  const applyfilter = () => {
    let filtered = enquiry;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentQuarterStartMonth = Math.floor(currentMonth / 3) * 3;


    const today = new Date();
    const parseDate = (date) => new Date(date); // Helper to parse date strings

    if (filters.date_filter_type === 'between') {
      // Between Dates Filter
      if (filters.start_date && filters.end_date) {
        filtered = filtered.filter(row => {
          const rowDate = parseDate(row.created_on);
          return rowDate >= parseDate(filters.start_date) && rowDate <= parseDate(filters.end_date);
        });
      }
    } else if (filters.date_filter_type === 'last_fy') {
      // Last Financial Year Filter (Assuming FY starts in April)
      const startLastFY = new Date(currentYear - 1, 3, 1);
      const endLastFY = new Date(currentYear, 2, 31);
      filtered = filtered.filter(row => {
        const rowDate = parseDate(row.created_on);
        return rowDate >= startLastFY && rowDate <= endLastFY;
      });
    } else if (filters.date_filter_type === 'current_fy') {
      // Current Financial Year Filter
      const startCurrentFY = new Date(currentYear, 3, 1);
      const today = new Date();
      filtered = filtered.filter(row => {
        const rowDate = parseDate(row.created_on);
        return rowDate >= startCurrentFY && rowDate <= today;
      });
    } else if (filters.date_filter_type === 'last_month') {
      // Last Month Filter
      const startLastMonth = new Date(currentYear, currentMonth - 1, 1);
      const endLastMonth = new Date(currentYear, currentMonth, 0); // Last day of previous month
      filtered = filtered.filter(row => {
        const rowDate = parseDate(row.created_on);
        return rowDate >= startLastMonth && rowDate <= endLastMonth;
      });
    } else if (filters.date_filter_type === 'current_quarter') {
      // Current Quarter Filter
      const startCurrentQuarter = new Date(currentYear, currentQuarterStartMonth, 1);
      const endCurrentQuarter = new Date(currentYear, currentQuarterStartMonth + 3, 0); // Last day of the current quarter
      filtered = filtered.filter(row => {
        const rowDate = parseDate(row.created_on);
        return rowDate >= startCurrentQuarter && rowDate <= endCurrentQuarter;
      });
    } else if (filters.date_filter_type === 'last_quarter') {
      // Last Quarter Filter
      const startLastQuarter = new Date(currentYear, currentQuarterStartMonth - 3, 1);
      const endLastQuarter = new Date(currentYear, currentQuarterStartMonth, 0); // Last day of last quarter
      filtered = filtered.filter(row => {
        const rowDate = parseDate(row.created_on);
        return rowDate >= startLastQuarter && rowDate <= endLastQuarter;
      });
    } else if (filters.date_filter_type === 'this_month') {
      // This Month Filter
      const startThisMonth = new Date(currentYear, currentMonth, 1);
      const today = new Date();
      filtered = filtered.filter(row => {
        const rowDate = parseDate(row.created_on);
        return rowDate >= startThisMonth && rowDate <= today;
      });
    }
    else if (filters.date_filter_type === '10_days') {
      // Last 10 Days Filter
      const startLast10Days = new Date();
      startLast10Days.setDate(today.getDate() - 10);
      filtered = filtered.filter(row => {
        const rowDate = parseDate(row.created_on);
        return rowDate >= startLast10Days && rowDate <= today;
      });
    }


  
    // Check if the 'owner' filter is applied
    if (filters.owner) {
      filtered = filtered.filter((row) => row.owner === filters.owner);
    }
    
    if (filters.company) {
      filtered = filtered.filter((row) => row.company === filters.company);
    }
    if (filters.state) {
      filtered = filtered.filter((row) => row.state === filters.state);
    }

    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] && filterKey === 'product') {
        filtered = filtered.filter(row =>
          row.products.some(prod => prod.product.toLowerCase().includes(filters[filterKey].toLowerCase()))
        );
      }
    });
    
  
    setFilteredenquiry(filtered);
  };



  const savefilter=()=>{
     console.log(filters)
  }
  

  return (
    <div>
      <Box sx={{ minWidth: 275, mb: 2 }}>
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" component="div" gutterBottom style={{fontFamily:'Franklin Gothic Medium Cond',marginLeft:'20px'}}>
          Report name: <strong>{data.name} </strong>  
          </Typography>
      </Card>
    </Box>

    <Grid xs={12} sx={{display:'flex',mt:1,mb:2,justifyContent:'space-between'}}>
    <Grid xs={2}>
  <TextField
    select
    name="date_filter_type"
    label="Date Wise Filter"
    value={filters.date_filter_type}
    onChange={handlefilterchange}
    style={{ width: '200px' }}
  >
    <MenuItem value="between">Between Dates</MenuItem>
    <MenuItem value="10_days">Last 10 Days</MenuItem>
    <MenuItem value="last_fy">Last Financial Year</MenuItem>
    <MenuItem value="current_fy">Current Financial Year</MenuItem>
    <MenuItem value="last_month">Last Month</MenuItem>
    <MenuItem value="current_quarter">Current Quarter</MenuItem>
    <MenuItem value="last_quarter">Last Quarter</MenuItem>
    <MenuItem value="this_month">This Month</MenuItem>
  </TextField>

  {/* If "Between Dates" is selected, show the start and end date pickers */}
  {filters.date_filter_type === 'between' && (
    <>
      <TextField
        name="start_date"
        label="Start Date"
        type="date"
        value={filters.start_date}
        onChange={handlefilterchange}
        style={{ width: '200px' }}
      />
      <TextField
        name="end_date"
        label="End Date"
        type="date"
        value={filters.end_date}
        onChange={handlefilterchange}
        style={{ width: '200px' }}
      />
    </>
  )}
</Grid>


      <Grid item xs={2}>
  <FormControl fullWidth>    <TextField
      labelId="category-product-filter-label"
      name="product"
      value={filters.product || ""}
      label="Category/Product Filter"
      onChange={handlefilterchange}
      style={{ width: '200px' }}
    />
      {/* {products.map((product) => (
        <MenuItem key={product} value={product}>
          {product}
        </MenuItem>
      ))}
    </Select> */}
  </FormControl>
</Grid>


      <Grid item xs={2}>
         <FormControl fullWidth>
      <InputLabel id="owner-select-label">Customer Wise Filter</InputLabel>
      <Select
        labelId="owner-select-label"
        name="company"
        value={filters.company}
        label="Owner"
        onChange={handlefilterchange}
        style={{width:'200px'}}
      >
        {customers.map((item)=>(
          <MenuItem value={item}>{item}</MenuItem>
        ))}
       
      </Select>
    </FormControl>
      </Grid>


      <Grid item xs={2}>
      <FormControl fullWidth>
      <InputLabel id="owner-select-label">Enquiry Owner</InputLabel>
      <Select
        labelId="owner-select-label"
        name="owner"
        value={filters.owner}
        label="Owner"
        onChange={handlefilterchange}
        style={{width:'200px'}}
      >
        {owners.map((item)=>(
          <MenuItem value={item}>{item}</MenuItem>
        ))}
       
      </Select>
    </FormControl>
      </Grid>

      <Grid item xs={2}>
      <FormControl fullWidth>
      <InputLabel id="owner-select-label">Location of Customer</InputLabel>
      <Select
        name="state"
        value={filters.state}
        label="State"
        onChange={handlefilterchange}
        style={{width:'200px'}}
      >
        {states.map((item)=>(
          <MenuItem value={item}>{item}</MenuItem>
        ))}
       
      </Select>
    </FormControl>
      </Grid>

      <Grid xs={2}>
        <Button onClick={applyfilter} variant='contained'>Apply Filter</Button><br/>
        <Button onClick={savefilter} sx={{mt:1}} variant='contained' color='success'>Save Filter</Button>
      </Grid>
    </Grid>
      

      {/* Display the report columns as object */}
      {Object.keys(columns).length > 0 ? (
        <Table>
            <TableHead>
                <TableRow sx={{backgroundColor:'#0a9fc7',height:1}}>
                    <TableCell style={{fontWeight:'bold',color:'white'}}>Sl.no</TableCell>
                    <TableCell style={{fontWeight:'bold',color:'white'}}>Refernce.no</TableCell>
                    {columns.owner && <TableCell style={{fontWeight:'bold',color:'white'}}>owner</TableCell>}
                    {columns.subject &&<TableCell style={{fontWeight:'bold',color:'white'}}>Subject</TableCell>}
                    {columns.company &&<TableCell style={{fontWeight:'bold',color:'white'}}>Company</TableCell>}
                    {columns.gst &&<TableCell style={{fontWeight:'bold',color:'white'}}>Gst</TableCell>}
                    {columns.person &&<TableCell style={{fontWeight:'bold',color:'white'}}>Person</TableCell>}
                    {columns.number && <TableCell style={{fontWeight:'bold',color:'white'}}>Phone</TableCell>}
                    {columns.email && <TableCell style={{fontWeight:'bold',color:'white'}}>Email</TableCell>}
                    {columns.state && <TableCell style={{fontWeight:'bold',color:'white'}}>State</TableCell>}
                    {columns.city &&<TableCell style={{fontWeight:'bold',color:'white'}}>City</TableCell>}
                    {columns.source && <TableCell style={{fontWeight:'bold',color:'white'}}>Source</TableCell>}
                    {columns.sector && <TableCell style={{fontWeight:'bold',color:'white'}}>Sector</TableCell>}
                    {columns.satge && <TableCell style={{fontWeight:'bold',color:'white'}}>Stage</TableCell>}
                    {columns.status && <TableCell style={{fontWeight:'bold',color:'white'}}>Status</TableCell>}
                    <TableCell style={{fontWeight:'bold',color:'white'}}>Products</TableCell>
                    {columns.customertype && <TableCell style={{fontWeight:'bold',color:'white'}}>Type</TableCell>}
                    {columns.due_date && <TableCell style={{fontWeight:'bold',color:'white'}}>Due Date</TableCell>}
                    {columns.documents && <TableCell style={{fontWeight:'bold',color:'white'}}>Documents</TableCell>}
                    {columns.spnotes && <TableCell style={{fontWeight:'bold',color:'white'}}> Note</TableCell>}
                    {columns.payment_terms && <TableCell style={{fontWeight:'bold',color:'white'}}>Terms</TableCell>}
                    {columns.created_on && <TableCell style={{fontWeight:'bold',color:'white'}}>Created on</TableCell>}
                </TableRow>
            </TableHead>
            <TableBody>
              {filteredenquiry.map((item,index)=><>
              <TableRow>
                <TableCell>{index+1}</TableCell>
                <TableCell>{item.ern}</TableCell>
                {columns.owner &&<TableCell>{item.owner}</TableCell>}
                {columns.subject &&<TableCell>{item.subject}</TableCell>}
                {columns.company &&<TableCell>{item.company}</TableCell>}
                {columns.gst &&<TableCell>{item.gst}</TableCell>}
                {columns.person &&<TableCell>{item.person}</TableCell>}
                {columns.number && <TableCell>{item.number}</TableCell>}
                {columns.email && <TableCell>{item.email}</TableCell>}
                {columns.state && <TableCell>{item.state}</TableCell>}
                {columns.city &&<TableCell>{item.city}</TableCell>}
                {columns.source && <TableCell>{item.source}</TableCell>}
                {columns.sector && <TableCell>{item.sector}</TableCell>}
                {columns.satge && <TableCell>{item.stage}</TableCell>}
                {columns.status && <TableCell>{item.status}</TableCell>}
                <TableCell>
                      <IconButton onClick={() => handleExpandClick(item.id)}>
                        {expandedRows[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                {columns.customertype && <TableCell>{item.customer_type}</TableCell>}
                {columns.due_date && <TableCell>{item.due_date}</TableCell>}
                {columns.documents && <TableCell>
                  {item.documents !=="default_document.pdf" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{height:'45px',width:'140px'}}
                      startIcon={<CloudDownloadIcon />}
                      onClick={() => window.open(`${process.env.REACT_APP_HIPPOEMS}/enquirydocuments2/${item.documents}`, '_blank')}
                    >
                      Download Document
                    </Button>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No document available
                    </Typography>
                  )}
                  </TableCell>}
                {columns.spnotes && <TableCell>{item.special_notes==="undefined" ? '---' : item.special_notes}</TableCell>}
                <TableCell>
                <IconButton onClick={() => handleExpandClick(item.id + 'payment')}>
                        {expandedRows[item.id + 'payment'] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    {columns.created_on && <TableCell>{item.created_on}</TableCell>}
              </TableRow>
              <TableRow>
                    <TableCell colSpan={21} sx={{ padding: 0 }}>
                      <Collapse in={expandedRows[item.id]}>
                        <Box sx={{ padding: 1, maxWidth: isMobile ? '65%' : '50%', marginX: 'auto', marginLeft: isMobile ? '0' : '40%' }}>
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
                                {item.products.map((product, index) => (
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
                      <Collapse in={expandedRows[item.id + 'payment']}>
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
                                    <TableCell>{item.enquiry_for}</TableCell>
                                    <TableCell>{item.delivery_period === "Enter Number of Weeks" ? `${item.no_of_weeks} Weeks`  : item.delivery_period}</TableCell>
                           
                                    <TableCell style={{padding:5}}>{item.customgst==='undefined' ? '---':item.customgst}</TableCell>
                                    <TableCell style={{padding:5}}>{item.payment_terms  ? JSON.parse(item.payment_terms).map((term, index) => (
                                      <div key={index}>
                                               <ul>
                                                 <li>{term.option} {term.percentage}%</li>
                                                     </ul>
                                                 </div>
                                                ))
                                          : 'No payment terms available'}
                                              </TableCell>

                                        <TableCell style={{padding:5}}> {item.payment_days
                                                    ? JSON.parse(item.payment_days).map((term, index) => (
                                                   <div key={index}>
                                                      <ul>
                                                     <li>{term.option}: {term.days}Days</li>
                                                           </ul>
                                                      </div>
                                                            ))
                                                  : '---'}</TableCell>
                                                  <TableCell style={{padding:5}}>{item.validity==='undefined' ? '----':item.validity}</TableCell>
                                                  <TableCell style={{padding:5}}>{item.note==="undefined" ? '----' : item.note}</TableCell>
                                  </TableRow>
                              
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
              </>)}
            </TableBody>
        </Table>
      ) : (
        <p>No columns to display</p>
      )}
    </div>
  );
}
