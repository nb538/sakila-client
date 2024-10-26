import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  ProgressBar,
  Table,
  Alert,
  Button,
  ButtonGroup,
  Offcanvas,
  FloatingLabel,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const ReturnFilm = ({ customerId, fullname, returnCheck }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [view, setView] = useState("complete");
  const [showAlert, setShowAlert] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedRental, setSelectedRental] = useState({});

  const alertRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 25;
        });
      }, 100);

      try {
        const response = await axios.get("/api/customerhistory");
        setData(response.data);
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          const statusText = err.response.statusText;
          setError(`Error ${status}: ${statusText}, Please try again later.`);
        } else if (err.request) {
          setError(
            "Netwrok error: Unable to reach the server. Please check your network connesctions."
          );
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 770);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setShowAlert(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAlert]);

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
  if (error) return <p>{error}</p>;

  const filteredData = data.filter((entry) => entry.customer_id === customerId);

  const notReturned = filteredData.filter(
    (entry) => entry.return_date === null
  );

  const handleRowClick = (entry) => {
    if (entry.return_date == null) {
      setSelectedRental({
        customer_id: entry.customer_id,
        film_id: entry.film_id,
        rental_id: entry.rental_id,
      });
      setShowAlert(true);
    }
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const displayData = view === "complete" ? filteredData : notReturned;

  const handleCanvasClose = () => setShowCanvas(false);
  const toggleCanvas = () => {
    setShowCanvas((s) => !s);
    if (!showCanvas) {
      setShowAlert(false);
    }
  };

  const handleSubmitReturn = async () => {
    try {
      const returnDate = new Date();
      const formattedDate = returnDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const response = await axios.patch(
        `/api/rentals/${selectedRental.rental_id}`,
        {
          return_date: formattedDate,
        }
      );
      console.log("Return submitted:", response.data);
      const refreshTable = await axios.get("/api/customerhistory");
      setData(refreshTable.data);
      returnCheck();
      setShowCanvas(false);
    } catch (err) {
      console.error("Error submitting return:", err);
      setError("Failed to submit return. Please try again.");
    }
  };

  return (
    <div className="customer-history-table">
      <h1 className="customer-filter-title">Rental History of {fullname}</h1>

      {showAlert && (
        <Alert
          ref={alertRef}
          className="custom-alert"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          <h3>This film has not been returned.</h3>
          <div className="return-button">
            <h5>Would you like to do so now?</h5>
            <Button
              variant="primary"
              onClick={toggleCanvas}
              className="toggel-button"
            >
              Return Film
            </Button>
          </div>
        </Alert>
      )}

      <Offcanvas
        className="custom-offcanvas"
        placement="end"
        scroll={true}
        show={showCanvas}
        onHide={handleCanvasClose}
        style={{ height: "65%", width: "30%", overflowY: "auto" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Film Return Screen</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h5>Is the following information correct?</h5>
          <FloatingLabel
            controlId="floatingInputCustomer"
            label="Customer ID"
            className="return-label"
          >
            <Form.Control
              type="text"
              placeholder="Customer ID"
              value={selectedRental.customer_id || ""}
              readOnly
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInputFilm"
            label="Film ID"
            className="return-label"
          >
            <Form.Control
              type="text"
              placeholder="Film ID"
              value={selectedRental.film_id || ""}
              readOnly
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInputRental"
            label="Rental ID"
            className="return-label"
          >
            <Form.Control
              type="text"
              placeholder="Rental ID"
              value={selectedRental.rental_id || ""}
              readOnly
            />
          </FloatingLabel>
          <Button variant="outline-warning" onClick={handleSubmitReturn}>
            Submit Return
          </Button>{" "}
        </Offcanvas.Body>
      </Offcanvas>

      <ButtonGroup>
        <Button variant="dark" onClick={() => handleViewChange("complete")}>
          Complete History
        </Button>
        <Button variant="danger" onClick={() => handleViewChange("unreturned")}>
          Unreturned Films
        </Button>
      </ButtonGroup>

      <div className="customer-table-division">
        {displayData.length > 0 ? (
          <Table
            striped
            bordered
            hover
            variant="dark"
            className="history-table"
          >
            <thead>
              <tr>
                <th>Film Title</th>
                <th>Rental ID</th>
                <th>Rental Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((entry) => (
                <tr key={entry.rental_id} onClick={() => handleRowClick(entry)}>
                  <td>{entry.title}</td>
                  <td>{entry.rental_id}</td>
                  <td>{entry.rental_date}</td>
                  <td>{entry.return_date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h1 className="customer-filter-title">
            No outstanding rentals for this customer.
          </h1>
        )}
      </div>
    </div>
  );
};

export default ReturnFilm;
