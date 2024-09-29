import React, { useEffect, useState } from 'react'

function App() {

  const [backendData, setBackendData] = useState([])

  useEffect(() => {
    fetch("/api")
    .then(response => response.json())
    .then(data => setBackendData(data));
  }, [])

  return (
    <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Occupation</th>
          </tr>
        </thead>
        <tbody>
          {backendData.map((actor, actor_id) => (
            <tr key={actor_id}>
              <td>{actor_id}</td> {/* Or use user.id if available */}
              <td>{actor.first_name}</td>
              <td>{actor.last_name}</td>
              <td>{actor.last_update}</td>
            </tr>
          ))}
        </tbody>
      </table>
  );
}

export default App