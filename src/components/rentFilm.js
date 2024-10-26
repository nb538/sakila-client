import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProgressBar, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const RentOut = ({ onSuccess }) => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setdata2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filmId, setFilmId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [staffId, setStaffId] = useState("");
  const handleFilmIdChange = (e) => setFilmId(e.target.value);
  const handleCustomerIdChange = (e) => setCustomerId(e.target.value);
  const handleStaffIdChange = (e) => setStaffId(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 100);

      try {
        const response = await axios.get("/api/filminventory");
        setData(response.data);
        const response1 = await axios.get("/api/currentrent");
        setData1(response1.data);
        const response2 = await axios.get("/api/customers");
        setdata2(response2.data);
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          const statusText = err.response.statusText;
          setError(`Error ${status}: ${statusText}, Please try again later.`);
        } else if (err.request) {
          setError(
            "Network error: Unable to reach the server. Please check your network connections."
          );
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    console.log(filmId);
    const availableInventoryIds = data
      .filter((item) => item.film_id === Number(filmId))
      .map((item) => item.inventory_id);
    console.log(availableInventoryIds);

    const rentedInventoryIds = data1.map((item) => item.inventory_id);
    console.log(rentedInventoryIds);

    const availableId = availableInventoryIds.find(
      (id) => !rentedInventoryIds.includes(id)
    );
    console.log(availableId);

    if (!availableId) {
      setError(
        "No available inventory for the input Film ID. " +
          "Bad ID or no copies left."
      );
      return;
    }

    const customerExists = data2.some(
      (item) => item.customer_id === Number(customerId)
    );
    if (!customerExists) {
      setError("This Customer ID does not exist. Please try again.");
      return;
    }

    try {
      const response = await axios.post("/api/rentals", {
        inventory_id: availableId,
        customer_id: customerId,
        staff_id: staffId,
      });

      console.log(response.data);
      setSuccess("Rental successfully recorded!");
      onSuccess();
      setFilmId("");
      setCustomerId("");
      setStaffId("");
      const response1 = await axios.get("/api/currentrent");
      setData1(response1.data);
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const statusText = err.response.statusText;
        setError(`Error ${status}: ${statusText}`);
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  if (loading)
    return (
      <ProgressBar
        striped
        variant="warning"
        animated
        now={progress}
        className="progbar"
      />
    );

  return (
    <div>
      {success && (
        <Alert variant="success" className="rent-alert">
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="rent-alert">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="rent-out-form">
          <Form.Group controlId="filmId" className="rent-film-label">
            <Form.Label>Film ID</Form.Label>
            <Form.Control
              type="text"
              value={filmId}
              onChange={handleFilmIdChange}
              placeholder="Enter Film ID"
              required
            />
          </Form.Group>

          <Form.Group controlId="customerId" className="rent-film-label">
            <Form.Label>Customer ID</Form.Label>
            <Form.Control
              type="text"
              value={customerId}
              onChange={handleCustomerIdChange}
              placeholder="Enter Customer ID"
              required
            />
          </Form.Group>

          <Form.Group controlId="staffId" className="rent-film-label">
            <Form.Label>Staff ID</Form.Label>
            <Form.Select
              value={staffId}
              onChange={handleStaffIdChange}
              required
            >
              <option value="">Select Staff ID</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="rent-film-label">
            Rent Out Film
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RentOut;
