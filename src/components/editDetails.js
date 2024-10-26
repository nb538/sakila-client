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

const EditCustomer = ({ customerId, showCanvas, onClose }) => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    district: "",
    postalCode: "",
    phone: "",
  });

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCityId(cityId);

    const selectedCityData = data1.find(
      (city) => city.city_id === Number(cityId)
    );
    setSelectedCountry(selectedCityData ? selectedCityData.country_id : "");
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
        const response = await axios.get("/api/customerdetails");
        const response1 = await axios.get("/api/city");
        const response2 = await axios.get("/api/country");

        setData(response.data);
        setData1(response1.data);
        setData2(response2.data);

        const customer = response.data.find(
          (item) => item.customer_id === Number(customerId)
        );

        if (customer) {
          setFormData({
            firstName: customer.first_name,
            lastName: customer.last_name,
            email: customer.email,
            address: customer.address,
            district: customer.district,
            postalCode: customer.postal_code,
            phone: customer.phone,
          });
          setSelectedCityId(customer.city_id);
          const selectedCity = response1.data.find(
            (city) => city.city_id === customer.city_id
          );
          setSelectedCountry(selectedCity ? selectedCity.country_id : "");
        } else {
          setError("Customer not found.");
        }
      } catch (err) {
        if (err.response) {
          const { status, statusText } = err.response;
          setError(`Error ${status}: ${statusText}. Please try again later.`);
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

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

  if (error) return <p>{error}</p>;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const checkForm =
      Object.values(formData).every((value) => value.trim() !== "") &&
      selectedCityId;

    if (!checkForm) {
      alert("Please fill every field in the form.");
      return;
    }

    try {
      const customer = data.find(
        (item) => item.customer_id === Number(customerId)
      );

      await axios.patch(`/api/address/${customer.address_id}`, {
        address: formData.address,
        district: formData.district,
        postal_code: formData.postalCode,
        phone: formData.phone,
        city_id: selectedCityId,
      });

      await axios.patch(`/api/customer/${customerId}`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      });

      alert("Customer information updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("An error occured while updating the customer.");
    }
  };

  return (
    <div>
      <Offcanvas
        className="custom-offcanvas"
        placement="end"
        scroll={true}
        show={showCanvas}
        onHide={onClose}
        style={{ width: "40%", overflowY: "auto" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit Customer Info</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h5>Please review and edit the customer information.</h5>
          <FloatingLabel
            controlId="floatingInputFirstName"
            label="First Name"
            className="new-customer-label"
          >
            <Form.Control
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
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
              name="lastName"
              value={formData.lastName}
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
              name="postalCode"
              value={formData.postalCode}
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
              {data1.map((city) => (
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
                  ? data2.find(
                      (country) => country.country_id === selectedCountry
                    )?.country || ""
                  : ""
              }
              readOnly
            />
          </FloatingLabel>
          <Button variant="outline-info" onClick={handleSubmit}>
            Commit Customer Edits
          </Button>{" "}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default EditCustomer;
