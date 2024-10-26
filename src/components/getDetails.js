import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProgressBar, Alert, Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import EditCustomer from "./editDetails";

const ChangeDetails = ({ customerId }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [showEditCanvas, setShowEditCanvas] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 100);

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("/api/customerdetails");
        setCustomerData(response.data);
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          const statusText = err.response.statusText;
          setError(`Error ${status}: ${statusText}, Please try again later.`);
        } else if (err.request) {
          setError("Network error: Unable to reach the server.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (customerData.length > 0 && customerId) {
      const details = customerData.find(
        (customer) => customer.customer_id === customerId
      );
      setCustomerDetails(details);
    } else {
      setCustomerDetails(null);
    }
  }, [customerId, customerData]);

  if (loading) {
    return (
      <ProgressBar
        striped
        variant="warning"
        animated
        now={progress}
        className="progbar"
      />
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const handleEditCustomer = () => {
    setShowEditCanvas(true);
  };

  const handleCloseEditCanvas = () => {
    setShowEditCanvas(false);
  };

  const refreshCustomerData = async () => {
    try {
      const response = await axios.get("/api/customerdetails");
      setCustomerData(response.data);
    } catch (error) {
      console.error("Error refreshing customer data:", error);
    }
  };

  return (
    <div className="customer-details-container">
      <h1 className="customer-filter-title" id="customer-details">
        Customer Information
      </h1>
      {customerDetails ? (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Customer ID</td>
              <td>{customerDetails.customer_id}</td>
            </tr>
            <tr>
              <td>First Name</td>
              <td>{customerDetails.first_name}</td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>{customerDetails.last_name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{customerDetails.email}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{customerDetails.address}</td>
            </tr>
            <tr>
              <td>District</td>
              <td>{customerDetails.district}</td>
            </tr>
            <tr>
              <td>Postal Code</td>
              <td>{customerDetails.postal_code}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{customerDetails.phone}</td>
            </tr>
            <tr>
              <td>City</td>
              <td>{customerDetails.city}</td>
            </tr>
            <tr>
              <td>Country</td>
              <td>{customerDetails.country}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p>Please select a customer to view their details.</p>
      )}

      <Button
        id="edit-customer-button"
        variant="info"
        onClick={handleEditCustomer}
      >
        Edit Customer Details
      </Button>

      <EditCustomer
        customerId={customerId}
        showCanvas={showEditCanvas}
        onClose={() => {
          handleCloseEditCanvas();
          refreshCustomerData();
        }}
      />
    </div>
  );
};

export default ChangeDetails;
