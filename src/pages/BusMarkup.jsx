// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BusMarkup = () => {
//   const [markups, setMarkups] = useState([]);
//   const [form, setForm] = useState({ percentage: "" });

//   useEffect(() => {
//     fetchMarkups();
//   }, []);

//   const fetchMarkups = async () => {
//     const res = await axios.get("/api/bus-markups");
//     setMarkups(res.data);
//   };

//   const addMarkup = async (e) => {
//     e.preventDefault();
//     await axios.post("/api/bus-markups", form);
//     setForm({ percentage: "" });
//     fetchMarkups();
//   };

//   const deleteMarkup = async (id) => {
//     await axios.delete(`/api/bus-markups/${id}`);
//     fetchMarkups();
//   };

//   return (
//     <div>
//       <h2>Bus Markups</h2>
//       <form onSubmit={addMarkup}>
//         <input type="number" placeholder="Percentage" value={form.percentage} onChange={(e) => setForm({ percentage: e.target.value })} />
//         <button type="submit">Add</button>
//       </form>
//       <ul>
//         {markups.map((m) => (
//           <li key={m._id}>
//             {m.percentage}% <button onClick={() => deleteMarkup(m._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BusMarkup;

import React, { useEffect, useState } from "react";
import axios from "axios";

const BusMarkup = () => {
  const [markups, setMarkups] = useState([]);
  const [form, setForm] = useState({ type: "percentage", value: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMarkups();
  }, []);

  const fetchMarkups = async () => {
    const res = await axios.get("http://localhost:9000/api/bus-markups");
    setMarkups(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      type: form.type,
      value: Number(form.value),
    };

    if (editId) {
      await axios.put(`http://localhost:9000/api/bus-markups/${editId}`, payload);
      setEditId(null);
    } else {
      await axios.post("http://localhost:9000/api/bus-markups", payload);
    }

    setForm({ type: "percentage", value: "" });
    fetchMarkups();
  };

  const handleEdit = (m) => {
    setEditId(m._id);
    setForm({ type: m.type, value: m.value });
  };

  const deleteMarkup = async (id) => {
    await axios.delete(`http://localhost:9000/api/bus-markups/${id}`);
    fetchMarkups();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bus Markups</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        
        {/* Type */}
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="percentage">Percentage (%)</option>
          <option value="flat">Flat Price</option>
        </select>
        &nbsp;

        {/* Value */}
        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          required
        />
        &nbsp;

        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      {/* LIST */}
      <ul>
        {markups.map((m) => (
          <li key={m._id} style={{ marginBottom: "10px" }}>
            <strong>{m.type === "percentage" ? m.value + "%" : "₹" + m.value}</strong>

            &nbsp;&nbsp;

            <button onClick={() => handleEdit(m)}>Edit</button>
            &nbsp;
            <button onClick={() => deleteMarkup(m._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusMarkup;
