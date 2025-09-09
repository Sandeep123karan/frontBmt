import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FlightTopDestination.css";

export default function FlightTopDestination() {
  const [destinations, setDestinations] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
    destinationName: "",
    title: "",
    price: "",
    shortDescription: "",
    status: "Active",
  });

  const fetchDestinations = async () => {
    const res = await axios.get("/api/flight-top-destinations");
    setDestinations(res.data);
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleAdd = async () => {
    await axios.post("/api/flight-top-destinations", formData);
    setFormVisible(false);
    setFormData({
      image: "",
      destinationName: "",
      title: "",
      price: "",
      shortDescription: "",
      status: "Active",
    });
    fetchDestinations();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    await axios.put("/api/flight-top-destinations/status", { id, status: newStatus });
    fetchDestinations();
  };

  const deleteItem = async (id) => {
    await axios.delete(`/api/flight-top-destinations/${id}`);
    fetchDestinations();
  };

  return (
    <div className="destination-container">
      <h2>Super Admin Flight Top Destinations</h2>

      <div className="top-bar">
        <button className="btn btn-add" onClick={() => setFormVisible(!formVisible)}>
          + Add Flight Top Destination
        </button>
        <button className="btn btn-status">Change Status</button>
        <button className="btn btn-delete" onClick={() => alert("Select row to delete")}>Delete</button>
      </div>

      {formVisible && (
        <div className="form-box">
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <input
            type="text"
            placeholder="Destination Name"
            value={formData.destinationName}
            onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          />
          <button className="btn btn-save" onClick={handleAdd}>Save</button>
        </div>
      )}

      <table className="destination-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Destination Name</th>
            <th>Title</th>
            <th>Price</th>
            <th>Short Description</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Modified At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map((d) => (
            <tr key={d._id}>
              <td><img src={d.image} alt="dest" className="thumb" /></td>
              <td>{d.destinationName}</td>
              <td>{d.title}</td>
              <td>{d.price}</td>
              <td>{d.shortDescription}</td>
              <td>
                <span className={d.status === "Active" ? "status active" : "status inactive"}>
                  {d.status}
                </span>
              </td>
              <td>{new Date(d.createdAt).toLocaleString()}</td>
              <td>{new Date(d.modifiedAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-small"
                  onClick={() => toggleStatus(d._id, d.status)}
                >
                  Toggle
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => deleteItem(d._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}