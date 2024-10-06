import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Pagination, Modal, Button, ProgressBar } from 'react-bootstrap';
import { TextField } from '@mui/material'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const GetFilms = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    title: '',
    first_name: '',
    last_name: '',
    genre: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

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
        const response1 = await axios.get('/api/filmactorgenre');
        setData1(response1.data);
        const response2 = await axios.get('/api/currentinventory');
        setData2(response2.data);
        const response3 = await axios.get('/api/currentrent');
        setData3(response3.data);
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

  const filteredData = data1.filter(entry => {
    return (
      entry.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      entry.first_name.toLowerCase().includes(filters.first_name.toLowerCase()) &&
      entry.last_name.toLowerCase().includes(filters.last_name.toLowerCase()) &&
      entry.name.toLowerCase().includes(filters.genre.toLowerCase())
    );
  });

  const indexOfLastEntry = currentPage * itemsPerPage;
  const indexOfFirstEntry = indexOfLastEntry - itemsPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const items = [];
    items.push(<Pagination.First key="first" onClick={() => handlePageChange(1)} disabled={currentPage === 1} />);
    items.push(<Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />);

    const maxDisplayedPages = 5;
    let startPage, endPage;

    if (totalPages <= maxDisplayedPages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfDisplayed = Math.floor(maxDisplayedPages / 2);
      startPage = Math.max(1, currentPage - halfDisplayed);
      endPage = Math.min(totalPages, currentPage + halfDisplayed);

      if (startPage === 1) {
        endPage = maxDisplayedPages;
      } else if (endPage === totalPages) {
        startPage = totalPages - maxDisplayedPages + 1;
      }
    }

    if (startPage > 1) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    items.push(<Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />);
    items.push(<Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />);

    return items;
  };

  // Handle filter input changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle modal display
  const handleShowModal = (film) => {
    const store1inventory = data2.find(item => item.film_id === film.film_id && item.store_id === 1);
    const store2inventory = data2.find(item => item.film_id === film.film_id && item.store_id === 2);
    const store1rented = data3.find(item => item.film_id === film.film_id && item.store_id === 1);
    const store2rented = data3.find(item => item.film_id === film.film_id && item.store_id === 2);

    setSelectedFilm({
      ...film,
      store1In: store1inventory || {},
      store1Out: store1rented || {rented: 0},
      store2In: store2inventory || {},
      store2Out: store2rented || {rented: 0},
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFilm(null);
  };

  return (
    <div className="film-page">
      <h1>Our Entire Catalogue!</h1>
      <h3 className="film-body">Find your film by title, actor name(first or last), or by genre!</h3>
      <div className="filter-container mb-3" style={{ alignSelf: 'start', marginLeft: '2%'}}>
        <TextField
          label="Film Title"
          name="title"
          variant="outlined"
          value={filters.title}
          onChange={handleFilterChange}
          autoComplete="off"
          className="film-textfield"
          style={{ marginLeft: '16px', marginRight: '16px' }}
        />
        <TextField
          label="First Name"
          name="first_name"
          variant="outlined"
          value={filters.first_name}
          onChange={handleFilterChange}
          autoComplete="off"
          className="film-textfield"
          style={{ marginRight: '16px' }}
        />
        <TextField
          label="Last Name"
          name="last_name"
          variant="outlined"
          value={filters.last_name}
          onChange={handleFilterChange}
          autoComplete="off"
          className="film-textfield"
          style={{ marginRight: '16px' }}
        />
        <TextField
          label="Genre"
          name="genre"
          variant="outlined"
          value={filters.genre}
          onChange={handleFilterChange}
          autoComplete="off"
          className="film-textfield"
        />
      </div>

      <Table striped style={{width: '90%'}}>
        <thead>
          <tr>
            <th>Film Title</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entry, index) => (
            <tr key={index} onClick={() => handleShowModal(entry)} style={{ cursor: 'pointer' }}>
              <td>{entry.title}</td>
              <td>{entry.first_name}</td>
              <td>{entry.last_name}</td>
              <td>{entry.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="film-body">
        {renderPaginationItems()}
      </Pagination>

      {/* Modal for displaying film details */}
      <Modal show={showModal} onHide={handleCloseModal} style={{ maxWidth: '1200px', width: '100%'}}>
        <Modal.Header className="film-modal">
          <Modal.Title style={{backgroundColor: 'black', color: 'gold'}}>{selectedFilm?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="film-modal">
          <p>Flim ID: {selectedFilm?.film_id}</p>
          <p>Description: {selectedFilm?.description}</p>
          <p>Release Year: {selectedFilm?.release_year}</p>
          <p>Rental Duration: {selectedFilm?.rental_duration} days</p>
          <p>Rental Rate: ${selectedFilm?.rental_rate}/day</p>
          <p>Film Length: {selectedFilm?.length} minutes</p>
          <p>Film Rating: {selectedFilm?.rating}</p>
          <p>Special Features: {selectedFilm?.special_features}</p>
          <p>Genre: {selectedFilm?.name}</p>

          <h5>Availability of Store 1</h5>
          {selectedFilm?.store1In.total ? (
            <div>
              <p>Total Inventory: {selectedFilm.store1In.total} copies</p>
              <p>Currently Rented: {selectedFilm.store1Out.rented} copies</p>
            </div>
          ) : (
              <p>This store does not have this film in stock.</p>
          )}

          <h5>Availability of Store 2</h5>
          {selectedFilm?.store2In.total ? (
            <div>
              <p>Total Inventory: {selectedFilm.store2In.total} copies</p>
              <p>Currently Rented: {selectedFilm.store2Out.rented} copies</p>
            </div>
          ) : (
              <p>This store does not have this film in stock.</p>
          )}
        </Modal.Body>
        <Modal.Footer style={{backgroundColor: 'black'}}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GetFilms;
