import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid/'
import { TextField } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';


const GetCustomers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    customer_id: '',
    first_name: '',
    last_name: '',
  });

  const [mainPaginationModel, setMainPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [filteredPaginationModel, setFilteredPaginationModel] = useState({ page: 0, pageSize: 3 });
  
  useEffect(() => {
    const fetchData = async () => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 25 // Increment progress
        });
      }, 100);

      try {
        const response = await axios.get('/api/customers');
        setData(response.data);
      } catch (err) {
        if(err.response) {
          const status = err.response.status;
          const statusText = err.response.statusText;
          setError(`Error ${status}: ${statusText}, Please try again later.`);
        } else if (err.request) {
          setError("Netwrok error: Unable to reach the server. Please check your network connesctions.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 770)
      }
    };

    fetchData();
  }, []);

  if (loading) return <ProgressBar striped variant="warning" animated now={progress} className="progbar" />;
  if (error) return <p>{error}</p>;

  function getRowId(row) {
    return row.customer_id;
  }

  const columns = [
    {field: 'customer_id', headerName: 'Customer ID', flex:1},
    {field: 'first_name', headerName: 'First Name', flex: 2},
    {field: 'last_name', headerName: 'Last Name', flex: 2},
  ]

  const filteredData = data.filter(customer => {
    return (
      (filters.customer_id === '' || customer.customer_id.toString().includes(filters.customer_id)) &&
      (filters.first_name === '' || customer.first_name.toLowerCase().includes(filters.first_name.toLowerCase())) &&
      (filters.last_name === '' || customer.last_name.toLowerCase().includes(filters.last_name.toLowerCase()))
    );
  });

  const initialFilteredData = (filters.customer_id === '' && filters.first_name === '' && filters.last_name === '') ? [] : filteredData;

  const changeHeight = (pageSize) => {
    const rowHeight = 52;
    const footerHeight = 52;
    const height = pageSize * rowHeight + footerHeight + 60;
    return height;
  };

  return (
    <div>
      <h1 className="customer-title">List of All Recorded Customers</h1>
      <DataGrid
        getRowId={getRowId}
        rows={data}
        columns={columns}
        pagination
        paginationModel={mainPaginationModel}
        onPaginationModelChange={setMainPaginationModel}
        pageSizeOptions={[5,10,20]}
        className="data-grid"
        sx={{width: '60%', height: changeHeight(mainPaginationModel.pageSize)}}
      />

      <h1 className="customer-title">Filter Customers by Value</h1>
      <div className="filter-container">
        <TextField
          label="Customer ID"
          variant="outlined"
          value={filters.customer_id}
          onChange={e => setFilters({ ...filters, customer_id: e.target.value })}
          autoComplete='off'
          className="customer-textfield"
          style={{ marginRight: '16px'}}
        />

        <TextField
          label="First Name"
          variant="outlined"
          value={filters.first_name}
          onChange={e => setFilters({ ...filters, first_name: e.target.value })}
          autoComplete='off'
          className="customer-textfield"
          style={{ marginRight: '16px'}}
        />

        <TextField
          label="Last Name"
          variant="outlined"
          value={filters.last_name}
          onChange={e => setFilters({ ...filters, last_name: e.target.value })}
          autoComplete='off'
          className="customer-textfield"
          style={{ marginRight: '16px'}}
        />
      </div>

      <h1 className="customer-title">List of Filtered Customers</h1>
      <DataGrid
        getRowId={getRowId}
        rows={initialFilteredData}
        columns={columns}
        pagination={initialFilteredData.length > 0}
        paginationModel={filteredPaginationModel}
        onPaginationModelChange={setFilteredPaginationModel}
        pageSizeOptions={[3,6,9]}
        className="data-grid"
        sx={{width: '60%', height: changeHeight(filteredPaginationModel.pageSize)}}
      />
    </div>
  );
};

export default GetCustomers;
