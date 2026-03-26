// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BusDiscounts = () => {
//   const [discounts, setDiscounts] = useState([]);
//   const [form, setForm] = useState({ code: "", percentage: "" });

//   useEffect(() => {
//     fetchDiscounts();
//   }, []);

//   const fetchDiscounts = async () => {
//     const res = await axios.get("/api/bus-discounts");
//     setDiscounts(res.data);
//   };

//   const addDiscount = async (e) => {
//     e.preventDefault();
//     await axios.post("/api/bus-discounts", form);
//     setForm({ code: "", percentage: "" });
//     fetchDiscounts();
//   };

//   const deleteDiscount = async (id) => {
//     await axios.delete(`/api/bus-discounts/${id}`);
//     fetchDiscounts();
//   };

//   return (
//     <div>
//       <h2>Bus Discounts</h2>
//       <form onSubmit={addDiscount}>
//         <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
//         <input type="number" placeholder="Percentage" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} />
//         <button type="submit">Add</button>
//       </form>
//       <ul>
//         {discounts.map((d) => (
//           <li key={d._id}>
//             {d.code} - {d.percentage}% <button onClick={() => deleteDiscount(d._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BusDiscounts;
import React, { useEffect, useState } from "react";
import axios from "axios";

const BusDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    expiryDate: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    const res = await axios.get("https://bmtadmin.onrender.com/api/bus-discounts");
    setDiscounts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      expiryDate: form.expiryDate || null,
    };

    if (editId) {
      await axios.put(
        `https://bmtadmin.onrender.com/api/bus-discounts/${editId}`,
        payload
      );
      setEditId(null);
    } else {
      await axios.post("https://bmtadmin.onrender.com/api/bus-discounts", payload);
    }

    setForm({ code: "", type: "percentage", value: "", expiryDate: "" });
    fetchDiscounts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://bmtadmin.onrender.com/api/bus-discounts/${id}`);
    fetchDiscounts();
  };

  const handleEdit = (d) => {
    setEditId(d._id);
    setForm({
      code: d.code,
      type: d.type,
      value: d.value,
      expiryDate: d.expiryDate ? d.expiryDate.slice(0, 10) : "",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bus Discounts</h2>

      {/* Add Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        &nbsp;

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="percentage">Percentage (%)</option>
          <option value="flat">Flat (₹)</option>
        </select>
        &nbsp;

        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          required
        />
        &nbsp;

        <input
          type="date"
          value={form.expiryDate}
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
        />
        &nbsp;

        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      {/* LIST */}
      <ul>
        {discounts.map((d) => (
          <li key={d._id} style={{ marginBottom: "10px" }}>
            <strong>{d.code}</strong> -{" "}
            {d.type === "percentage" ? d.value + "%" : "₹" + d.value} -{" "}
            {d.expiryDate ? d.expiryDate.slice(0, 10) : "No expiry"}

            &nbsp;&nbsp;
            <button onClick={() => handleEdit(d)}>Edit</button>
            &nbsp;
            <button onClick={() => handleDelete(d._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusDiscounts;
