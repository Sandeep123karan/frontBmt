// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./CarMarkup.css"

// const API = "http://localhost:9000/api/admin/car-markup";

// function CarMarkup() {
//   const [form, setForm] = useState({ name: "", value: "", status: true });
//   const [markups, setMarkups] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const getData = async () => {
//     const res = await axios.get(API);
//     setMarkups(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editingId) {
//       await axios.put(`${API}/${editingId}`, form);
//       setEditingId(null);
//     } else {
//       await axios.post(API, form);
//     }
//     setForm({ name: "", value: "", status: true });
//     getData();
//   };

//   const handleEdit = (item) => {
//     setForm(item);
//     setEditingId(item._id);
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`${API}/${id}`);
//     getData();
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
//       <h2>Car Markup</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Car Type"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         />
//         <input
//           type="number"
//           placeholder="Markup Value"
//           value={form.value}
//           onChange={(e) => setForm({ ...form, value: e.target.value })}
//           required
//         />
//         <button type="submit">{editingId ? "Update" : "Save"}</button>
//       </form>

//       <table border="1" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Value</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {markups.map((m) => (
//             <tr key={m._id}>
//               <td>{m.name}</td>
//               <td>{m.value}</td>
//               <td>{m.status ? "Active" : "Inactive"}</td>
//               <td>
//                 <button onClick={() => handleEdit(m)}>Edit</button>
//                 <button onClick={() => handleDelete(m._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default CarMarkup;

import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/admin/car-markup";

function CarMarkup() {
  const [form, setForm] = useState({ name: "", value: "", status: true });
  const [markups, setMarkups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get(API);
      setMarkups(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(API, form);
      }
      setForm({ name: "", value: "", status: true });
      setShowForm(false);
      getData();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Car Markup List</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "Add Markup"}
        </button>
      </div>

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Car Type"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Markup Value"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.saveBtn}>
            {editingId ? "Update" : "Save"}
          </button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Car Type</th>
            <th style={styles.th}>Value</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {markups.map((m) => (
            <tr key={m._id}>
              <td style={styles.td}>{m.name}</td>
              <td style={styles.td}>{m.value}</td>
              <td style={styles.td}>{m.status ? "Active" : "Inactive"}</td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => handleEdit(m)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(m._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "0px",
    maxWidth: "1200px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
  },
  addBtn: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    flex: 1,
  },
  saveBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#f2f2f2",
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  editBtn: {
    marginRight: "8px",
    backgroundColor: "#ffc107",
    color: "black",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CarMarkup;
