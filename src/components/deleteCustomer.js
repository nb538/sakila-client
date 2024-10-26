import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const DeleteCustomer = ({
  customerId,
  addressId,
  fullname,
  showCanvas,
  onClose,
  onChangeNotice,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteCustomer = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.delete("/delete-customer", {
        data: { customer_id: customerId, address_id: addressId },
      });

      console.log(response.data.message);
      onChangeNotice();
    } catch (err) {
      setError(
        "Failed to delete customer: " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      show={showCanvas}
      onHide={onClose}
      centered
      style={{ width: "100%" }}
    >
      <Modal.Header style={{ backgroundColor: "black" }}>
        <Modal.Title style={{ backgroundColor: "black", color: "gold" }}>
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "black", color: "gold" }}>
        <p>Are you sure you want to delete {fullname}?</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "black" }}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteCustomer}
          disabled={loading}
        >
          {loading ? "Deleting..." : "DELETE CUSTOMER"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCustomer;
