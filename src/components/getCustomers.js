import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProgressBar, Button, Alert } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid/";
import { TextField } from "@mui/material";
import ReturnFilm from "./returnFilm";
import RentList from "./getRentList";
import ChangeDetails from "./getDetails";
import NewCustomer from "./newCustomer";
import DeleteCustomer from "./deleteCustomer";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const GetCustomers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [returnNotice, setReturnNotice] = useState(null);
  const [changeNotice, setChangeNotice] = useState(null);
  const [filters, setFilters] = useState({
    customer_id: "",
    first_name: "",
    last_name: "",
  });

  const alertRef = useRef(null);

  const [mainPaginationModel, setMainPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [filteredPaginationModel, setFilteredPaginationModel] = useState({
    page: 0,
    pageSize: 3,
  });

  const handleChangeNotice = () => {
    setChangeNotice(Date.now());
    setSelectedCustomerId(null);
    console.log(changeNotice);
  };

  const handleReturnNotice = () => {
    setReturnNotice(Date.now());
    console.log(returnNotice);
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
        const response = await axios.get("/api/customers");
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
    setReturnNotice(Date.now());
  }, [changeNotice]);

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

  function getRowId(row) {
    return row.customer_id;
  }

  const columns = [
    { field: "customer_id", headerName: "Customer ID", flex: 1 },
    { field: "first_name", headerName: "First Name", flex: 2 },
    { field: "last_name", headerName: "Last Name", flex: 2 },
  ];

  const filteredData = data.filter((customer) => {
    return (
      (filters.customer_id === "" ||
        customer.customer_id.toString().includes(filters.customer_id)) &&
      (filters.first_name === "" ||
        customer.first_name
          .toLowerCase()
          .includes(filters.first_name.toLowerCase())) &&
      (filters.last_name === "" ||
        customer.last_name
          .toLowerCase()
          .includes(filters.last_name.toLowerCase()))
    );
  });

  const initialFilteredData =
    filters.customer_id === "" &&
    filters.first_name === "" &&
    filters.last_name === ""
      ? []
      : filteredData;

  const changeHeight = (pageSize) => {
    const rowHeight = 52;
    const footerHeight = 52;
    const height = pageSize * rowHeight + footerHeight + 60;
    return height;
  };

  const handleRowSelection = (ids) => {
    const selectedRowId = ids[0];
    const selectedRow = data.find(
      (customer) => customer.customer_id === selectedRowId
    );
    if (selectedRow) {
      setSelectedCustomerId(selectedRowId);
      setSelectedAddressId(selectedRow.address_id);
      const fullname = `${selectedRow.first_name} ${selectedRow.last_name}`;
      setSelectedCustomerName(fullname);
    }
  };

  const toggleNewCustomer = () => {
    setShowNewCustomer((prev) => !prev);
  };

  const handleDeleteCustomer = () => {
    setShowAlert(true);
  };

  const handleProceedDelete = () => {
    if (selectedCustomerId !== null && selectedAddressId !== null) {
      setShowDeleteModal(true);
    } else {
      alert("Customer ID or Address ID is invalid");
    }
  };

  return (
    <div>
      {showAlert && (
        <Alert
          ref={alertRef}
          className="custom-delete-alert"
          variant="danger"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          <h2>THIS ACTION IS IRREVERSIBLE</h2>
          <div>
            <h4>
              Dismiss the Alert or click outside at any point to cease the
              process
            </h4>
            <h5>Be certain you wish to do this</h5>
            <Button
              variant="danger"
              id="proceed-delete-button"
              className="toggel-button"
              onClick={handleProceedDelete}
            >
              Proceed to Deletion Screen
            </Button>
          </div>
        </Alert>
      )}

      <div className="customer-first-division">
        <div className="customer-list-container">
          <h1 className="customer-title">List of All Recorded Customers</h1>
          <div className="customer-grid-container">
            <DataGrid
              getRowId={getRowId}
              rows={data}
              columns={columns}
              pagination
              paginationModel={mainPaginationModel}
              onPaginationModelChange={setMainPaginationModel}
              pageSizeOptions={[5, 10, 20, 100]}
              className="data-grid"
              sx={{
                width: "85%",
                height: changeHeight(mainPaginationModel.pageSize),
                maxHeight: "500px",
              }}
            />
          </div>
          <div className="customer-buttons">
            <Button
              id="new-customer-button"
              variant="warning"
              onClick={toggleNewCustomer}
            >
              Add New Customer
            </Button>
            <NewCustomer
              showCanvas={showNewCustomer}
              onClose={toggleNewCustomer}
              onChangeNotice={handleChangeNotice}
            />
            <Button
              id="delete-customer-button"
              variant="danger"
              onClick={handleDeleteCustomer}
            >
              Delete Customer
            </Button>
          </div>
        </div>

        {selectedCustomerId && (
          <ChangeDetails customerId={selectedCustomerId} />
        )}
      </div>

      <h1 className="customer-title">Find Someone in Particular</h1>

      <div className="customer-second-division">
        <div className="filter-supercontainer">
          <div className="filter-container">
            <h1 className="customer-filter-title">
              Filter Customers by Following Values:
            </h1>
            <div className="filter-boxes">
              <TextField
                label="Customer ID"
                variant="outlined"
                value={filters.customer_id}
                onChange={(e) =>
                  setFilters({ ...filters, customer_id: e.target.value })
                }
                autoComplete="off"
                className="customer-textfield"
                style={{ marginRight: "16px" }}
              />

              <TextField
                label="First Name"
                variant="outlined"
                value={filters.first_name}
                onChange={(e) =>
                  setFilters({ ...filters, first_name: e.target.value })
                }
                autoComplete="off"
                className="customer-textfield"
                style={{ marginRight: "16px" }}
              />

              <TextField
                label="Last Name"
                variant="outlined"
                value={filters.last_name}
                onChange={(e) =>
                  setFilters({ ...filters, last_name: e.target.value })
                }
                autoComplete="off"
                className="customer-textfield"
                style={{ marginRight: "16px" }}
              />
            </div>
          </div>

          <DataGrid
            getRowId={getRowId}
            rows={initialFilteredData}
            columns={columns}
            pagination
            paginationModel={filteredPaginationModel}
            onPaginationModelChange={setFilteredPaginationModel}
            pageSizeOptions={[3, 6, 9]}
            className="data-grid"
            sx={{
              width: "85%",
              height: changeHeight(filteredPaginationModel.pageSize),
            }}
            onRowSelectionModelChange={handleRowSelection}
          />
        </div>

        {returnNotice && <RentList refresh={returnNotice} />}
      </div>

      <h1 className="customer-title">Customer History Table</h1>
      {selectedCustomerId && (
        <ReturnFilm
          customerId={selectedCustomerId}
          fullname={selectedCustomerName}
          returnCheck={handleReturnNotice}
        />
      )}

      {showDeleteModal && selectedCustomerId && selectedAddressId && (
        <DeleteCustomer
          customerId={selectedCustomerId}
          addressId={selectedAddressId}
          fullname={selectedCustomerName}
          showCanvas={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onChangeNotice={handleChangeNotice}
        />
      )}
    </div>
  );
};

export default GetCustomers;
