import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const GetTopStore = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get('/api/topinstore1');
        setData1(response1.data);
        const response2 = await axios.get('/api/topinstore2');
        setData2(response2.data);
        const response3 = await axios.get('/api/toprentperactor');
        setData3(response3.data);
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

  const handleActorClick = (actor) => {
    setSelectedActor(actor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedActor(null);
  };

  const titleFix = (title) => {
    if (!title) return '';
    return title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const removeLetters = (str) => {
    const date = new Date(str);
    return date.toLocaleDateString();
}


  const actorFilms = selectedActor
    ? data3.filter(item => item.actor_id === selectedActor.actor_id).slice(0, 5)
    : [];

  return (
    <>
      <div className="actor-container">
        <h1 className="actor-title">Top 5 Actors in Store 1</h1>
        <table className="data-table" style={{ width: '60%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actor</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Films Acted in Store</th>
            </tr>
          </thead>
          <tbody>
            {data1.map((item) => (
              <tr key={item.id} onClick={() => handleActorClick(item)} style={{ cursor: 'pointer' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{titleFix(item.first_name)} {titleFix(item.last_name)}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.acted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actor-container1">
        <h1 className="actor-title">Top 5 Actors in Store 2</h1>
        <table className="data-table" style={{ width: '60%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actor</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Films Acted in Store</th>
            </tr>
          </thead>
          <tbody>
            {data2.map((item) => (
              <tr key={item.id} onClick={() => handleActorClick(item)} style={{ cursor: 'pointer' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{titleFix(item.first_name)} {titleFix(item.last_name)}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.acted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Actor Details</DialogTitle>
        <DialogContent>
          {selectedActor && (
            <div>
              <p><strong>Name:</strong> {titleFix(selectedActor.first_name)} {titleFix(selectedActor.last_name)}</p>
              <p><strong>Last Updated:</strong> {removeLetters(selectedActor.last_update)}</p>
              <h3>Top 5 Rented Films:</h3>
              <ul>
                {actorFilms.map((film, index) => (
                  <li key={index}>{titleFix(film.title)} -- Times Rented: {film.rented}</li> 
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GetTopStore;
