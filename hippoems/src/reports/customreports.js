import { useState, useEffect } from 'react';
import { DataGridPro, GridLogicOperator, GridToolbar } from '@mui/x-data-grid-pro';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';  // Import Button from MUI
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('your-license-key');

export default function Customreports() {
  const location = useLocation();
  const id = location.state;  // Report ID
  const uid = localStorage.getItem('id');

  const [data2, setData] = useState({ name: "", description: "", date: "" });
  const [columns, setColumns] = useState([]);  
  const [enquiry, setEnquiry] = useState([]);  
  const [pageSize, setPageSize] = useState(10);  
  const [filterModel, setFilterModel] = useState({
    items: [],  // Initialize as empty
  });

  // Helper function to get filter key based on report ID
  const getLocalStorageKey = () => `customReportFilters_${id}`;

  // Load filters from local storage
  useEffect(() => {
    const savedFilterModel = localStorage.getItem(getLocalStorageKey());
    if (savedFilterModel) {
      setFilterModel(JSON.parse(savedFilterModel));
    }
  }, [id]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HIPPOEMS}/myreports/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setData({
            name: res.data[0].reportname,
            description: res.data[0].description,
            date: res.data[0].date
          });

          const parsedColumns = JSON.parse(res.data[0].columns);
          const formattedColumns = parsedColumns.map((column) => ({
            field: column,
            headerName: column.charAt(0).toUpperCase() + column.slice(1),
            width: 150,
            filterable: true,
          }));

          setColumns(formattedColumns);
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
        if (res.status === 200) {
          const updatedData = res.data.map((row) => ({
            ...row,
            payment_terms: JSON.parse(row.payment_terms),
            payment_days: JSON.parse(row.payment_days),
          }));
          setEnquiry(updatedData);
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

  }, [id, uid]);

  // Save filters to local storage when they change
  const handleFilterChange = (model) => {
    setFilterModel(model);
  };

  // Function to manually save filters
  const saveFiltersToLocalStorage = () => {
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(filterModel));
    Swal.fire({
      title: 'Filters Saved',
      text: 'Your filters have been saved to local storage.',
      icon: 'success',
    });
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <div style={{ marginBottom: '10px' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={saveFiltersToLocalStorage}  // Button click handler
        >
          Save Filters
        </Button>
      </div>
      <DataGridPro
        rows={enquiry} 
        columns={columns} 
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}  
        rowsPerPageOptions={[10, 20, 30]}
        pagination
        paginationMode="client"
        disableSelectionOnClick
        filterModel={filterModel}
        onFilterModelChange={handleFilterChange}  // Trigger when filters change
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          filterPanel: {
            logicOperators: [GridLogicOperator.And],
            columnsSort: 'asc',
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
              deleteIconProps: {
                sx: {
                  '& .MuiSvgIcon-root': { color: '#d32f2f' },
                },
              },
            },
            sx: {
              '& .MuiDataGrid-filterForm': { p: 2 },
              '& .MuiDataGrid-filterForm:nth-child(even)': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
              },
              '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 150 },
              '& .MuiDataGrid-filterFormOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormValueInput': { width: 200 },
            },
          },
        }}
      />
    </div>
  );
}
