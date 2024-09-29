import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GetActor from './components/getActor';
import GetRent from './components/topRent';
import GetTopStore from './components/topInStore';
import GetCustomers from './components/getCustomers';
import './App.css';

function App() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  return (
    <Router>
      <div>
        <nav>
          <ul className="navbar">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/actors">Actors</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          {/* Home Route */}
          <Route 
            path="/" 
            element={
              <>
                <GetRent />
                <GetTopStore />
              </>
            } 
          />
          
          {/* Actors Route */}
          <Route 
            path="/actors" 
            element={<GetActor paginationModel={paginationModel} setPaginationModel={setPaginationModel} />} 
          />

          <Route
            path="/customers"
            element={
              <>
                <GetCustomers paginationModel={paginationModel} setPaginationModel={setPaginationModel} />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
