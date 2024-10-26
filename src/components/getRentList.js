import React, { useEffect, useState } from "react";
import axios from "axios";
import { List } from "react-virtualized";
import { ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

const RentList = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 25));
      }, 100);

      try {
        const response = await axios.get("/api/currentrent");
        setData(response.data);
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
        clearInterval(interval);
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

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

  const rowRenderer = ({ key, index, style }) => {
    const item = data[index];
    return (
      <div key={key} style={style} className="rent-list-text">
        {item.title} || {item.customer_id} || {item.rental_id}
      </div>
    );
  };

  return (
    <div className="rentlist">
      <h1 className="customer-filter-title">Outstanding Rentals</h1>
      <h5>Film Title || Customer ID || Rental ID</h5>
      <List
        className="rent-list"
        width={400}
        height={300}
        rowCount={data.length}
        rowHeight={40}
        rowRenderer={rowRenderer}
      />
    </div>
  );
};

export default RentList;
