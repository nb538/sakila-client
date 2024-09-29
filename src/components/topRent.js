import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const GetRent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/toprent');
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

  // Handle movie title click
  const handleTitleClick = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
  };

  const titleFix = (title) => {
    if (!title) return ''
    return title.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  };

  return (
    <div className="actor-container">
      <h1 className="actor-title">Top 5 Rented Movies of All Time</h1>
      <table className="data-table" style={{ width: '60%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Movie Title</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Times Rented</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} onClick={() => handleTitleClick(item)} style={{ cursor: 'pointer' }}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{titleFix(item.title)}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.rented}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Movie Details</DialogTitle>
        <DialogContent>
          {selectedMovie && (
            <div>
              <p><strong>Title:</strong> {titleFix(selectedMovie.title)}</p>
              <p><strong>Times Rented:</strong> {selectedMovie.rented}</p>
              <p><strong>Description:</strong> {selectedMovie.description}</p>
              <p><strong>Release Year:</strong> {selectedMovie.release_year}</p>
              <p><strong>Rental Duration:</strong> {selectedMovie.rental_duration} days</p>
              <p><strong>Rental Rate:</strong> ${selectedMovie.rental_rate}/day</p>
              <p><strong>Lenght:</strong> {selectedMovie.length} minutes</p>
              <p><strong>Replacement Cost:</strong> ${selectedMovie.replacement_cost}</p>
              <p><strong>Rating:</strong> {selectedMovie.rating}</p>
              <p><strong>Special Features:</strong> {selectedMovie.special_features}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GetRent;
