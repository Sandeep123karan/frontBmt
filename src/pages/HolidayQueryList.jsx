import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HolidayQueryList.css";

function HolidayQueryList() {
  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    webPartner: "",
    name: "",
    email: "",
    mobile: "",
    travelDate: "",
    travellers: 1,
    nights: 1,
    package: "",
    message: "",
    created: new Date().toLocaleString()
  });

  const fetchData = async () => {
    const res = await axios.get("https://bmtadmin.onrender.com/api/holiday-query");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`https://bmtadmin.onrender.com/api/holiday-query/${editId}`, form);
    } else {
      await axios.post("https://bmtadmin.onrender.com/api/holiday-query", form);
    }
    setForm({
      webPartner: "",
      name: "",
      email: "",
      mobile: "",
      travelDate: "",
      travellers: 1,
      nights: 1,
      package: "",
      message: "",
      created: new Date().toLocaleString()
    });
    setEditId(null);
    setFormVisible(false);
    fetchData();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://bmtadmin.onrender.com/api/holiday-query/${id}`);
    fetchData();
  };

  return (
    <div className="holiday-query-list">
      <h2>Holiday Query List</h2>
      <button className="add-btn" onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? "Close Form" : "Add New Query"}
      </button>

      {formVisible && (
        <div className="query-form">
          <input name="webPartner" placeholder="Web Partner" value={form.webPartner} onChange={handleChange} />
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} />
          <input name="travelDate" placeholder="Travel Date" type="date" value={form.travelDate} onChange={handleChange} />
          <input name="travellers" placeholder="Travellers" type="number" value={form.travellers} onChange={handleChange} />
          <input name="nights" placeholder="Nights" type="number" value={form.nights} onChange={handleChange} />
          <input name="package" placeholder="Package" value={form.package} onChange={handleChange} />
          <input name="message" placeholder="Message" value={form.message} onChange={handleChange} />
          <button onClick={handleSubmit}>{editId ? "Update" : "Save"}</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Web Partner</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Travel Date</th>
            <th>Travellers</th>
            <th>Nights</th>
            <th>Package</th>
            <th>Message</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d._id}>
              <td>{i + 1}</td>
              <td>{d.webPartner}</td>
              <td>{d.name}</td>
              <td>{d.email}</td>
              <td>{d.mobile}</td>
              <td>{d.travelDate}</td>
              <td>{d.travellers}</td>
              <td>{d.nights}</td>
              <td>{d.package}</td>
              <td>{d.message}</td>
              <td>{d.created}</td>
              <td>
                <button onClick={() => handleEdit(d)}>✏️</button>
                <button onClick={() => handleDelete(d._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HolidayQueryList;
