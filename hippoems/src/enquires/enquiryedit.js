import React, { useEffect, useState } from 'react';
import { Grid, TextField, MenuItem, Select, FormControl, InputLabel, Button, Checkbox,TableCell, TableRow, Table, Paper, TableContainer,TableHead,TableBody, Typography} from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Autocomplete from '@mui/material/Autocomplete';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';

export default function Enquiryedit(){
  const location =useLocation();
  const eid=location.state;
  const usenav= useNavigate();
  const [data,setData]=useState({refernce:"",owner:'',company:'',person:'',gst:'',email:'',number:'',state:'',city:'',subject:"",source:'',sector:'',stage:'',customertype:'',duedate:"",specialnotes:""});
  const [version,setVersion]=useState({user_id:"",refernce:"",owner:'',company:'',person:'',gst:'',email:'',number:'',state:'',city:'',subject:"",source:'',sector:'',stage:'',customertype:'',status:"",reason_for_reject:"",duedate:"",specialnotes:""});
  const [companies,setCompanies]=useState([]);
  const [companyname,setCompanyname]=useState('');
  const [contactPerson,setContacterson]=useState([]);
  const source = ['Cold Call','Received by Email/Call', 'Tender Enquiry', 'Walk-in'];
  const sector = ['Industry', 'Marine and Defence', 'Building & Constructions', 'Water', 'Power'];
  const stage = ['Enquiry Regretted','Budgetary Offer Submitted','Tender Submitted / Offer under Negotiation','PO Received','Order Confirm but PO on hold','Order Lost'];
  const customertype = ['End User', 'EPC Contractor', 'Construction Company', 'Government Department', 'Consultant', 'Others'];
  const [existproducts,setExistproducts]=useState([]);
  const [oldproducts,setOldproducts]=useState([]);
  const [category,setCategory]=useState([]);
  const [products,setProducts]=useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/enquiry/${eid}`).then((res)=>{
      if(res.status===200){
        console.log(res.data)

         setData({refernce:res.data[0].ern,owner:res.data[0].owner,company:res.data[0].company,person:res.data[0].person,gst:res.data[0].gst,email:res.data[0].email,number:res.data[0].number,state:res.data[0].state,city:res.data[0].city,subject:res.data[0].subject,source:res.data[0].source,sector:res.data[0].sector,stage:res.data[0].stage,customertype:res.data[0].customer_type,status:res.data[0].status,reason_for_reject:res.data[0].reason_for_reject,duedate:res.data[0].due_date
          ,specialnotes:res.data[0].special_notes,for:res.data[0].enquiry_for,deliveryperiod:res.data[0].delivery_period,payment_terms: JSON.parse(res.data[0].payment_terms),payment_days: JSON.parse(res.data[0].payment_days)})
         setVersion({user_id:res.data[0].user_id,refernce:res.data[0].ern,owner:res.data[0].owner,company:res.data[0].company,person:res.data[0].person,gst:res.data[0].gst,email:res.data[0].email,number:res.data[0].number,state:res.data[0].state,city:res.data[0].city,subject:res.data[0].subject,source:res.data[0].source,sector:res.data[0].sector,stage:res.data[0].stage,customertype:res.data[0].customer_type,status:res.data[0].status,reason_for_reject:res.data[0].reason_for_reject,duedate:res.data[0].due_date
          ,specialnotes:res.data[0].special_notes})
         setExistproducts(res.data[0].products || []);
         setOldproducts(res.data[0].products || []);
      }
      else {
        Swal.fire({
          title: 'Error',
          text: res.data.message || 'Something went wrong',
          icon: 'error',
        });
      }
    }).catch((err)=>{
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
      });
    })


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
  },[eid]);


  const companyhandler=(e)=>{
    const {name,value}=e.target;
    setData({...data, [name]:value})
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


  const personhandler = (e) => {
    const { name, value } = e.target;  
    setData({ ...data, [name]: value }); // Update the person field in data state
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getcompanydetails/${value}`).then((res) => {
      if (res.status === 200) {
        setData((prevData) => ({
          ...prevData,
          gst: res.data[0].gst,
          email: res.data[0].email,
          number: res.data[0].number,
          state: res.data[0].state,
          city: res.data[0].city,
        }));
      } else {
        Swal.fire({
          icon: 'error',
          title: res.data,
          text: 'Error uploading file. Please try again later.',
        });
      }
    }).catch((err) => {
      Swal.fire({
        title: "Server error",
        text: "Check your internet connection. Please try again later.",
        icon: "question",
      });
    });
  };


  const handlerexistproducts = (event, index, field) => {
    const updatedProducts = [...existproducts]; // Copy the existproducts array
    updatedProducts[index][field] = event.target.value; // Update the specific field
  
    // Update totalprice based on quantity, unitprice, and gst
    updatedProducts[index].totalprice = 
      updatedProducts[index].quantity * 
      updatedProducts[index].unitprice * 
      (1 + updatedProducts[index].pgst / 100);
  
    setExistproducts(updatedProducts); // Update the existproducts state
  };
  

  const productremove=(pid)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You want remove this product from enquiry.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${process.env.REACT_APP_HIPPOEMS}/orders/${pid}`).then((res)=>{
          if(res.status===200){
            Swal.fire({
              title: "Deleted!",
              text: res.data,
              icon: "success"
            });
            window.location.reload();
          }
          else{
            Swal.fire("Changes are not saved" +res.data);
          }
        }).catch((Err)=>{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: Err,
            footer: '<a href="#">Why do I have this issue?</a>'
          });
        })}
    });
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
      pgst: '',
      totalprice: 0,
    };
  });

  setProductDetails(updatedDetails);
};


const handleQuantityChange = (event, index) => {
  const updatedDetails = [...productDetails];
  updatedDetails[index].quantity = event.target.value;
  updatedDetails[index].totalprice = event.target.value * updatedDetails[index].unitprice * (1 + updatedDetails[index].pgst / 100);
  setProductDetails(updatedDetails);
};

const handleUnitPriceChange = (event, index) => {
  const updatedDetails = [...productDetails];
  updatedDetails[index].unitprice = event.target.value;
  updatedDetails[index].totalprice = updatedDetails[index].quantity * event.target.value * (1 + updatedDetails[index].pgst / 100);
  setProductDetails(updatedDetails);
};

const handleGSTChange = (event, index) => {
  const updatedDetails = [...productDetails];
  updatedDetails[index].pgst = event.target.value;
  updatedDetails[index].totalprice = updatedDetails[index].quantity * updatedDetails[index].unitprice * (1 + event.target.value / 100);
  setProductDetails(updatedDetails);
};

const totalQuantity = productDetails.reduce((acc, product) => acc + Number(product.quantity || 0), 0);
const totalOrderValue = productDetails.reduce((acc, product) => acc + Number(product.totalprice || 0), 0);



    

  
  


  const handler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };


  const update=()=>{
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      if (result.isConfirmed) {
      
        axios.post(`${process.env.REACT_APP_HIPPOEMS}/enquiry/${eid}`,data).then((res)=>{
          if(res.status === 200){
            Swal.fire("Changes saved successfully", "", "success");
              
            const existupdateproducts = existproducts.map(item => ({
              product: item.product,
              quantity: item.quantity,
              unitprice: item.unitprice,
              pgst:item.pgst,
              totalprice: item.totalprice,
              id: item.product_id
          }));

          const updateProducts = async () => {
            try {
                for (const product of existupdateproducts) {
                    const response = await axios.put(`${process.env.REACT_APP_HIPPOEMS}/orders/${product.id}`, {
                        product: product.product,
                        quantity: product.quantity,
                        unitprice: product.unitprice,
                        pgst:product.pgst,
                        totalprice: product.totalprice
                    });
        
                    if (response.status !== 200) {
                        console.error(`Error updating product with ID: ${product.id}`);
                    }
                }
                Swal.fire("Products updated successfully!", "", "success");
            } catch (error) {
                console.error("Error updating products:", error);
                Swal.fire("Error updating products!", error.message, "error");
            }
        };
         updateProducts();

         if(productDetails.length > 0){
          const ordersData = productDetails.map(item => ({
            product: item.products,
            quantity: item.quantity,
            unitprice:item.unitprice,
            pgst:item.pgst,
            totalprice:item.totalprice,
            referenceNumber: data.refernce // Make sure to replace 'referenceNumber' with the actual reference number
          }));

          console.log(ordersData)
          
          axios.post(`${process.env.REACT_APP_HIPPOEMS}/orders`, ordersData)
          .then((res) => {
           if(res.status===200){
              
            const versions = {
              vid: eid ? parseFloat(eid) + 0.1 : "",
              uid: version.user_id || "",
              owner: version.owner || "",
              company: version.company || "",
              gst: version.gst || "",
              person: version.person || "",
              email: version.email || "",
              number: version.number || "",
              state: version.state || "",
              city: version.city || "",
              subject: version.subject || "",
              source: version.source || "",
              sector: version.sector || "",
              stage: version.stage || "",
              customertype: version.customertype || "",
              status:version.status || "",
              reason_for_reject: version.reason_for_reject || "",
              duedate: version.duedate || "",
              specialnotes: version.specialnotes || "",
              enquiryreferncenumber: version.refernce || ""
            };

   
             axios.post(`${process.env.REACT_APP_HIPPOEMS}/versions`,versions).then((res)=>{
              if(res.status===200){
                
                 console.log(res.data.newVid)
                var vid = res.data.newVid;
                const oldproducts = existproducts.map(item => ({
                  product: item.product,
                  category:item.category,
                  quantity: item.quantity,
                  unitprice:item.unitprice,
                  pgst:item.pgst,
                  totalprice:item.totalprice,
                  vid:vid,
                  referenceNumber: version.refernce // Make sure to replace 'referenceNumber' with the actual reference number
                }));

               axios.post(`${process.env.REACT_APP_HIPPOEMS}/versionproducts`,oldproducts).then((res)=>{
                if(res.status===200){
                Swal.fire("Saved!", "", "success");
                
                usenav('/enquiry');

                }
                else{
                  Swal.fire({
                    title: "The Internet?",
                    text: res.data,
                    icon: "question"
                  });
                }
               }).catch((err)=>{
                Swal.fire({
                  title: "The Internet?",
                  text: err,
                  icon: "question"
                });
               })


              }
              else{
                Swal.fire({
                  title: "The Internet?",
                  text: res.data,
                  icon: "question"
                });

              }

             }).catch((err)=>{
              Swal.fire({
                title: "The Internet?",
                text: err,
                icon: "question"
              });
             })}  
          })
          .catch((error) => {
            Swal.fire({
              title: "The Internet?",
              text: "Something went wrong",
              icon: "question"
            });
          });} }
          else{
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!"
            });
          }
        }).catch((Err)=>{
          alert('er catch')
        })
 Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  

  


  return (
    <div style={{ padding: '20px' }}>
      <form>
        <Grid container spacing={3}>
          {/* First Row */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Enquiry Owner" variant="outlined" value={data.owner} />
          </Grid>
          <Grid item xs={12} sm={4}>
          <FormControl style={{width:'96%'}} margin="normal" variant="outlined">
              <InputLabel>company</InputLabel>
              <Select
              value={data.company}
                label='Company'
                name='company'
                onChange={companyhandler}
                
              >
              
                {companies.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
          <FormControl style={{width:'96%'}} margin="normal" variant="outlined">
              <InputLabel>Contact Person</InputLabel>
              <Select
                value={data.person}
                label='Person'
                name='person'
                onChange={personhandler}
              >
              
                {contactPerson.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Second Row */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="GST" value={data.gst} variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Contact Number" value={data.number} variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Contact Email" value={data.email} variant="outlined" />
          </Grid>

          {/* Third Row */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="State" value={data.state} variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="City" value={data.city} variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Subject" name='subject' onChange={handler} value={data.subject} variant="outlined" />
          </Grid>

          {/* Fourth Row */}
          <Grid item xs={12} sm={4}>
          <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Source</InputLabel>
              <Select
                value={data.source}
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
                value={data.sector}
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
                value={data.stage}
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

          {/* Fifth Row */}
          <Grid item xs={12} sm={4}>
          <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Customer Type</InputLabel>
              <Select
                value={data.customertype}
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
          {productDetails.length > 0 && (
          <Grid item xs={12} sm={12}>
          <Typography variant='h5' style={{textAlign:'center', color:'#0a9fc7'}}>New Products</Typography>
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
                    value={item.pgst}
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
            </Grid> )}

          <Grid  item xs={12}>

      <Typography variant='h5' style={{textAlign:'center', color:'#0a9fc7'}}>Exist Products</Typography>

      <TableContainer component={Paper}>
        <Table aria-label="exist products table">
          <TableHead style={{ background: '#0a9fc7' }}>
            <TableRow style={{ height: '40px' }}>
              <TableCell style={{ color: 'white', fontWeight: 'bold', padding:4 }}>Sl.No</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold', padding:4 }}>Product</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold', padding:4 }}>Quantity</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold', padding:4 }}>Unit Price</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold', padding:4 }}>Gst</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold', padding:4 }}>Total Price</TableCell>
              <TableCell style={{ color: 'white', fontWeight: 'bold', padding:4 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {existproducts.map((item, index) => (
              <TableRow key={index}style={{ height: '30px' }}>
                <TableCell style={{ padding: 4 }}>{index + 1}</TableCell>
                <TableCell style={{ padding: 4 }}>{item.product}</TableCell>
                <TableCell style={{ padding: 4 }}>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      style: {
                        height: '30px', // Set a specific height
                        padding: '0 8px', // Adjust padding to reduce height
                        fontSize: '12px', // Reduce font size
                        width:'70%'
                      },
                    }}
                    value={item.quantity}
                    onChange={(e) => handlerexistproducts(e, index, 'quantity')}
                    
                  />
                </TableCell>
                <TableCell style={{ padding: 4 }}>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    value={item.unitprice}
                    onChange={(e) => handlerexistproducts(e, index, 'unitprice')}
                    InputProps={{
                      style: {
                        height: '30px', // Set a specific height
                        padding: '0 8px', // Adjust padding to reduce height
                        fontSize: '12px', // Reduce font size
                        width:'70%'
                      },
                    }}
                  />
                </TableCell>
                <TableCell style={{ padding: 4 }}>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    value={item.pgst}
                    onChange={(e) => handlerexistproducts(e, index, 'pgst')}
                    InputProps={{
                      style: {
                        height: '30px', // Set a specific height
                        padding: '0 8px', // Adjust padding to reduce height
                        fontSize: '12px', // Reduce font size
                        width:'70%'
                      },
                    }}
                  />
                </TableCell>
                <TableCell style={{ padding: 4 }}>{item.totalprice}</TableCell>
                <TableCell style={{ padding: 4 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => productremove(item.product_id)}
                    startIcon={<RemoveShoppingCartIcon />}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>

          {/* Sixth Row */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Due Date" name='duedate' onChange={handler} value={data.duedate} variant="outlined" type="month" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Special Notes"
              variant="outlined"
              multiline
              name='specialnotes'
              onChange={handler}
              value={data.specialnotes==='undefined'? '---': data.specialnotes}
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth variant="outlined" type="file" label="Documents" InputLabelProps={{ shrink: true }} />
          </Grid>

          <Button variant="contained" color="primary" style={{ marginTop: '16px' }} onClick={update}>
            Update Enquiry
          </Button>
        </Grid>
      </form>
    </div>
  );
}
