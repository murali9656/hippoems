import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Coverpage() {
    const location = useLocation();
    const eid= location.state;
    const [data,setData]=useState([]);

    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_HIPPOEMS}/enquiry/${eid}`)
          .then((res) => {
            console.log(res.data);
            if (res.status === 200 && res.data.length > 0) {
              setData({
                refernce: res.data[0].ern,
                company: res.data[0].company,
                person: res.data[0].person,
                gst: res.data[0].gst,
                email: res.data[0].email,
                number: res.data[0].number,
                subject: res.data[0].subject,
                duedate: res.data[0].due_date,
                for: res.data[0].enquiry_for,
                dp: res.data[0].delivery_period,
                nweeks: res.data[0].no_of_weeks,
                payment_terms: res.data[0].payment_terms ? JSON.parse(res.data[0].payment_terms) : [],
                payment_days: res.data[0].payment_days ? JSON.parse(res.data[0].payment_days) : [],
                pgst:res.data[0].customgst,
                validity: res.data[0].validity,
                note: res.data[0].note
              });
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
              text: err.message || 'Something went wrong',
              icon: 'error',
            });
          });
      }, [eid]);
      

  const print = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        width: '80%',
        margin: '0 auto',
        padding: '16px',
        '@media print': {
          width: '100%',
          '#printc': {
            display: 'none',
          },
          '#head': {
            marginTop:'-100px'
          },
          '.printtext':{
            fontSize:'9.5px'
          }
        },
      }}
    >
      <Grid container id="head"  spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
            FLOWTECH FLUID SYSTEMS (P) LTD
          </Typography>
          <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
            <strong>Office:</strong> 55-14-75, APSEB Colony, Seethammadhara, Visakhapatnam 530013
          </Typography>
          <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
            <strong>Tel:</strong> 0891 2543704, 2531535
          </Typography>
          <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
            <strong>Email:</strong> contact@flowtechfluid.in | <strong>www:</strong> www.flowtechfluid.in
          </Typography>
          <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
            <strong>CIN:</strong> U31401AP2013PTC089360 | <strong>GSTIN:</strong> 37AACCF2395J1ZD
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <img src="flowtech.png" alt="Flowtech" height="50px" width="200px" style={{ marginTop: '20px',marginRight:'70px' }} />
        </Grid>
      </Grid><hr/>

      <Box sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
        <Typography variant="h6" className='printtext' fontWeight="600" sx={{ backgroundColor: '#0a9fc7', color: '#fff', padding: '4px',fontFamily:'Franklin Gothic Medium Cond' }}>
          QUOTATION
        </Typography>
      </Box>

      <Box sx={{ marginLeft: '10%' }}>
        <Grid container spacing={2} sx={{ mb: 0 }}>
          <Grid item xs={6}>
            <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
              <strong>Subject:</strong> {data.subject}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 0 }}>
          <Grid item xs={6}>
            <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
              <strong>Your Ref:</strong> g763763576
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ fontFamily:'Franklin Gothic Medium Cond' }}>
            <Typography variant="body1" className='printtext'>
              <strong>Due Date:</strong> {data.duedate}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 0 }}>
          <Grid item xs={6}>
            <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
              <strong>Our Ref:</strong> {data.refernce}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
              <strong>Date:</strong> 16-09-2024
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={0} sx={{ mb: 0 }}>
          <Grid item xs={12}>
            <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
              <strong>Customer:</strong> {data.company}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
              <strong>Kind Attn:</strong> {data.person}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
              <strong>Email:</strong> {data.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" className='printtext' style={{fontFamily:'Franklin Gothic Medium Cond'}}>
              <strong>Contact No.:</strong> {data.number}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <hr />

      <Typography variant="h6" className='printtext' sx={{ ml: 2, fontWeight: 600,fontFamily:'Franklin Gothic Medium Cond' }}>
        Dear Sir,
      </Typography>
      <Typography variant="body1" className='printtext' sx={{ ml: 3 ,fontFamily:'Franklin Gothic Medium Cond',fontSize:18}}>
      We thank you for showing interest in our products and giving us an opportunity to submit our offer for your requirement. <strong>The Detailed offer is given in Annexure 1 . We hope it is in line with your requirement. We now look forward to your esteemed PO.</strong><br/>
      We are channel partners for several reputed manufacturers. In the event of any requirement within the spectrum of the below products please do contact us. We will be happy to serve you.
      </Typography>

      <Box sx={{ textAlign: 'center', mt: 1, mb: 1}}>
        <Typography variant="h6" className='printtext' fontWeight="600" sx={{ backgroundColor: '#0a9fc7', color: '#fff', padding: '4px',fontFamily:'Franklin Gothic Medium Cond' }}>
          OUR TERMS AND CONDITIONS
        </Typography>
      </Box>

      <Box sx={{ marginLeft: '10%' }}>
        <Typography variant="body1" className='printtext' sx={{ mb: 1 ,fontFamily:'Franklin Gothic Medium Cond' }}>
          <strong>For:</strong> {data.for}
        </Typography>
        <Typography variant="body1" className='printtext' sx={{ mb: 1 , fontFamily:'Franklin Gothic Medium Cond' }}>
          <strong>Delivery Period:</strong> {data.dp==="Enter Number of Weeks" ? data.nweeks + ' weeks':data.dp}
        </Typography>
        <Typography variant="body1" className='printtext' sx={{ fontFamily: 'Franklin Gothic Medium Cond',display:'flex' }}>
  <strong>Payment Terms:</strong>
  {data.payment_terms && data.payment_terms.length > 0 ? (
    JSON.parse(data.payment_terms).map((term, index) => (
      <div key={index}>
        <ul type="none" style={{ display: 'flex' , marginTop:'0px'}}>
          <li>{term.option} {term.percentage}%</li>
        </ul>
      </div>
    ))
  ) : (
    'No payment terms available'
  )}
</Typography>
<Typography variant="body1" className='printtext' sx={{ fontFamily: 'Franklin Gothic Medium Cond',display:'flex' }}>
  <strong>Payment Days:</strong>
  {data.payment_days && data.payment_days.length > 0 ? (
    JSON.parse(data.payment_days).map((term, index) => (
      <div key={index}>
        <ul type="none" style={{ display: 'flex' , marginTop:'0px'}}>
          <li>{term.option}: {term.days} Days</li>
        </ul>
      </div>
    ))
  ) : (
    'No payment terms available'
  )}
</Typography>


        <Typography variant="body1" className='printtext' sx={{ mb: 1, fontFamily:'Franklin Gothic Medium Cond'  }}>
          <strong>GST:</strong> {data.pgst}
        </Typography>
        <Typography variant="body1" className='printtext' sx={{ mb: 1, fontFamily:'Franklin Gothic Medium Cond'  }}>
          <strong>Validity:</strong> {data.validity==="undefined" ? '---' : data.validity}
        </Typography>
 
        <Typography variant="body1" className='printtext' sx={{ mb: 1, fontFamily:'Franklin Gothic Medium Cond'  }}>
          <strong>Note:</strong> {data.note==="undefined" ? '---' : data.note}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
        <Typography variant="h6" fontWeight="600" className='printtext' sx={{ backgroundColor: '#0a9fc7', color: '#fff', padding: '4px',fontFamily:'Franklin Gothic Medium Cond' }}>
          PUMPS FOR LIQUID HANDLING SOLUTIONS
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="space-evenly" alignItems="center">
  {/* Example Grid for Logos */}
  <Grid item>
    <img src="enriching lives.png" alt="logo" height="25px" width="20px" />
    <img src="kpl.png" alt="logo" height="28px" width="28px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
      CENTRIFUGAL PUMPS, API PUMPS & VALVES
    </Typography>
  </Grid>

  <Grid item>
    <img src="darling.png" alt="logo" height="17px" width="65px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
      SUBMERSIBLE PUMPS: SLURRY & WATER
    </Typography>
  </Grid>

  <Grid item>
    <img src="hiro.png" alt="logo" height="15px" width="60px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
      TRIPLEX PLUNGER & METERING PUMPS
    </Typography>
  </Grid>

  <Grid item>
    <img src="rotodel.png" alt="logo" height="30px" width="40px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
      GEAR PUMPS
    </Typography>
  </Grid>

  <Grid item>
    <img src="aei.png" alt="logo" height="30px" width="40px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
      TRIPLE SCREW PUMPS
    </Typography>
  </Grid>
</Grid>

<Box sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
        <Typography variant="h6" className='printtext' fontWeight="600" sx={{ backgroundColor: '#0a9fc7', color: '#fff', padding: '4px',fontFamily:'Franklin Gothic Medium Cond' }}>
          MOTORS AND OTHER ACCESSORIES
        </Typography>
      </Box>


<Grid container spacing={3} justifyContent="space-evenly" alignItems="center">
  {/* Example Grid for Logos */}
  <Grid item>
    <img src="kirloskar.png" alt="logo" height="40px" width="25px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
    ALL TYPES OF MOTORS
    </Typography>
  </Grid>

  <Grid item>
    <img src="g.png" alt="logo" height="40px" width="50px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
    HT MOTORS
    </Typography>
  </Grid>

  <Grid item>
    <img src="normex.png" alt="logo" height="25px" width="90px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
    VARIOUS TYPES OF VALVES
    </Typography>
  </Grid>

  <Grid item>
    <img src="eom.png" alt="logo" height="35px" width="70px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
    PNEUMATIC ACTUATORS
    </Typography>
  </Grid>

  <Grid item>
  <img src="lovejoy.png" alt="logo" height="20px" width="50px" />
    <img src="fluid.png" alt="logo" height="20px" width="50px" /><br/>
    <Typography variant="caption" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
      TRIPLE SCREW PUMPS
    </Typography>
  </Grid>
</Grid>

<Box sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
        <Typography variant="h6" className='printtext' fontWeight="600" sx={{ backgroundColor: '#0a9fc7', color: '#fff', padding: '4px',fontFamily:'Franklin Gothic Medium Cond' }}>
          BLOWER AND VACUUM SYSTEMS FOR AIR HANDLING
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="space-evenly" alignItems="center">
           
      <Grid item>
  <img src="swam.png" alt="logo" height="30px" width="40px" /><br/>
    <Typography variant="span" sx={{ fontSize: '5px', color: 'blue', fontWeight: 'bold' }}>
      TRIPLE SCREW PUMPS
    </Typography>
  </Grid>

  <Grid item>
    <Typography variant="caption" sx={{ fontSize: '8px', color: 'blue', fontWeight: 'bold' }}>
    BLOWERS FOR AIR AND GASES
    </Typography>
  </Grid>

  <Grid item>
    <Typography variant="caption" sx={{ fontSize: '8px', color: 'blue', fontWeight: 'bold' }}>
    VACCUM PUMPS AND SYSTEMS
    </Typography>
  </Grid>

      </Grid>

      <Box sx={{ textAlign: 'center', mt: 1, mb: 1 }}>
        <Typography variant="h6" className='printtext' fontWeight="600" sx={{ backgroundColor: '#0a9fc7', color: '#fff', padding: '4px',fontFamily:'Franklin Gothic Medium Cond' }}>
          WATER FILTRATION AND TREATMENT
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="space-evenly" alignItems="center">
           
           <Grid item>
       <img src="auqa.png" alt="logo" height="40px" width="160px" /><br/>
       </Grid>
     
       <Grid item>
         <Typography variant="caption" sx={{ fontSize: '8px', color: 'blue', fontWeight: 'bold' }}>
         AUTOMATIC & ONLINE SELF CLEANING FILTERS
         </Typography>
       </Grid>
     
       <Grid item>
         <Typography variant="caption" sx={{ fontSize: '9px', color: 'blue', fontWeight: 'bold' }}>
         ENERGY AND AREA EFFICIENT SOLUTIONS FOR ETPs, STPs AND WTPs
         </Typography>
       </Grid>
     
           </Grid><hr/><br/>
           <Grid container spacing={3} justifyContent="space-between" alignItems="center">
            <Grid style={{marginLeft:'80px'}}>
                <Typography><strong>Designation</strong>: </Typography><br/>
                <Typography><strong>Name</strong>: </Typography>
            </Grid>
            <Grid style={{marginRight:'40px',marginTop:'80px'}}>For Flowtech Fluid Systems Pvt Limited,</Grid>
           </Grid>


      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={print}
          id="printc"
          sx={{ display: 'block', margin: '0 auto', width:'150px'}}
        >
         <LocalPrintshopIcon /> Print
        </Button>
      </Box>
    </Box>
  );
}
