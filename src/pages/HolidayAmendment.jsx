// HolidayAmendment.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HolidayAmendment.css";

function HolidayAmendment() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    referenceNumber: "",
    amendmentId: "",
    amendmentType: "",
    amendmentStatus: "",
    package: "",
    type: "",
    travelDate: "",
    bookingStatus: "",
    adminRemark: "",
    generateBy: "",
    bookingSource: "",
    adminStaff: "",
    created: "",
    summary: ""
  });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/holiday-amendments");
    setData(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`https://bmt-backend-1-vq3f.onrender.com/api/holiday-amendments/${editId}`, form);
    } else {
      await axios.post("https://bmt-backend-1-vq3f.onrender.com/api/holiday-amendments", form);
    }
    setForm({
      referenceNumber: "", amendmentId: "", amendmentType: "", amendmentStatus: "", package: "",
      type: "", travelDate: "", bookingStatus: "", adminRemark: "", generateBy: "", bookingSource: "",
      adminStaff: "", created: "", summary: ""
    });
    setEditId(null);
    fetchData();
  };

  const handleDelete = async id => {
    await axios.delete(`https://bmt-backend-1-vq3f.onrender.com/api/holiday-amendments/${id}`);
    fetchData();
  };

  const handleEdit = item => {
    setForm(item);
    setEditId(item._id);
  };

  return (
    <div className="holiday-amendment">
      <h2>Holiday Amendment List</h2>
      <div className="form-grid">
        {Object.keys(form).map(key => (
          <input
            key={key}
            name={key}
            placeholder={key.replace(/([A-Z])/g, " $1")}
            value={form[key]}
            onChange={handleChange}
          />
        ))}
        <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(form).map(key => (
              <th key={key}>{key.replace(/([A-Z])/g, " $1")}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d._id}>
              {Object.keys(form).map(key => (
                <td key={key}>{d[key]}</td>
              ))}
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

export default HolidayAmendment;
