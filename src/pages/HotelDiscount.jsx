// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./HotelDiscount.css";

// function HotelDiscount() {
//   const [data, setData] = useState([]);
//   const [form, setForm] = useState({
//     discountFor: "B2B",
//     agentClass: "",
//     value: "",
//     regionType: "",
//     extraDiscount: "",
//     maxLimit: "",
//     status: "Active"
//   });

//   const fetchData = async () => {
//     const res = await axios.get("/api/hotel-discount");
//     setData(res.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("/api/hotel-discount", {
//       ...form,
//       agentClass: form.agentClass.split(","),
//       regionType: form.regionType.split(",")
//     });
//     setForm({ ...form, value: "", agentClass: "", regionType: "", extraDiscount: "", maxLimit: "" });
//     fetchData();
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`/api/hotel-discount/${id}`);
//     fetchData();
//   };

//   return (
//     <div className="hotel-discount-wrapper">
//       <h2>Hotel Discount</h2>
//       <form onSubmit={handleSubmit} className="hotel-form">
//         <input type="text" placeholder="Agent Class (comma separated)" value={form.agentClass} onChange={(e) => setForm({ ...form, agentClass: e.target.value })} />
//         <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
//         <input type="text" placeholder="Region Type" value={form.regionType} onChange={(e) => setForm({ ...form, regionType: e.target.value })} />
//         <input type="number" placeholder="Extra Discount" value={form.extraDiscount} onChange={(e) => setForm({ ...form, extraDiscount: e.target.value })} />
//         <input type="number" placeholder="Max Limit" value={form.maxLimit} onChange={(e) => setForm({ ...form, maxLimit: e.target.value })} />
//         <button type="submit">Add Discount</button>
//       </form>

//       <table className="discount-table">
//         <thead>
//           <tr>
//             <th>Discount For</th>
//             <th>Agent Class</th>
//             <th>Value</th>
//             <th>Region Type</th>
//             <th>Extra Discount</th>
//             <th>Max Limit</th>
//             <th>Status</th>
//             <th>Created</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((d) => (
//             <tr key={d._id}>
//               <td>{d.discountFor}</td>
//               <td>{d.agentClass.join(", ")}</td>
//               <td>{d.value}</td>
//               <td>{d.regionType.join(", ")}</td>
//               <td>{d.extraDiscount}</td>
//               <td>{d.maxLimit}</td>
//               <td>{d.status}</td>
//               <td>{new Date(d.createdAt).toLocaleString()}</td>
//               <td>
//                 <button onClick={() => handleDelete(d._id)}>❌</button>
//                 {/* You can add edit button here later */}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default HotelDiscount;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HotelDiscount.css";

function HotelDiscount() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    discountFor: "B2B",
    agentClass: "",
    value: "",
    regionType: "",
    extraDiscount: "",
    maxLimit: "",
    status: "Active"
  });

  const fetchData = async () => {
    const res = await axios.get("/api/hotel-discount");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      agentClass: form.agentClass.split(",").map((x) => x.trim()),
      regionType: form.regionType.split(",").map((x) => x.trim()),
    };

    if (editId) {
      await axios.put(`/api/hotel-discount/${editId}`, payload);
    } else {
      await axios.post("/api/hotel-discount", payload);
    }

    setEditId(null);
    setForm({
      discountFor: "B2B",
      agentClass: "",
      value: "",
      regionType: "",
      extraDiscount: "",
      maxLimit: "",
      status: "Active"
    });

    fetchData();
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      ...item,
      agentClass: item.agentClass.join(", "),
      regionType: item.regionType.join(", "),
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/hotel-discount/${id}`);
    fetchData();
  };

  const toggleStatus = async (id) => {
    await axios.put(`/api/hotel-discount/toggle-status/${id}`);
    fetchData();
  };

  return (
    <div className="hotel-discount-wrapper">
      <h2>🏨 Hotel Discount</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="hotel-form">
        <input type="text" placeholder="Agent Class" value={form.agentClass}
               onChange={(e) => setForm({ ...form, agentClass: e.target.value })} />

        <input type="number" placeholder="Value" value={form.value}
               onChange={(e) => setForm({ ...form, value: e.target.value })} required />

        <input type="text" placeholder="Region Type" value={form.regionType}
               onChange={(e) => setForm({ ...form, regionType: e.target.value })} />

        <input type="number" placeholder="Extra Discount" value={form.extraDiscount}
               onChange={(e) => setForm({ ...form, extraDiscount: e.target.value })} />

        <input type="number" placeholder="Max Limit" value={form.maxLimit}
               onChange={(e) => setForm({ ...form, maxLimit: e.target.value })} />

        <button type="submit">{editId ? "Update" : "Add Discount"}</button>
      </form>

      {/* TABLE */}
      <table className="discount-table">
        <thead>
          <tr>
            <th>For</th>
            <th>Agent Class</th>
            <th>Value</th>
            <th>Region</th>
            <th>Extra</th>
            <th>Max Limit</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d) => (
            <tr key={d._id}>
              <td>{d.discountFor}</td>
              <td>{d.agentClass.join(", ")}</td>
              <td>{d.value}</td>
              <td>{d.regionType.join(", ")}</td>
              <td>{d.extraDiscount}</td>
              <td>{d.maxLimit}</td>

              <td>
                <button
                  className={d.status === "Active" ? "active" : "inactive"}
                  onClick={() => toggleStatus(d._id)}
                >
                  {d.status}
                </button>
              </td>

              <td>{new Date(d.createdAt).toLocaleString()}</td>

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

export default HotelDiscount;
