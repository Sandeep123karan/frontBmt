import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CarEnquire.css';

function CarEnquire() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    key: '',
    value: '',
    fromDate: '',
    toDate: '',
  });

  const fetchData = async () => {
    const { key, value, fromDate, toDate } = filters;
    const query = new URLSearchParams();

    if (key) query.append('key', key);
    if (value) query.append('value', value);
    if (fromDate) query.append('fromDate', fromDate);
    if (toDate) query.append('toDate', toDate);

    const res = await axios.get(`https://bmt-backend-1-vq3f.onrender.com/api/car-enquiries?${query}`);
    setData(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://bmt-backend-1-vq3f.onrender.com/api/car-enquiries/${id}`);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="car-enquire-container">
      <h2>CAR ENQUIRE LIST</h2>
      <div className="filter-box">
        <select value={filters.key} onChange={(e) => setFilters({ ...filters, key: e.target.value })}>
          <option value="">Please select</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="mobile">Mobile</option>
        </select>
        <input
          type="text"
          placeholder="Value"
          value={filters.value}
          onChange={(e) => setFilters({ ...filters, value: e.target.value })}
        />
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        />
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        />
        <button onClick={fetchData}>SEARCH</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Car Name</th><th>Created Date</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="7">No Query Found</td></tr>
          ) : (
            data.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.carName}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td><button onClick={() => handleDelete(item._id)}>Delete</button></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CarEnquire;
