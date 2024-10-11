import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Tooltip,
} from "reactstrap";
import { Carousel } from "react-bootstrap";
import Paper from "@mui/material/Paper";
import GetActor from "./components/getActor";
import GetRent from "./components/topRent";
import GetTopStore from "./components/topInStore";
import GetCustomers from "./components/getCustomers";
import GetFilms from "./components/getFilms";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import cinemaImage from "./assets/images/cinema.jpg";
import actorImage from "./assets/images/actors.jpg";
import customerImage from "./assets/images/customer.jpg";
import horse from "./assets/images/horse.png";
import elegant from "./assets/images/elegant.png";

function App() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [collapsed, setCollapsed] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleNavbar = () => setCollapsed(!collapsed);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return (
    <Router>
      <div className="app-container">
        <Navbar className="nav">
          <NavbarBrand
            className="nav-brand"
            href="/"
            id="navbar-brand"
            onMouseEnter={toggleTooltip}
            onMouseLeave={toggleTooltip}
          >
            Sakila Cinemas
          </NavbarBrand>
          <Tooltip
            placement="right"
            id="navbar-tooltip"
            isOpen={tooltipOpen}
            target="navbar-brand"
            toggle={toggleTooltip}
          >
            Return to Home Page
          </Tooltip>
          <img src={elegant} id="elegant" alt="" />
          <NavbarToggler className="nav-toggler" onClick={toggleNavbar} />
          <Collapse isOpen={!collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className="nav-link" href="/films">
                  Films
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" href="/actors">
                  Actors
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" href="/customers">
                  Customers
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="home-carousel">
                  <img src={horse} className="horse" id="horse1" alt="" />
                  <Paper elevation={24}>
                    <Carousel interval={3000}>
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={cinemaImage}
                          alt="First slide"
                        />
                        <Carousel.Caption>
                          <h3>Feel free to peruse our selection!</h3>
                          <p>
                            <Link to="/films" className="carousel-link">
                              Go to Films
                            </Link>
                          </p>
                        </Carousel.Caption>
                      </Carousel.Item>

                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={actorImage}
                          alt="Second slide"
                        />
                        <Carousel.Caption>
                          <h3>Got a favorite celebrity?</h3>
                          <p>
                            <Link to="/actors" className="carousel-link">
                              Go to Actors
                            </Link>
                          </p>
                        </Carousel.Caption>
                      </Carousel.Item>

                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={customerImage}
                          alt="Third slide"
                        />
                        <Carousel.Caption>
                          <h3>See who else likes us!</h3>
                          <p>
                            <Link to="/customers" className="carousel-link">
                              Go to Customers
                            </Link>
                          </p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                  </Paper>
                  <img src={horse} className="horse" id="horse2" alt="" />
                </div>
                <GetRent />
                <GetTopStore />
                <div id="footer">
                  <p>By Nicolas Bermudez</p>
                </div>
              </>
            }
          />

          <Route path="/films" element={<GetFilms />} />

          <Route
            path="/actors"
            element={
              <GetActor
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
              />
            }
          />

          <Route
            path="/customers"
            element={
              <>
                {" "}
                <GetCustomers />{" "}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
