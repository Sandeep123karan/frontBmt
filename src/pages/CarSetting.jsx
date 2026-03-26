import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CarSetting.css";

const API = "https://bmtadmin.onrender.com/api/admin/car-settings";

function CarSetting() {
  const [form, setForm] = useState({ cityName: "", supplier: "", status: true });
  const [carCities, setCarCities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await axios.get(API);
    setCarCities(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
    } else {
      await axios.post(API, form);
    }
    setForm({ cityName: "", supplier: "", status: true });
    setEditingId(null);
    fetchData();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchData();
  };

  const filtered = carCities.filter((item) =>
    item.cityName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="car-setting">
      <div className="car-setting-header">
        <input
          type="text"
          placeholder="Search City"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setEditingId(null)}>Add Car City</button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="City Name"
          value={form.cityName}
          onChange={(e) => setForm({ ...form, cityName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Supplier"
          value={form.supplier}
          onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          required
        />
        <label>
          Status:
          <input
            type="checkbox"
            checked={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.checked })}
          />
        </label>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item._id}>
              <td>{item.cityName}</td>
              <td>{item.supplier}</td>
              <td>{item.status ? "Active" : "Inactive"}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CarSetting;
