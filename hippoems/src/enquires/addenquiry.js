import React, { useEffect, useState } from 'react';
import { Box, TextField, FormControl,FormLabel,Checkbox,ListItemText, InputLabel, MenuItem, Select, Button, Grid, OutlinedInput, Table, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Autocomplete from '@mui/material/Autocomplete';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';


export default function Addenquiry() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [percentageList, setPercentageList] = useState([]);
  const [daysList, setDaysList] = useState([]);

  const options = [
    "Advance with PO",
    "Proforma Invoice",
    "Against Drawing Approval",
    "After Inspection",
    "Before Dispatch",
    "Against Dispatch Documents",
    "LC",
    "Credit",
  ];

  const percentageOptions = Array.from({ length: 21 }, (_, i) => i * 5);
  const daysOptions = Array.from({ length: 13 }, (_, i) => i * 15);

  const handleOptionChange = (event) => {
    const { value } = event.target;
    setSelectedOptions(typeof value === 'string' ? value.split(',') : value);
    console.log(selectedOptions)
  };

  const handlePercentageChange = (option, value) => {
    const updatedPercentageList = percentageList.filter(item => item.option !== option);
    setPercentageList([...updatedPercentageList, { option, percentage: value }]);
    console.log(percentageList)
  };

  const handleDaysChange = (option, value) => {
    const updatedDaysList = daysList.filter(item => item.option !== option);
    setDaysList([...updatedDaysList, { option, days: value }]);
    console.log(daysList)
  };

  const [companies,setCompanies] = useState([]);
  const [contactPerson,setContacterson]=useState([]);
  const [companydetails,setCompanydetails]=useState({name:'',gst:'',email:'',number:'',state:'',city:''});
  const [category,setCategory]=useState([]);
  const [products,setProducts]=useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const source = ['Cold Call','Received by Email/Call', 'Tender Enquiry', 'Walk-in'];
  const sector = ['Industry', 'Marine and Defence', 'Building & Constructions', 'Water', 'Power'];
  const stage = ['Enquiry Regretted','Budgetary Offer Submitted','Tender Submitted / Offer under Negotiation','PO Received','Order Confirm but PO on hold','Order Lost'];
  const customertype = ['End User', 'EPC Contractor', 'Construction Company', 'Government Department', 'Consultant', 'Others'];
  const enquiryfor=['Our Stores','Ex Works','Nearest Godown Delivery','Your Stores'];
  const deliveryperiod = ['Immediate Subject to Stock Availability', 'Enter Number of Weeks'];
  const gst = ['5%','12%','18%','28%','Custom'];
  const [customGst, setCustomGst] = useState('');
  const [companyname,setCompanyname]=useState('');
  const [file,setFile]=useState(null);

  const [formdata, setFormdata] = useState({
    owner: localStorage.getItem('name'),
    subject: '',
    company: '',
    person: '',
    gst: '',
    number: '',
    email: '',
    state: '',
    city: '',
    source: '',
    sector: '',
    stage: '',
    customertype: '',
    duedate: '',
    specialnotes: '',
    for:'',
    deliveryperiod:'',
    numberOfWeeks: '',
    customergst:'',
    validity:'',
    note:"",
  });

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/companynames`).then((res)=>{
      if(res.status===200){
        setCompanies(res.data)
      }
      else{
        Swal.fire({
          icon: 'error',
          title: res.data,
          text: 'Error uploading file. Please try again later.'
        });
      }
    }).catch((err)=>{
      Swal.fire({
        title: "Server error",
        text: "Check you internet connection. Please try again later.",
        icon: "question"
      });
    });


    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getcategory`).then((res)=>{
      if(res.status===200){
        setCategory(res.data)
      }
      else{
        Swal.fire({
          icon: 'error',
          title: res.data,
          text: 'Error uploading file. Please try again later.'
        });
      }
    }).catch((Err)=>{
      Swal.fire({
        title: "Server error",
        text: "Check you internet connection. Please try again later.",
        icon: "question"
      });
    })
  },[])

  const handler = (e) => {
    const { name, value } = e.target;
    if (value === 'Custom') {
      setFormdata({ ...formdata, [name]: customGst });
    } else {
      setFormdata({ ...formdata, [name]: value });
      setCustomGst('');
    }
  };

  const companyhandler=(e)=>{
    const {name,value}=e.target;
    setFormdata({...formdata, [name]:value})
    setCompanyname(value);
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getcontactperson/${value}`).then((res)=>{
      if(res.status===200){
        setContacterson(res.data);
        
      }
      else{
        Swal.fire({
          icon: 'error',
          title: res.data,
          text: 'Error uploading file. Please try again later.'
        });
      }
    }).catch((err)=>{
      Swal.fire({
        title: "Server error",
        text: "Check you internet connection. Please try again later.",
        icon: "question"
      });
    })
  };

  const personhandler=(e)=>{
    const {name,value}=e.target;
    setFormdata({...formdata, [name]:value})
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getcompanydetails/${value}`).then((res)=>{
      if(res.status===200){
        setCompanydetails({gst:res.data[0].gst,email:res.data[0].email,number:res.data[0].number,state:res.data[0].state,city:res.data[0].city})
        setFormdata({person:value,gst:res.data[0].gst,email:res.data[0].email,number:res.data[0].email,state:res.data[0].state,city:res.data[0].city})
      }
      else{
        Swal.fire({
          icon: 'error',
          title: res.data,
          text: 'Error uploading file. Please try again later.'
        });
      }
    }).catch((err)=>{
      Swal.fire({
        title: "Server error",
        text: "Check you internet connection. Please try again later.",
        icon: "question"
      });
    })
  }

  const handleCustomGstChange = (e) => {
    const value = e.target.value;
    setCustomGst(value);
    setFormdata({ ...formdata, customergst: value });
  };

  const handlerproductcategory = (e) => {
    const selectcategory = e.target.value;

    axios.get(`${process.env.REACT_APP_HIPPOEMS}/productsbycategory/${selectcategory}`)
      .then((res) => {
        if(res.status===200){
        setProducts(res.data); // Set the products state with the received data
        }
        else{
          Swal.fire({
            icon: 'error',
            title: res.data,
            text: 'Error uploading file. Please try again later.'
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Server error",
          text: "Check you internet connection. Please try again later.",
          icon: "question"
        });
      });
};


const handleProductSelect = (event, value) => {
  setSelectedProducts(value);

  const updatedDetails = value.map(product => {
    const existingProduct = productDetails.find(detail => detail.products === product.value);
    return existingProduct ? existingProduct : {
      products: product.value,
      label: product.label,
      quantity: '',
      unitprice: '',
      gst: '',
      totalprice: 0,
    };
  });

  setProductDetails(updatedDetails);
};

const handleQuantityChange = (event, index) => {
  const updatedDetails = [...productDetails];
  updatedDetails[index].quantity = event.target.value;
  updatedDetails[index].totalprice = event.target.value * updatedDetails[index].unitprice * (1 + updatedDetails[index].gst / 100);
  setProductDetails(updatedDetails);
};

const handleUnitPriceChange = (event, index) => {
  const updatedDetails = [...productDetails];
  updatedDetails[index].unitprice = event.target.value;
  updatedDetails[index].totalprice = updatedDetails[index].quantity * event.target.value * (1 + updatedDetails[index].gst / 100);
  setProductDetails(updatedDetails);
};

const handleGSTChange = (event, index) => {
  const updatedDetails = [...productDetails];
  updatedDetails[index].gst = event.target.value;
  updatedDetails[index].totalprice = updatedDetails[index].quantity * updatedDetails[index].unitprice * (1 + event.target.value / 100);
  setProductDetails(updatedDetails);
};

const totalQuantity = productDetails.reduce((acc, product) => acc + Number(product.quantity || 0), 0);
const totalOrderValue = productDetails.reduce((acc, product) => acc + Number(product.totalprice || 0), 0);

const documenthandler=(e)=>{
  setFile(e.target.files[0]);
}


  const handleSubmit = (event) => {
    event.preventDefault();
    const d= new Date();
    const date = d.toISOString().split('T')[0];
     var ft= 'FT'+Math.floor(100000+Math.random()*1000000);
    const details={
      user_id:localStorage.getItem('id'),
      owner:localStorage.getItem('name'),
      ern:ft,
      subject:formdata.subject==="" || undefined ? '---' :formdata.subject,
      company:companyname,
      person:formdata.person,
      gst:formdata.gst,
      number:formdata.number,
      email:formdata.email,
      state:formdata.state,
      city:formdata.city,
      source:formdata.source,
      sector:formdata.sector,
      stage:formdata.stage,
      customertype:formdata.customertype,
      duedate:formdata.duedate,
      specialnotes:formdata.specialnotes==="" || undefined ? '---' :formdata.specialnotes,
      for:formdata.for ==="" || undefined ? '---' :formdata.for,
      deliveryperiod:formdata.deliveryperiod==="" || undefined ? '---' :formdata.deliveryperiod,
      numberOfWeeks:formdata.numberOfWeeks==="" || undefined ? '---' :formdata.numberOfWeeks,
      customGst:formdata.customergst ==="" || undefined ? '---' :formdata.customergst,
      validity:formdata.validity==="" || undefined ? '---' :formdata.validity,
      note:formdata.note==="" || undefined ? '---' :formdata.note,
      paymennterms:JSON.stringify(percentageList)==="" ? '---' :JSON.stringify(percentageList),
      paymentdays:JSON.stringify(daysList)==="" ? '---' :JSON.stringify(daysList),
      createdon:date
      }

      const formData = new FormData();
             formData.append('user_id', details.user_id);
             formData.append('owner', details.owner);
             formData.append('ern',details.ern);
             formData.append('subject', details.subject);
             formData.append('company',details.company);
             formData.append('person',details.person);
             formData.append('gst',details.gst);
             formData.append('number',details.number);
             formData.append('email',details.email);
             formData.append('state',details.state);
             formData.append('city',details.city);
             formData.append('source',details.source);
             formData.append('sector',details.sector);
             formData.append('stage',details.stage);
             formData.append('customertype',details.customertype);
             formData.append('status','pending');
             formData.append('duedate',details.duedate);
             formData.append('specialnotes',details.specialnotes);
             formData.append('enquiryfor',details.for);
             formData.append('deliveryperiod',details.deliveryperiod);
             formData.append('numberOfWeeks',details.numberOfWeeks);
             formData.append('customGst',details.customGst);
             formData.append('validity',details.validity);
             formData.append('note',details.note);
             formData.append('paymennterms',details.paymennterms);
             formData.append('paymentdays',details.paymentdays);
             formData.append('createdon',details.createdon);
             formData.append('file', file);
             

       axios.post(`${process.env.REACT_APP_HIPPOEMS}/enquiry`,formData).then((res)=>{
          if(res.status===200){

            const ordersData = productDetails.map(item => ({
              product: item.products,
              quantity: item.quantity,
              unitprice:item.unitprice,
              pgst:item.gst,
              totalprice:item.totalprice,
              referenceNumber: ft // Make sure to replace 'referenceNumber' with the actual reference number
            }));

            axios.post(`${process.env.REACT_APP_HIPPOEMS}/orders`, ordersData)
            .then((res) => {
              if(res.status===200){
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Enquiry Created Successfully....",
                  showConfirmButton: false,
                  timer: 1500
                });
              }
              else{
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: res.data,
                });
              }
            })
            .catch((error) => {
              Swal.fire({
                title: "The Internet?",
                text: "Check your internet connection and try again!",
                icon: "question"
              });
            });

          }
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
       });

       console.log(details)
    

  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 5 }}>
      <h1 style={{color:'#0a9fc7'}}>Add Enquiry</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} style={{ boxShadow: '5px 5px 15px 1px lightgrey', background:'white' }}
        >
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Enquiry Owner"
              name='owner'
              value={localStorage.getItem('name')}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl style={{width:'96%'}} margin="normal" variant="outlined">
              <InputLabel>Company</InputLabel>
              <Select
                value={companyname}
                label="Company"
                name='company'
                onChange={companyhandler}
              >
                {companies.map((company, index) => (
                  <MenuItem key={index} value={company}>
                    {company}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Contact Person</InputLabel>
              <Select
                value={formdata.person}
                label="Contact Person"
                name='person'
                onChange={personhandler}
              >
                {contactPerson.map((person, index) => (
                  <MenuItem key={index} value={person}>
                    {person}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="GST"
              name='gst'
              value={companydetails.gst}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              style={{width:'96%'}}
              label="Contact Number"
              name='number'
              value={companydetails.number}
              margin="normal"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Contact Email"
              name='email'
              value={companydetails.email}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              name='state'
              value={companydetails.state}
              margin="normal"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              style={{width:'96%'}}
              label="City"
              name='city'
              value={companydetails.city}
              margin="normal"
              variant="outlined"
            />
          </Grid>

           <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formdata.subject}
              onChange={handler}
              margin="normal"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Source</InputLabel>
              <Select
                value={formdata.source}
                label="Source"
                name="source"
                onChange={handler}
              >
                {source.map((source, index) => (
                  <MenuItem key={index} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Sector</InputLabel>
              <Select
                value={formdata.sector}
                label="Sector"
                name='sector'
                onChange={handler}
              >
                {sector.map((sector, index) => (
                  <MenuItem key={index} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl style={{width:'96%'}} margin="normal" variant="outlined">
              <InputLabel>Stage</InputLabel>
              <Select
                value={formdata.stage}
                label="Stage"
                name='stage'
                onChange={handler}
              >
                {stage.map((stage, index) => (
                  <MenuItem key={index} value={stage}>
                    {stage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Customer Type</InputLabel>
              <Select
                value={formdata.customertype}
                label="Customer Type"
                name='customertype'
                onChange={handler}
              >
                {customertype.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                label="Customer Type"
                name='customertype'
                onChange={handlerproductcategory}
              >
                {category.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
        <FormControl style={{ width: '96%' }} margin="normal" variant="outlined">
          <Autocomplete
            multiple
            options={products}
            disableCloseOnSelect
            getOptionLabel={(product) => product.label}
            renderOption={(props, product, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlank />}
                  checkedIcon={<CheckBox />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {product.label}
              </li>
            )}
            value={selectedProducts}
            onChange={handleProductSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Search..."
              />
            )}
          />
        </FormControl>
      </Grid>

          <Grid item xs={12} sm={12}>
        <Table>
          <TableHead style={{ background: '#0a9fc7' }}>
            <TableRow style={{ height: '40px' }}>
              <TableCell style={{ color: 'white', fontWeight: 'bold', padding:4 }}>Sl.no</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold',padding:4 }}>Product name</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold',padding:4 }}>Quantity</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold',padding:4 }}>Unit Price</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold',padding:4 }}>GST%</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold',padding:4 }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productDetails.map((item, index) => (
              <TableRow key={index} style={{ height: '30px' }}>
                <TableCell style={{padding:4}}>{index + 1}</TableCell>
                <TableCell style={{padding:4}}>{item.products}</TableCell>
                <TableCell style={{padding:4}}>
                  <TextField
                    type='number'
                    InputProps={{
                      style: {
                        height: '30px', // Set a specific height
                        padding: '0 8px', // Adjust padding to reduce height
                        fontSize: '12px', // Reduce font size
                        width:'70%'
                      },
                    }}
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(event, index)}
                    placeholder="Enter Quantity"
                  />
                </TableCell>
                <TableCell style={{padding:4}}>
                  <TextField
                  type='number'
                  InputProps={{
                    style: {
                      height: '30px', // Set a specific height
                      padding: '0 8px', // Adjust padding to reduce height
                      fontSize: '12px', // Reduce font size
                      width:'70%'
                    },
                  }}
                    value={item.unitprice}
                    placeholder="Unit price"
                    onChange={(event) => handleUnitPriceChange(event, index)}
                  />
                </TableCell>
                <TableCell style={{padding:4}}>
                  <TextField
                  type='number'
                  InputProps={{
                    style: {
                      height: '30px', // Set a specific height
                      padding: '0 8px', // Adjust padding to reduce height
                      fontSize: '12px', // Reduce font size
                      width:'70%'
                    },
                  }}
                    value={item.gst}
                    placeholder="GST"
                    onChange={(event) => handleGSTChange(event, index)}
                  />
                </TableCell>
                <TableCell style={{padding:4}}>{item.totalprice.toFixed(2)}</TableCell>
              </TableRow>
            ))}
             {productDetails.length > 0 && (
              <TableRow style={{height: '30px', backgroundColor: '#f0f0f0'}}>
                <TableCell colSpan={2} style={{padding:4, textAlign:'right'}}>Total</TableCell>
                <TableCell style={{padding:4}}>{totalQuantity}</TableCell>
                <TableCell style={{padding:4}}>---</TableCell>
                <TableCell style={{padding:4}}>---</TableCell>
                <TableCell style={{padding:4}}>{totalOrderValue}</TableCell>
              </TableRow>
             )}
          </TableBody>
        </Table>
            </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              name='duedate'
              type='month'
              value={formdata.duedate}
              onChange={handler}
              margin="normal"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel>If any Technical documents upload here</InputLabel>
            <Button variant="contained" component="label">
              Upload Document
              <input
                type="file"
                hidden
                onChange={documenthandler}
              />
            </Button>
            {formdata.documents && (
              <Box sx={{ mt: 1 }}>
                <span>Uploaded Document: {formdata.documents.name}</span>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              style={{width:'96%'}}
              label="Special Notes"
              name='specialnotes'
              value={formdata.specialnotes}
              onChange={handler}
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid>
         
         

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{textDecoration:'underline blue'}}>Terms and Conditions</FormLabel>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
                 <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>For</InputLabel>
              <Select
                value={formdata.for}
                label="For"
                name='for'
                onChange={handler}
              >
                {enquiryfor.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
                 </Grid>

                 <Grid item xs={12} sm={4}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Delivery Period</InputLabel>
              <Select
                value={formdata.deliveryperiod}
                label="Delivery Period"
                name="deliveryperiod"
                onChange={handler}
              >
                {deliveryperiod.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formdata.deliveryperiod === 'Enter Number of Weeks' && (
            <Grid item xs={12} sm={4}>
              <TextField
                style={{width:'96%'}}
                label="Number of Weeks"
                name="numberOfWeeks"
                type="number"
                value={formdata.numberOfWeeks}
                onChange={handler}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          )}

<Grid item xs={12} sm={4}>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Payment Terms</InputLabel>
          <Select
            multiple
            value={selectedOptions}
            onChange={handleOptionChange}
            input={<OutlinedInput label="Select Payment Terms" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={selectedOptions.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {selectedOptions.map((option) => (
        <Grid item xs={12} sm={4} key={option}>
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>{`Percentage for ${option}`}</InputLabel>
              <Select
                value={percentageList.find(item => item.option === option)?.percentage || ''}
                onChange={(e) => handlePercentageChange(option, e.target.value)}
              >
                {percentageOptions.map((percent) => (
                  <MenuItem key={percent} value={percent}>
                    {percent}%
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(option === 'LC' || option === 'Credit') && 
              percentageList.find(item => item.option === option)?.percentage > 0 && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>{`Days for ${option}`}</InputLabel>
                <Select
                  value={daysList.find(item => item.option === option)?.days || ''}
                  onChange={(e) => handleDaysChange(option, e.target.value)}
                >
                  {daysOptions.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day} days
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Grid>
      ))}

<Grid item xs={12} sm={4}>
      <FormControl style={{ width: '98%' }} margin="normal" variant="outlined">
        <InputLabel>Gst</InputLabel>
        <Select
          value={formdata.customergst}
          label="GST"
          name="customergst"
          onChange={handler}
        >
          {gst.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {formdata.customergst === "Custom" && (
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Custom GST"
            name="customergst"
            value={customGst}
            onChange={handleCustomGstChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
      )}
    </Grid>
    <Grid item xs={12} sm={4}>
    <TextField
            fullWidth
            label="Validity"
            name="validity"
            onChange={handler}
            margin="normal"
            variant="outlined"
          />
    </Grid>

    <Grid item xs={12} sm={4}>
    <TextField
            style={{width:'96%'}}
            label="Note"
            name="note"
            onChange={handler}
            margin="normal"
            variant="outlined"
          />
    </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
