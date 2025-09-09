// src/pages/FlightTopRoute.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FlightTopRoute.css";

function FlightTopRoute() {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    originCode: "",
    destination: "",
    destinationCode: "",
    journeyType: "Oneway",
    departDate: "",
    returnDate: "",
    adult: 1,
    child: 0,
    infant: 0,
    directFlight: true,
  });

  const fetchRoutes = async () => {
    const res = await axios.get("/api/flight-top-routes");
    setRoutes(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/flight-top-routes", formData);
    fetchRoutes();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/flight-top-routes/${id}`);
    fetchRoutes();
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="route-container">
      <div className="route-header">
        <h2>Super Admin Flight Top Routes</h2>
        <div>
          <button onClick={() => setShowForm(!showForm)}>+ Add Flight Top Routes</button>
        </div>
      </div>

      {showForm && (
        <form className="route-form" onSubmit={handleSubmit}>
          <input name="origin" placeholder="Origin" onChange={handleChange} />
          <input name="originCode" placeholder="Origin Code" onChange={handleChange} />
          <input name="destination" placeholder="Destination" onChange={handleChange} />
          <input name="destinationCode" placeholder="Destination Code" onChange={handleChange} />
          <select name="journeyType" onChange={handleChange}>
            <option>Oneway</option>
            <option>Roundtrip</option>
          </select>
          <input type="date" name="departDate" onChange={handleChange} />
          <input type="date" name="returnDate" onChange={handleChange} />
          <input type="number" name="adult" placeholder="Adult" onChange={handleChange} />
          <input type="number" name="child" placeholder="Child" onChange={handleChange} />
          <input type="number" name="infant" placeholder="Infant" onChange={handleChange} />
          <label>
            <input type="checkbox" name="directFlight" checked={formData.directFlight} onChange={handleChange} />
            Direct Flight
          </label>
          <button type="submit">Submit</button>
        </form>
      )}

      <table className="route-table">
        <thead>
          <tr>
            <th>Direct Flight</th>
            <th>Origin</th>
            <th>Origin Code</th>
            <th>Destination</th>
            <th>Destination Code</th>
            <th>Journey</th>
            <th>Depart</th>
            <th>Return</th>
            <th>Adult</th>
            <th>Child</th>
            <th>Infant</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r._id}>
              <td>{r.directFlight ? "True" : "False"}</td>
              <td>{r.origin}</td>
              <td>{r.originCode}</td>
              <td>{r.destination}</td>
              <td>{r.destinationCode}</td>
              <td>{r.journeyType}</td>
              <td>{r.departDate?.slice(0, 10)}</td>
              <td>{r.returnDate?.slice(0, 10)}</td>
              <td>{r.adult}</td>
              <td>{r.child}</td>
              <td>{r.infant}</td>
              <td><button onClick={() => handleDelete(r._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FlightTopRoute;
