import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid/'

const GetActor = ({paginationModel, setPaginationModel}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/actor');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  function getRowId(row) {
    return row.actor_id;
  }

  const columns = [
    {field: 'first_name', headerName: 'First Name', flex: 1},
    {field: 'last_name', headerName: 'Last Name', flex: 1},
    {field: 'last_update', headerName: 'Last Update', flex: 2}
  ]

  const changeHeight = () => {
    const rowHeight = 52;
    const footerHeight = 52;
    const visibleRows = paginationModel.pageSize;
    return visibleRows * rowHeight + footerHeight + 60;
  };

  return (
    <div className="actor-container">
      <h1 className="actor-title">List of Currently Recorded Actors</h1>
      <DataGrid
        getRowId={getRowId}
        rows={data}
        columns={columns}
        pahination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5,10,20]}
        className="data-grid"
        sx={{width: '60%', height: changeHeight()}}
    />
    </div>
  );
};

export default GetActor;
