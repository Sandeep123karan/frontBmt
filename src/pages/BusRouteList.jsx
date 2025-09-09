import React, { useEffect, useState } from "react";
import axios from "axios";

const BusRouteList = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    axios.get("/api/bus-routes")
      .then(res => setRoutes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Bus Route List</h2>
      <table>
        <thead>
          <tr>
            <th>From</th><th>To</th><th>Distance</th><th>Duration</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(r => (
            <tr key={r._id}>
              <td>{r.fromCity}</td>
              <td>{r.toCity}</td>
              <td>{r.distance}</td>
              <td>{r.duration}</td>
              <td>{r.status ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusRouteList;
