import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ProgressBar,
  Button,
  Offcanvas,
  FloatingLabel,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const NewCustomer = ({ showCanvas, onClose, onChangeNotice }) => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    district: "",
    postalcode: "",
    phone: "",
    selectedCityId: "",
    selectedCountry: "",
  });

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCityId(cityId);

    const selectedCityData = data.find(
      (city) => city.city_id === Number(cityId)
    );
    if (selectedCityData) {
      setSelectedCountry(selectedCityData.country_id);
      setFormData((prev) => ({
        ...prev,
        selectedCityId: Number(cityId),
        selectedCountry: selectedCityData.country_id,
      }));
    } else {
      setSelectedCountry("");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        const response = await axios.get("/api/city");
        setData(response.data);
        const response1 = await axios.get("/api/country");
        setData1(response1.data);
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
        setTimeout(() => {
          setLoading(false);
        }, 770);
      }
    };

    fetchData();
  }, []);

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

  const submitNewCustomer = async () => {
    const checkForm =
      Object.values(formData).every((value) =>
        typeof value === "string" ? value.trim() !== "" : value !== ""
      ) && selectedCityId;

    if (!checkForm) {
      alert("Please fill every field in the form.");
      return;
    }

    try {
      const addressResponse = await axios.post("/api/address", {
        address: formData.address,
        address2: "",
        district: formData.district,
        city_id: selectedCityId,
        postal_code: formData.postalcode,
        phone: formData.phone,
      });

      const addressId = addressResponse.data.address_id;
      console.log(addressId);

      const customerResponse = await axios.post("/api/customer", {
        store_id: 1,
        first_name: formData.firstname,
        last_name: formData.lastname,
        email: formData.email,
        address_id: Number(addressId),
        active: 1,
      });

      console.log("Customer created successfully:", customerResponse.data);
      onChangeNotice();
      onClose();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return (
    <div>
      <Offcanvas
        className="custom-offcanvas"
        placement="start"
        scroll={true}
        show={showCanvas}
        onHide={onClose}
        style={{ width: "40%", overflowY: "auto" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>New Customer Screen</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h5>Please input the following information.</h5>
          <FloatingLabel
            controlId="floatingInputFirstName"
            label="First Name"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              placeholder="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInputLastName"
            label="Last Name"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              placeholder="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInputEmail"
            label="Email"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInputAddress"
            label="Address"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInputDistrict"
            label="District"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              placeholder="District"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInputPostalCode"
            label="Postal Code"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              placeholder="Postal Code"
              name="postalcode"
              value={formData.postalcode}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInputPhone"
            label="Phone"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingSelectCity"
            label="City"
            className="new-customer-label"
          >
            <Form.Select
              aria-label="City select"
              onChange={handleCityChange}
              value={selectedCityId}
            >
              <option value="">Select a city</option>
              {data.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingSelectCountry"
            label="Country"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              value={
                selectedCountry
                  ? data1.find(
                      (country) => country.country_id === selectedCountry
                    )?.country || ""
                  : ""
              }
              readOnly
            />
          </FloatingLabel>
          <Button variant="outline-warning" onClick={submitNewCustomer}>
            Finalize New Customer
          </Button>{" "}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default NewCustomer;
