import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProgressBar } from "react-bootstrap";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import "bootstrap/dist/css/bootstrap.min.css";
import mask from "../assets/images/mask.png";

const GetTopStore = () => {
  const [data3, setData3] = useState([]);
  const [data5, setData5] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTop, setSelectedTop] = useState(null);
  const colorPalette = ["gold", "silver", "burlywood", "crimson", "crimson"];

  useEffect(() => {
    const fetchData = async () => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      try {
        const response3 = await axios.get("/api/toprentperactor");
        setData3(response3.data);
        const response5 = await axios.get("/api/topactorall");
        setData5(response5.data);
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
        setLoading(false);
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

  const handleActorClickTop = (actor) => {
    const topFilter = data5.filter((item) => item.actor_id === actor.actor_id);

    setSelectedTop({
      ...actor,
      topInfo: topFilter || {},
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTop(null);
  };

  const titleFix = (title) => {
    if (typeof title !== "string") return "";
    return title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const removeLetters = (str) => {
    const date = new Date(str);
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="table-container">
        <h1 className="table-title">Top 5 Actors of All Time</h1>
        <table id="topactor-table">
          <tbody>
            {data5.map((item, index) => (
              <Paper
                sx={{ backgroundColor: "black", borderRadius: "10px" }}
                elevation={10}
              >
                <tr
                  key={item}
                  onClick={() => handleActorClickTop(item)}
                  style={{
                    backgroundColor: colorPalette[index % colorPalette.length],
                    cursor: "pointer",
                  }}
                >
                  <td>
                    {index + 1}. {titleFix(item.first_name)}{" "}
                    {titleFix(item.last_name)}{" "}
                    <img src={mask} id="mask-pic" alt="" />
                  </td>
                </tr>
              </Paper>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="topactor-dialog-title">
          Actor Details
        </DialogTitle>
        <DialogContent className="topactor-dialog">
          {selectedTop && (
            <div className="topactor-dialog">
              <p>
                <strong>Name:</strong> {titleFix(selectedTop.first_name)}{" "}
                {titleFix(selectedTop.last_name)}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {removeLetters(selectedTop.last_update)}
              </p>
              <p>
                <strong>Films Acted Overall: </strong> {selectedTop.acted}{" "}
                movies
              </p>
              <h3 style={{ color: "gold" }}>Top 5 Rented Films:</h3>
              <ul>
                {data3
                  .filter((item) => item.actor_id === selectedTop.actor_id)
                  .slice(0, 5)
                  .map((film, index) => (
                    <li key={index}>
                      {titleFix(film.title)} -- Times Rented: {film.rented}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions className="topactor-dialog">
          <Button onClick={handleClose} color="primary">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GetTopStore;
