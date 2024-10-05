import { Typography } from '@mui/material';
import React from 'react';
import './Marketteamhome.css'; // Assuming you'll create this CSS file for custom styles

export default function Marketteamhome() {
  return (
    <div>
      <img src='water-background.jpg' alt="water" height={500} width='100%' style={{zIndex:'-1',position:'fixed'}}/>
      <br/><br/><br/><Typography variant='h4' className='drop-text' style={{fontFamily:'Franklin Gothic Medium Cond',position:'fixed',left:'20px'}}>
        WELCOME TO FLOWTECH FLUID SYSTEMS
      </Typography><br/><br/>
      <Typography id="marketing_home_text" className='drop-text delay' sx={{width:'50%', fontFamily:'Franklin Gothic Medium Cond',marginLeft:'20px'}}>
        Flowtech Fluid Systems Private Limited is majorly into Fluid Handling Products and Services. We are mainly the distributors for engineering products and having status of authorized dealer for M/s. Kirloskar Brothers Ltd., M/s. Kirloskar Electric Co. Ltd., for all their products such as pumps, valves, motors and their spares.<br/>
        Our customers include all the PSU’s in the area such as M/s. Visakhapatnam Steel Plant, M/s. H.P.C.L., Defence Departments (M/s. Naval Dockyard, SBC, CIPRO etc.,) M/s. N.T.P.C, M/s. N.M.D.C. & M/s. O.N.G.C. etc and other industries in the private sector, Govt. departments such as GVMC, PHE etc.
      </Typography>
      <img src='motor.png' alt='motor' id="motor"/>
      <Typography id="products_example" variant='h4' color={'grey'}>Some Of Our Products</Typography>
      <div id="products_div">
          <marquee style={{marginTop:'-22px'}}>
            <img src='pumps1.png' alt='logo' height='170px'/>
            <img src='pumps2.png' alt='logo' height='180px'/>
            <img src='pumps3.png' alt='logo' height='170px'/>
            <img src='pumps4.png' alt='logo' height='170px'/>
            <img src='motors1.png' alt='logo'/>
            <img src='motors2.png' alt='logo'/>
            <img src='motors3.png' alt='logo'/>
            <img src='motors4.png' alt='logo'/>
            <img src='valves1.png' alt='logo'/>
            <img src='valves2.png' alt='logo'/>
            <img src='valves3.png' alt='logo'/>
            <img src='valves4.png' alt='logo'/>
          </marquee>
      </div>
    </div>
  );
}
