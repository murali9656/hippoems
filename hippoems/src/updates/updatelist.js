import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Button, List, Box } from '@mui/material';
import { CloudDownload as CloudDownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Updatelist() {
  const location = useLocation();
  const ern = location.state; // This will hold the enquiry reference number
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HIPPOEMS}/updates/${ern}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setData(res.data);
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
  }, [ern]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        style={{ color: '#0a9fc7', fontWeight: 'bold', textDecoration: 'underline' }}
      >
        Updates List for Enquiry Reference Number: {ern}
      </Typography>
      
      {data.length > 0 ? (
        <List>
          {data.map((item, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Update by: {item.update_owner}
                </Typography>

                <Typography variant="body1" paragraph>
                  {item.updates}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    Updated on:{item.update_on}
                  </Typography>

                  {item.documents !=="---" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CloudDownloadIcon />}
                      onClick={() => window.open(`${process.env.REACT_APP_HIPPOEMS}/enquirydocuments/${item.documents}`, '_blank')}
                    >
                      Download Document
                    </Button>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No document available
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No updates available for this enquiry reference number.
        </Typography>
      )}
    </Box>
  );
}
