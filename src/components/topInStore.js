import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Paper from '@mui/material/Paper'
import 'bootstrap/dist/css/bootstrap.min.css';
import mask from '../assets/images/mask.png'

const GetTopStore = () => {
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null);
  const colorPalette = ['gold', 'silver', 'burlywood', 'crimson', 'crimson'];

  useEffect(() => {
    const fetchData = async () => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10; // Increment progress
        });
      }, 100);

      try {
        const response3 = await axios.get('/api/toprentperactor');
        setData3(response3.data);
        const response4 = await axios.get('/api/topperstore');
        setData4(response4.data);
        const response5 = await axios.get('/api/topactorall');
        setData5(response5.data);
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
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ProgressBar striped variant="warning" animated now={progress} className="progbar" />;
  if (error) return <p>{error}</p>;

  const handleActorClick = (actor) => {
    const topperFilter1 = data4.filter(item => item.actor_id === actor.actor_id && item.store_id === 1).slice(0,5);
    const topperFilter2 = data4.filter(item => item.actor_id === actor.actor_id && item.store_id === 2).slice(0,5);

    setSelectedActor({
      ...actor,
      store1Info: topperFilter1 || {},
      store2Info: topperFilter2 || {}
    });
    setOpen1(true);
  };

  const handleActorClickTop = (actor) => {
    const topFilter = data5.filter(item => item.actor_id === actor.actor_id);

    setSelectedTop({
      ...actor,
      topInfo: topFilter || {},
    });
    setOpen2(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
    setSelectedActor(null);
  };

  const handleClose2 = () => {
    setOpen2(false);
    setSelectedTop(null);
  };

  const titleFix = (title) => {
    if (typeof title !== 'string') return '';
    return title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const removeLetters = (str) => {
    const date = new Date(str);
    return date.toLocaleDateString();
}


  const actorFilms = selectedActor ? data3.filter(item => item.actor_id === selectedActor.actor_id).slice(0, 5) : [];
  const topFilms = selectedTop ? data3.filter(item => item.actor_id === selectedTop.actor_id).slice(0,5) : [];


  const store1Actors = data4.filter(item => item.store_id === 1).slice(0, 5);
  const store2Actors = data4.filter(item => item.store_id === 2).slice(0, 5);
  
  return (
    <>
      <div className="table-container">
        <h1 className="table-title">Top 5 Actors of All Time</h1>
        <table id="topactor-table">
          <tbody>
            {data5.map((item, index) => (
              <Paper sx={{ backgroundColor: 'black', borderRadius: '10px' }} elevation={10}>
              <tr key={item} onClick={() => handleActorClickTop(item)} style={{ backgroundColor: colorPalette[index % colorPalette.length], cursor: 'pointer' }}>
                <td>{index+1}. {titleFix(item.first_name)} {titleFix(item.last_name)} <img src={mask} id="mask-pic" alt="" /></td>
              </tr>
              </Paper>
            ))}
          </tbody>
        </table>
      </div>

      <div className="top-per-stores-container">
        <div className="table-container">
        <h1 className="table-title">Top 5 Actors in Store 1</h1>
        <table id="store-actor-table">
          <tbody>
            {store1Actors.map((item) => (
              <Paper sx={{ backgroundColor: 'black', borderRadius: '10px' }} elevation={10} className="store-paper">
              <tr key={item} onClick={() => handleActorClick(item)} style={{ cursor: 'pointer' }}>
                <td>{titleFix(item.first_name)} {titleFix(item.last_name)}</td>
              </tr>
              </Paper>
            ))}
          </tbody>
        </table>
        </div>

        <div className="table-container">
        <h1 className="table-title">Top 5 Actors in Store 2</h1>
        <table id="store-actor-table">
          <tbody>
            {store2Actors.map((item) => (
              <Paper sx={{ backgroundColor: 'black', borderRadius: '10px' }} elevation={10} className="store-paper">
              <tr key={item} onClick={() => handleActorClick(item)} style={{ cursor: 'pointer' }}>
                <td>{titleFix(item.first_name)} {titleFix(item.last_name)}</td>
              </tr>
              </Paper>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <Dialog open={open1} onClose={handleClose1}>
        <DialogTitle className="topactor-dialog-title">Actor Details</DialogTitle>
        <DialogContent className="topactor-dialog">
          {selectedActor && (
            <div className="topactor-dialog">
              <p><strong>Name:</strong> {titleFix(selectedActor.first_name)} {titleFix(selectedActor.last_name)}</p>
              <p><strong>Last Updated:</strong> {removeLetters(selectedActor.last_update)}</p>
              <p><strong>Films Acted in Inventory:</strong> {selectedActor.movie_count} movies</p>
              <h3 style={{color: 'gold'}}>Top 5 Rented Films:</h3>
              <ul>
                {actorFilms.map((film, index) => (
                  <li key={index}>{titleFix(film.title)} -- Times Rented: {film.rented}</li> 
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions className="topactor-dialog">
          <Button onClick={handleClose1} color="primary">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open2} onClose={handleClose2}>
        <DialogTitle className="topactor-dialog-title">Actor Details</DialogTitle>
        <DialogContent className="topactor-dialog">
          {selectedTop && (
            <div className="topactor-dialog">
              <p><strong>Name:</strong> {titleFix(selectedTop.first_name)} {titleFix(selectedTop.last_name)}</p>
              <p><strong>Last Updated:</strong> {removeLetters(selectedTop.last_update)}</p>
              <p><strong>Films Acted Overall: </strong> {selectedTop.acted} movies</p>
              <h3 style={{color: 'gold'}}>Top 5 Rented Films:</h3>
              <ul>
                {topFilms.map((film, index) => (
                  <li key={index}>{titleFix(film.title)} -- Times Rented: {film.rented}</li> 
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions className="topactor-dialog">
          <Button onClick={handleClose2} color="primary">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GetTopStore;
