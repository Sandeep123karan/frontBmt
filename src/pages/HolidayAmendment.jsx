// // HolidayAmendment.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./HolidayAmendment.css";

// function HolidayAmendment() {
//   const [data, setData] = useState([]);
//   const [form, setForm] = useState({
//     referenceNumber: "",
//     amendmentId: "",
//     amendmentType: "",
//     amendmentStatus: "",
//     package: "",
//     type: "",
//     travelDate: "",
//     bookingStatus: "",
//     adminRemark: "",
//     generateBy: "",
//     bookingSource: "",
//     adminStaff: "",
//     created: "",
//     summary: ""
//   });
//   const [editId, setEditId] = useState(null);

//   const fetchData = async () => {
//     const res = await axios.get("http://localhost:9000/api/holiday-amendments");
//     setData(res.data);
//   };

//   useEffect(() => { fetchData(); }, []);

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (editId) {
//       await axios.put(`http://localhost:9000/api/holiday-amendments/${editId}`, form);
//     } else {
//       await axios.post("http://localhost:9000/api/holiday-amendments", form);
//     }
//     setForm({
//       referenceNumber: "", amendmentId: "", amendmentType: "", amendmentStatus: "", package: "",
//       type: "", travelDate: "", bookingStatus: "", adminRemark: "", generateBy: "", bookingSource: "",
//       adminStaff: "", created: "", summary: ""
//     });
//     setEditId(null);
//     fetchData();
//   };

//   const handleDelete = async id => {
//     await axios.delete(`http://localhost:9000/api/holiday-amendments/${id}`);
//     fetchData();
//   };

//   const handleEdit = item => {
//     setForm(item);
//     setEditId(item._id);
//   };

//   return (
//     <div className="holiday-amendment">
//       <h2>Holiday Amendment List</h2>
//       <div className="form-grid">
//         {Object.keys(form).map(key => (
//           <input
//             key={key}
//             name={key}
//             placeholder={key.replace(/([A-Z])/g, " $1")}
//             value={form[key]}
//             onChange={handleChange}
//           />
//         ))}
//         <button onClick={handleSubmit}>{editId ? "Update" : "Add"}</button>
//       </div>

//       <table className="data-table">
//         <thead>
//           <tr>
//             {Object.keys(form).map(key => (
//               <th key={key}>{key.replace(/([A-Z])/g, " $1")}</th>
//             ))}
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((d) => (
//             <tr key={d._id}>
//               {Object.keys(form).map(key => (
//                 <td key={key}>{d[key]}</td>
//               ))}
//               <td>
//                 <button onClick={() => handleEdit(d)}>✏️</button>
//                 <button onClick={() => handleDelete(d._id)}>🗑️</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default HolidayAmendment;
// HolidayAmendment.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HolidayAmendment.css";

function HolidayAmendment() {
  const emptyForm = {
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
  };

  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // Fetch all amendments
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/holiday-amendments");
      setData(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit (Add / Update)
  const handleSubmit = async () => {
    try {
      const safeForm = { ...form };
      delete safeForm._id; // Prevent _id from being sent

      if (editId) {
        await axios.put(
          `http://localhost:9000/api/holiday-amendments/${editId}`,
          safeForm
        );
      } else {
        await axios.post(
          "http://localhost:9000/api/holiday-amendments",
          safeForm
        );
      }

      setForm(emptyForm);
      setEditId(null);
      fetchData();
    } catch (err) {
      console.log("Submit error:", err);
      alert("Error saving amendment");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this amendment?")) return;
    try {
      await axios.delete(`http://localhost:9000/api/holiday-amendments/${id}`);
      fetchData();
    } catch (err) {
      console.log("Delete error:", err);
      alert("Failed to delete");
    }
  };

  // Edit
  const handleEdit = (item) => {
    const { _id, createdAt, updatedAt, __v, ...clean } = item;
    setForm(clean);
    setEditId(item._id);
  };

  return (
    <div className="holiday-amendment">
      <h2>Holiday Amendment List</h2>

      {/* FORM */}
      <div className="form-grid">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key === "travelDate" ? "date" : "text"}
            name={key}
            placeholder={key.replace(/([A-Z])/g, " $1")}
            value={form[key]}
            onChange={handleChange}
          />
        ))}

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(form).map((key) => (
              <th key={key}>{key.replace(/([A-Z])/g, " $1")}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={Object.keys(form).length + 1}>No records found</td>
            </tr>
          ) : (
            data.map((d) => (
              <tr key={d._id}>
                {Object.keys(form).map((key) => (
                  <td key={key}>
                    {key === "travelDate" && d[key]
                      ? d[key].slice(0, 10)
                      : d[key]}
                  </td>
                ))}

                <td>
                  <button onClick={() => handleEdit(d)}>✏️</button>
                  <button onClick={() => handleDelete(d._id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HolidayAmendment;
