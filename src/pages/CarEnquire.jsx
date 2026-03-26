// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './CarEnquire.css';

// function CarEnquire() {
//   const [data, setData] = useState([]);
//   const [filters, setFilters] = useState({
//     key: '',
//     value: '',
//     fromDate: '',
//     toDate: '',
//   });

//   const fetchData = async () => {
//     const { key, value, fromDate, toDate } = filters;
//     const query = new URLSearchParams();

//     if (key) query.append('key', key);
//     if (value) query.append('value', value);
//     if (fromDate) query.append('fromDate', fromDate);
//     if (toDate) query.append('toDate', toDate);

//     const res = await axios.get(`https://bmtadmin.onrender.com/api/car-enquiries?${query}`);
//     setData(res.data);
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`https://bmtadmin.onrender.com/api/car-enquiries/${id}`);
//     fetchData();
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="car-enquire-container">
//       <h2>CAR ENQUIRE LIST</h2>
//       <div className="filter-box">
//         <select value={filters.key} onChange={(e) => setFilters({ ...filters, key: e.target.value })}>
//           <option value="">Please select</option>
//           <option value="name">Name</option>
//           <option value="email">Email</option>
//           <option value="mobile">Mobile</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Value"
//           value={filters.value}
//           onChange={(e) => setFilters({ ...filters, value: e.target.value })}
//         />
//         <input
//           type="date"
//           value={filters.fromDate}
//           onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
//         />
//         <input
//           type="date"
//           value={filters.toDate}
//           onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
//         />
//         <button onClick={fetchData}>SEARCH</button>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Car Name</th><th>Created Date</th><th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.length === 0 ? (
//             <tr><td colSpan="7">No Query Found</td></tr>
//           ) : (
//             data.map((item, index) => (
//               <tr key={item._id}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.email}</td>
//                 <td>{item.mobile}</td>
//                 <td>{item.carName}</td>
//                 <td>{new Date(item.createdAt).toLocaleDateString()}</td>
//                 <td><button onClick={() => handleDelete(item._id)}>Delete</button></td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default CarEnquire;
import React, { useEffect, useState } from "react";
import axios from "axios";

function CarEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState({
    key: "",
    value: "",
    fromDate: "",
    toDate: ""
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    carName: ""
  });

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get("/api/car-enquiries", { params: filters });
      setEnquiries(res.data);
    } catch (err) {
      console.log("Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/car-enquiries/${editingId}`, form);
      } else {
        await axios.post("/api/car-enquiries", form);
      }

      setForm({ name: "", email: "", mobile: "", carName: "" });
      setEditingId(null);

      fetchEnquiries();

    } catch (err) {
      console.log("Submit error:", err);
    }
  };

  // Edit
  const handleEdit = (e) => {
    setEditingId(e._id);
    setForm(e);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;

    try {
      await axios.delete(`/api/car-enquiries/${id}`);
      fetchEnquiries();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="car-enquiry-container">

      {/* Filters */}
      <div className="filter-bar">
        <select onChange={(e) => setFilters({ ...filters, key: e.target.value })}>
          <option value="">Search by</option>
          <option value="name">Name</option>
          <option value="mobile">Mobile</option>
          <option value="carName">Car Name</option>
        </select>

        <input
          type="text"
          placeholder="Value"
          onChange={(e) => setFilters({ ...filters, value: e.target.value })}
        />

        <input type="date" onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
        <input type="date" onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />

        <button onClick={fetchEnquiries}>SEARCH</button>
      </div>

      {/* Add / Edit Form */}
      <form className="enquiry-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile" />
        <input name="carName" value={form.carName} onChange={handleChange} placeholder="Car Name" />

        <button type="submit">
          {editingId ? "UPDATE ENQUIRY" : "ADD ENQUIRY"}
        </button>
      </form>

      {/* Table */}
      <table className="enquiry-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Car Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {enquiries.length > 0 ? (
            enquiries.map((e, i) => (
              <tr key={i}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.mobile}</td>
                <td>{e.carName}</td>
                <td>{new Date(e.createdAt).toLocaleString()}</td>

                <td>
                  <button onClick={() => handleEdit(e)}>Edit</button>
                  <button onClick={() => handleDelete(e._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">No Enquiry Found</td></tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default CarEnquiry;
