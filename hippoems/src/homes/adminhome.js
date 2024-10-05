import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid, LineChart, Line
} from 'recharts';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function Adminhome() {

  const usenav = useNavigate();
  const [loading, setLoading] = useState(true);

  const [dataByCategory, setDataByCategory] = useState([
    { name: 'Enquiry Regretted', value: 0 },
    { name: 'Budgetary Offer Submitted', value: 0 },
    { name: 'Tender Submitted / Offer under Negotiation', value: 0 },
    { name: 'PO Received', value: 0 },
    { name: 'Order Confirm but PO on hold', value: 0 },
    { name: 'Order Lost', value: 0 },
  ]);
  
  const monthMap = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
  };

  const [dataByMonth, setDataByMonth] = useState([
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 },
  ]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getstatuscount`)
      .then((res) => {
        if (res.status === 200) {
          // Transform the status data
          const transformedData = res.data.map(item => ({
            name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: item.enquiry_count
          }));
          const updatedDummyData = statusdata.map((status) => {
            const match = transformedData.find(item => item.name.toLowerCase() === status.name);
            return match ? { ...status, value: match.value, percentage: `${match.value}%` } : status;
          });
          setStatusdata(updatedDummyData);
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
          text: 'Something went wrong. Check your Internet connection',
          icon: 'error',
        });
      });

    axios.get(`${process.env.REACT_APP_HIPPOEMS}/getstagecount`)
      .then((res) => {
        if (res.status === 200) {
          const transformedData = res.data.map(item => ({
            name: item.stage.charAt(0).toUpperCase() + item.stage.slice(1),
            value: item.enquiry_count
          }));
          const updatedData = dataByCategory.map(category => {
            const match = transformedData.find(item => item.name === category.name);
            return match ? { ...category, value: match.value } : category;
          });
          setDataByCategory(updatedData);
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong. Check your Internet connection',
          icon: 'error',
        });
      });

    axios.get(`${process.env.REACT_APP_HIPPOEMS}/monthwisecount`)
      .then((res) => {
        if (res.status === 200) {
          const transformedData = res.data.map((item) => {
            const monthKey = item.month.split('-')[1];
            return {
              name: monthMap[monthKey],
              value: item.enquiry_count,
            };
          });
          const updatedDataByMonth = dataByMonth.map(month => {
            const foundMonth = transformedData.find(item => item.name === month.name);
            return foundMonth ? { ...month, value: foundMonth.value } : month;
          });
          setDataByMonth(updatedDataByMonth);
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong. Check your Internet connection',
          icon: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const COLORS = ['#1ABC9C', '#3B82F6', '#34495E', '#32a852', '#dbd521', '#de4928'];

  const handleBarClick = (data, index) => {
    usenav('/stage', { state: data.name });
  };

  const handleDotClick = (data, index) => {
    alert(`You selected: ${data.name} with ${data.enquiries} enquiries`);
  };

  const handlerstatus = (status) => {
    usenav('/status', { state: status });
  };

  const [statusdata, setStatusdata] = useState([
    {
      title: 'Completed',
      name: 'complete',
      value: 1,
      percentage: 0,
      comparedTo: 'Completed Enquires Count',
      icon: <FactCheckIcon />,
      color: '#32a852',
    },
    {
      title: 'Accepted',
      name: 'accept',
      value: 0,
      percentage: 0,
      comparedTo: 'Accepted Enquires Count',
      icon: <ThumbUpIcon />,
      color: '#007bff',
    },
    {
      title: 'Pending',
      name: 'pending',
      value: 0,
      percentage: 0,
      comparedTo: 'Pending Enquires Count',
      icon: <PendingActionsIcon />,
      color: '#dbd521',
    },
    {
      title: 'Rejected',
      name: 'reject',
      value: 0,
      percentage: 0,
      comparedTo: 'Rejected Enquires Count',
      icon: <ThumbDownIcon />,
      color: '#de4928',
    },
  ]);

  return (
    <div style={{ marginTop: '60px' }}>
      <Typography variant="h4" gutterBottom style={{ fontFamily: 'Franklin Gothic Medium Cond', textDecoration: 'underline 1px', color: '#333' }}>
        Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <Grid container spacing={3}>
            {statusdata.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handlerstatus(item.name)}
                >
                  <Box
                    style={{
                      backgroundColor: item.color,
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '8px',
                      marginRight: '20px',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" style={{ fontWeight: 500, color: '#777' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="h4" style={{ fontWeight: 'bold', margin: '8px 0' }}>
                      {item.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: 'green', fontWeight: 'bold', marginBottom: '4px' }}
                    >
                      {item.percentage}
                    </Typography>
                    <Typography variant="body2" style={{ color: '#777' }}>
                      {item.comparedTo}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} style={{ marginTop: '0.5px' }}>
            {/* Enquiry Tracker by Stage (BarChart) */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <Typography variant="h6" gutterBottom>
                  Enquiry Tracker by Stage
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" onClick={handleBarClick}>
                      {dataByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ cursor: 'pointer' }} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Enquiry Tracker by Month (LineChart) */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <Typography variant="h6" gutterBottom>
                  Enquiry Tracker by Month
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dataByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ onClick: handleDotClick }} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
