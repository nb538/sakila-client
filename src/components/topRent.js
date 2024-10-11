import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { ProgressBar } from "react-bootstrap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import reel from "../assets/images/reel.png";

const GetRent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

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
        const response = await axios.get("/api/toprent");
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
        }, 500);
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

  const handleTitleClick = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
  };

  const titleFix = (title) => {
    if (!title) return "";
    return title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="table-container">
      <h1 className="table-title">Top 5 Rented Movies of All Time</h1>
      <table id="toprent-table">
        <tbody>
          {data.map((item, index) => (
            <Paper
              elevation={10}
              style={{
                backgroundColor: "black",
                borderRadius: "10px",
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              <tr
                key={item.id}
                onClick={() => handleTitleClick(item)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  {index + 1}. {titleFix(item.title)}{" "}
                  <img src={reel} id="reel-pic" alt="" />
                </td>
              </tr>
            </Paper>
          ))}
        </tbody>
      </table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: "gold", paddingBottom: "10px" }}>
          Movie Details
        </DialogTitle>
        <DialogContent className="toprent-dialog">
          {selectedMovie && (
            <div className="toprent-dialog">
              <p>
                <strong>Title:</strong> {titleFix(selectedMovie.title)}
              </p>
              <p>
                <strong>Times Rented:</strong> {selectedMovie.rented} times
              </p>
              <p>
                <strong>Description:</strong> {selectedMovie.description}
              </p>
              <p>
                <strong>Release Year:</strong> {selectedMovie.release_year}
              </p>
              <p>
                <strong>Rental Duration:</strong>{" "}
                {selectedMovie.rental_duration} days
              </p>
              <p>
                <strong>Rental Rate:</strong> ${selectedMovie.rental_rate}/day
              </p>
              <p>
                <strong>Lenght:</strong> {selectedMovie.length} minutes
              </p>
              <p>
                <strong>Replacement Cost:</strong> $
                {selectedMovie.replacement_cost}
              </p>
              <p>
                <strong>Rating:</strong> {selectedMovie.rating}
              </p>
              <p>
                <strong>Special Features:</strong>{" "}
                {selectedMovie.special_features}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="toprent-dialog">
          <Button onClick={handleClose} color="primary">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GetRent;
