import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Drawer, List, ListItem, Divider, useMediaQuery, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import InventoryIcon from '@mui/icons-material/Inventory';
import WidgetsIcon from '@mui/icons-material/Widgets';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const usenav = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenu, setSubmenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You Want Logout...?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log-Out!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Logged Out!",
          text: "You have successfully logged out.",
          icon: "success"
        });
        localStorage.clear(); 
        usenav('/');
        window.location.reload();
      }
    });
  };

  const handleMenuClick = (event, submenu) => {
    setAnchorEl(event.currentTarget);
    setSubmenu(submenu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSubmenu(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <div>
      <List>
        <ListItem>
        <img src="hippoems.png" alt="HippoEms" height="35px" width="30px" />&emsp;
        <img src="flowtech.png" alt="Flowtech" height="24px" style={{ float: 'right' }} />
        </ListItem><hr/>
        <ListItem button onClick={() => usenav('/')}>
          <HomeIcon />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>Home</Typography>
        </ListItem>
        <ListItem button onClick={() => usenav('/company')}>
          <BusinessIcon />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>Companies</Typography>
        </ListItem>
        {localStorage.getItem('role') === "admin" && (
          <ListItem button onClick={(e) => handleMenuClick(e, 'employees')}>
            <PeopleIcon />
            <Typography variant="body1" sx={{ marginLeft: 1 }}>Employees</Typography>
          </ListItem>
        )}
        {localStorage.getItem('role') === "support" && (
          <ListItem button onClick={() => usenav('/marketing')}>
            <PeopleIcon />
            <Typography variant="body1" sx={{ marginLeft: 1 }}>Marketing Team</Typography>
          </ListItem>
        )}
        <ListItem button onClick={(e) => handleMenuClick(e, 'enquiries')}>
          <AssignmentIcon />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>Enquiries</Typography>
        </ListItem>
        <ListItem button onClick={(e) => handleMenuClick(e, 'reports')}>
          <ReportIcon />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>Reports</Typography>
        </ListItem>
        {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'support') ? (
          <ListItem button onClick={(e) => handleMenuClick(e, 'assets')}>
            <InventoryIcon />
            <Typography variant="body1" sx={{ marginLeft: 1 }}>Assets</Typography>
          </ListItem>
        ) : (
          <ListItem button onClick={() => usenav('/marketing')}>
            <InventoryIcon />
            <Typography variant="body1" sx={{ marginLeft: 1 }}>Assets</Typography>
          </ListItem>
        )}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <LogoutIcon />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>Logout</Typography>
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'white' }}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} sx={{ mr: 2 }} style={{zIndex:1}}>
                <WidgetsIcon sx={{color:'#0a9fc7'}}/>
              </IconButton>
              <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
              </Drawer>
            </>
          ) : (
            <>
              <img src="hippoems.png" alt="HippoEms" height="60px" width="55px" />
              <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                {localStorage.getItem('name') && localStorage.getItem('name').trim() !== "" && (
                  <>
                    <IconButton onClick={() => usenav('/')} sx={{ color: 'black' }}>
                      <HomeIcon />
                      <Typography variant="h6" sx={{ marginLeft: 1 }}>Home</Typography>
                    </IconButton>
                    <IconButton onClick={() => usenav('/company')} sx={{ color: 'black' }}>
                      <BusinessIcon />
                      <Typography variant="h6" sx={{ marginLeft: 1 }}>Companies</Typography>
                    </IconButton>
                    {localStorage.getItem('role') === "admin" && (
                      <IconButton onClick={(e) => handleMenuClick(e, 'employees')} sx={{ color: 'black' }}>
                        <PeopleIcon />
                        <Typography variant="h6" sx={{ marginLeft: 1 }}>Employees</Typography>
                      </IconButton>
                    )}
                    {localStorage.getItem('role') === "support" && (
                      <IconButton onClick={() => usenav('/marketing')} sx={{ color: 'black' }}>
                        <PeopleIcon />
                        <Typography variant="h6" sx={{ marginLeft: 1 }}>Marketing Team</Typography>
                      </IconButton>
                    )}
                    <IconButton onClick={(e) => handleMenuClick(e, 'enquiries')} sx={{ color: 'black' }}>
                      <AssignmentIcon />
                      <Typography variant="h6" sx={{ marginLeft: 1 }}>Enquiries</Typography>
                    </IconButton>
                    <IconButton onClick={(e) => handleMenuClick(e, 'reports')} sx={{ color: 'black' }}>
                      <ReportIcon />
                      <Typography variant="h6" sx={{ marginLeft: 1 }}>Reports</Typography>
                    </IconButton>
                    {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'support') ? (
                      <IconButton onClick={(e) => handleMenuClick(e, 'assets')} sx={{ color: 'black' }}>
                        <InventoryIcon />
                        <Typography variant="h6" sx={{ marginLeft: 1 }}>Assets</Typography>
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => usenav('/marketing')} sx={{ color: 'black' }}>
                        <InventoryIcon />
                        <Typography variant="h6" sx={{ marginLeft: 1 }}>Assets</Typography>
                      </IconButton>
                    )}
                    <Button onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
                      <LogoutIcon />
                    </Button>
                    <img src="flowtech.png" alt="Flowtech" height="40px" style={{ float: 'right' }} />
                  </>
                )}
              </div>
            </>
          )}
        </Toolbar>

        {/* Submenus */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && submenu === 'employees'} onClose={handleMenuClose}>
          <MenuItem onClick={() => { usenav('/marketing'); handleMenuClose(); }}>Marketing Team</MenuItem>
          <MenuItem onClick={() => { usenav('/support'); handleMenuClose(); }}>Support Team</MenuItem>
        </Menu>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && submenu === 'enquiries'} onClose={handleMenuClose}>
          <MenuItem onClick={() => { usenav('/enquiry'); handleMenuClose(); }}>Enquiry</MenuItem>
          <MenuItem onClick={() => { usenav('/versions'); handleMenuClose(); }}>Enquiry Versions</MenuItem>
        </Menu>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && submenu === 'reports'} onClose={handleMenuClose}>
          <MenuItem onClick={() => { usenav('/reports'); handleMenuClose(); }}>Reports</MenuItem>
          <MenuItem onClick={() => { usenav('/myreport'); handleMenuClose(); }}>My Reports</MenuItem>
        </Menu>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && submenu === 'assets'} onClose={handleMenuClose}>
          <MenuItem onClick={() => { usenav('/assets'); handleMenuClose(); }}>Assets</MenuItem>
          <MenuItem onClick={() => { usenav('/addassets'); handleMenuClose(); }}>Add Assets</MenuItem>
        </Menu>
      </AppBar>

      {/* Add a margin to the content below the Navbar to avoid overlap */}
      <div style={{ marginTop: '70px' }}>
        {/* The rest of your content goes here */}
      </div>
    </>
  );
};

export default Navbar;
