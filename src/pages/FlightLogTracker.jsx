import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FlightLogTracker.css";

function FlightLogTracker() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState({ key: "", value: "", fromDate: "", toDate: "" });
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // FETCH Logs
  const fetchLogs = async () => {
    try {
      const { key, value, fromDate, toDate } = filter;
      const res = await axios.get("/api/flight-logs", {
        params: { key, value, fromDate, toDate, page, limit: 10 },
      });
      setLogs(res.data.logs);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error("❌ Error loading logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filter, page]);

  // HANDLE input change (filter/form)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["key", "value", "fromDate", "toDate"].includes(name)) {
      setFilter({ ...filter, [name]: value });
      setPage(1);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // SUBMIT Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/flight-logs/update/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post("/api/flight-logs/add", form);
      }
      setForm({});
      fetchLogs();
    } catch (err) {
      console.error("❌ Submit error:", err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`/api/flight-logs/delete/${id}`);
      fetchLogs();
    }
  };

  // EDIT
  const handleEdit = (log) => {
    setForm(log);
    setEditId(log._id);
  };

  const clearForm = () => {
    setForm({});
    setEditId(null);
  };

  return (
    <div className="flight-log-container">
      <h2 className="title">✈️ FLIGHT LOG TRACKER</h2>

      {/* Form Section */}
      <form className="form" onSubmit={handleSubmit}>
        <input name="from" value={form.from || ""} placeholder="From" onChange={handleChange} required />
        <input name="to" value={form.to || ""} placeholder="To" onChange={handleChange} required />
        <input name="air" value={form.air || ""} placeholder="Airline Code" onChange={handleChange} />
        <input name="cabin" value={form.cabin || ""} placeholder="Cabin" onChange={handleChange} />
        <input name="obClass" value={form.obClass || ""} placeholder="OB Class" onChange={handleChange} />
        <input name="ibClass" value={form.ibClass || ""} placeholder="IB Class" onChange={handleChange} />
        <input name="adult" type="number" value={form.adult || ""} placeholder="Adults" onChange={handleChange} />
        <input name="child" type="number" value={form.child || ""} placeholder="Children" onChange={handleChange} />
        <input name="infant" type="number" value={form.infant || ""} placeholder="Infants" onChange={handleChange} />
        <input name="total" type="number" value={form.total || ""} placeholder="Total Fare" onChange={handleChange} />
        <input name="departDate" type="date" value={form.departDate || ""} onChange={handleChange} />
        <input name="returnDate" type="date" value={form.returnDate || ""} onChange={handleChange} />
        <input name="ipAddress" value={form.ipAddress || ""} placeholder="IP Address" onChange={handleChange} />
        <input name="requestedTime" value={form.requestedTime || ""} placeholder="Requested Time" onChange={handleChange} />
        <input name="guid" value={form.guid || ""} placeholder="GUID" onChange={handleChange} />
        <button type="submit">{editId ? "Update" : "Add"}</button>
        {editId && <button type="button" onClick={clearForm}>Cancel</button>}
      </form>

      {/* Filter Section */}
      <div className="filters">
        <select name="key" onChange={handleChange} value={filter.key}>
          <option value="">Search by</option>
          <option value="from">From</option>
          <option value="to">To</option>
          <option value="air">Air</option>
          <option value="ipAddress">IP</option>
        </select>
        <input name="value" placeholder="Value" value={filter.value} onChange={handleChange} />
        <input name="fromDate" type="date" value={filter.fromDate} onChange={handleChange} />
        <input name="toDate" type="date" value={filter.toDate} onChange={handleChange} />
        <button onClick={fetchLogs}>Search</button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>From</th><th>To</th><th>Air</th><th>Cabin</th><th>OB</th><th>IB</th>
              <th>Ad</th><th>Ch</th><th>In</th><th>Total</th>
              <th>Depart</th><th>Return</th><th>IP</th><th>ReqTime</th><th>GUID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td>{log.from}</td><td>{log.to}</td><td>{log.air}</td><td>{log.cabin}</td>
                <td>{log.obClass}</td><td>{log.ibClass}</td><td>{log.adult}</td>
                <td>{log.child}</td><td>{log.infant}</td><td>{log.total}</td>
                <td>{log.departDate}</td><td>{log.returnDate}</td>
                <td>{log.ipAddress}</td><td>{log.requestedTime}</td><td>{log.guid}</td>
                <td>
                  <button onClick={() => handleEdit(log)}>✏️</button>
                  <button onClick={() => handleDelete(log._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>⬅ Prev</button>
        <span>Page {page}</span>
        <button disabled={page * 10 >= totalRecords} onClick={() => setPage(p => p + 1)}>Next ➡</button>
      </div>
    </div>
  );
}

export default FlightLogTracker;
