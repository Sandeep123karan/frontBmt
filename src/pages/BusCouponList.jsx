// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BusCoupons = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [form, setForm] = useState({ code: "", value: "" });

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const fetchCoupons = async () => {
//     const res = await axios.get("/api/bus-coupons");
//     setCoupons(res.data);
//   };

//   const addCoupon = async (e) => {
//     e.preventDefault();
//     await axios.post("/api/bus-coupons", form);
//     setForm({ code: "", value: "" });
//     fetchCoupons();
//   };

//   const deleteCoupon = async (id) => {
//     await axios.delete(`/api/bus-coupons/${id}`);
//     fetchCoupons();
//   };

//   return (
//     <div>
//       <h2>Bus Coupons</h2>
//       <form onSubmit={addCoupon}>
//         <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
//         <input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
//         <button type="submit">Add</button>
//       </form>
//       <ul>
//         {coupons.map((c) => (
//           <li key={c._id}>
//             {c.code} - {c.value} <button onClick={() => deleteCoupon(c._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BusCoupons;
import React, { useEffect, useState } from "react";
import axios from "axios";

const BusCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    expiryDate: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const res = await axios.get("https://bmtadmin.onrender.com/api/bus-coupons");
    setCoupons(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code: form.code,
      discount: Number(form.discount),
      expiryDate: form.expiryDate || null,
    };

    if (editId) {
      await axios.put(
        `https://bmtadmin.onrender.com/api/bus-coupons/${editId}`,
        payload
      );
      setEditId(null);
    } else {
      await axios.post("https://bmtadmin.onrender.com/api/bus-coupons", payload);
    }

    setForm({ code: "", discount: "", expiryDate: "" });
    fetchCoupons();
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://bmtadmin.onrender.com/api/bus-coupons/${id}`);
    fetchCoupons();
  };

  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setForm({
      code: coupon.code,
      discount: coupon.discount,
      expiryDate: coupon.expiryDate
        ? coupon.expiryDate.slice(0, 10)
        : "",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bus Coupons</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        &nbsp;

        <input
          type="number"
          placeholder="Discount"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
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
        {coupons.map((c) => (
          <li key={c._id} style={{ marginBottom: "10px" }}>
            <strong>{c.code}</strong> - 
            {c.discount}% - 
            {c.expiryDate ? c.expiryDate.slice(0, 10) : "No Expiry"}

            &nbsp;&nbsp;

            <button onClick={() => handleEdit(c)}>Edit</button>
            &nbsp;
            <button onClick={() => handleDelete(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusCoupons;
