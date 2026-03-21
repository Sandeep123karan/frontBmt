// import React, { useState, useEffect } from "react";
// import "./HotelCoupon.css";

// function HotelCoupon() {
//   const [coupons, setCoupons] = useState([]);
//   const [formData, setFormData] = useState({
//     code: "",
//     regionType: "",
//     starRating: "",
//     couponType: "",
//     value: "",
//     maxLimit: "",
//     useLimit: "",
//     expiry: "",
//   });
//   const [search, setSearch] = useState("");

//   const getToken = () => localStorage.getItem("token");

//   useEffect(() => {
//     fetchCoupons();
//   }, []);

//   const fetchCoupons = async () => {
//     try {
//       const res = await fetch("https://your-api-url.com/api/hotel-coupons", {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       const data = await res.json();
//       setCoupons(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAddCoupon = async () => {
//     try {
//       const res = await fetch("https://your-api-url.com/api/hotel-coupon", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify(formData),
//       });
//       if (res.ok) {
//         setFormData({
//           code: "",
//           regionType: "",
//           starRating: "",
//           couponType: "",
//           value: "",
//           maxLimit: "",
//           useLimit: "",
//           expiry: "",
//         });
//         fetchCoupons();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`https://your-api-url.com/api/hotel-coupon/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       fetchCoupons();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleStatusToggle = async (id, status) => {
//     try {
//       await fetch(`https://your-api-url.com/api/hotel-coupon-status/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getToken()}`,
//         },
//         body: JSON.stringify({ status: !status }),
//       });
//       fetchCoupons();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="coupon-container">
//       <h2>Hotel Coupon Management</h2>

//       <div className="coupon-form">
//         {["code", "regionType", "starRating", "couponType", "value", "maxLimit", "useLimit", "expiry"].map((field) => (
//           <input
//             key={field}
//             type={field === "expiry" ? "date" : "text"}
//             placeholder={field}
//             name={field}
//             value={formData[field]}
//             onChange={handleInputChange}
//           />
//         ))}
//         <button onClick={handleAddCoupon}>Add Coupon</button>
//       </div>

//       <input
//         type="text"
//         placeholder="Search by Coupon Code"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="search-input"
//       />

//       <table className="coupon-table">
//         <thead>
//           <tr>
//             <th>Code</th>
//             <th>Region</th>
//             <th>Star</th>
//             <th>Type</th>
//             <th>Value</th>
//             <th>Max</th>
//             <th>Use</th>
//             <th>Expiry</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {coupons
//             .filter((c) => c.code.toLowerCase().includes(search.toLowerCase()))
//             .map((coupon) => (
//               <tr key={coupon._id}>
//                 <td>{coupon.code}</td>
//                 <td>{coupon.regionType}</td>
//                 <td>{coupon.starRating}</td>
//                 <td>{coupon.couponType}</td>
//                 <td>{coupon.value}</td>
//                 <td>{coupon.maxLimit}</td>
//                 <td>{coupon.useLimit}</td>
//                 <td>{coupon.expiry}</td>
//                 <td>
//                   <button
//                     className={coupon.status ? "active" : "inactive"}
//                     onClick={() => handleStatusToggle(coupon._id, coupon.status)}
//                   >
//                     {coupon.status ? "Active" : "Inactive"}
//                   </button>
//                 </td>
//                 <td>
//                   <button className="delete" onClick={() => handleDelete(coupon._id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default HotelCoupon;
import React, { useState, useEffect } from "react";
import "./HotelCoupon.css";

const API = "http://localhost:9000/api/hotel-coupons";

function HotelCoupon() {
  const [coupons, setCoupons] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    regionType: "",
    starRating: "",
    couponType: "",
    value: "",
    maxLimit: "",
    useLimit: "",
    expiry: "",
  });

  const [search, setSearch] = useState("");

  // Fetch all coupons
  const fetchCoupons = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setCoupons(data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Form Input Change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({
      code: "",
      regionType: "",
      starRating: "",
      couponType: "",
      value: "",
      maxLimit: "",
      useLimit: "",
      expiry: "",
    });

    setEditId(null);
    fetchCoupons();
  };

  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setFormData(coupon);
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  const handleToggleStatus = async (id) => {
    await fetch(`${API}/toggle-status/${id}`, { method: "PUT" });
    fetchCoupons();
  };

  return (
    <div className="coupon-container">
      <h2>Hotel Coupon Management</h2>

      {/* FORM */}
      <form className="coupon-form" onSubmit={handleSubmit}>
        {[
          "code",
          "regionType",
          "starRating",
          "couponType",
          "value",
          "maxLimit",
          "useLimit",
          "expiry",
        ].map((field) => (
          <input
            key={field}
            type={field === "expiry" ? "date" : "text"}
            placeholder={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required={field === "code"}
          />
        ))}

        <button type="submit">{editId ? "Update" : "Add Coupon"}</button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by Code"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* TABLE */}
      <table className="coupon-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Region</th>
            <th>Star</th>
            <th>Type</th>
            <th>Value</th>
            <th>Max Limit</th>
            <th>Use Limit</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {coupons
            .filter((c) =>
              c.code.toLowerCase().includes(search.toLowerCase())
            )
            .map((c) => (
              <tr key={c._id}>
                <td>{c.code}</td>
                <td>{c.regionType}</td>
                <td>{c.starRating}</td>
                <td>{c.couponType}</td>
                <td>{c.value}</td>
                <td>{c.maxLimit}</td>
                <td>{c.useLimit}</td>
                <td>{c.expiry}</td>

                <td>
                  <button
                    className={c.status ? "active" : "inactive"}
                    onClick={() => handleToggleStatus(c._id)}
                  >
                    {c.status ? "Active" : "Inactive"}
                  </button>
                </td>

                <td>
                  <button onClick={() => handleEdit(c)}>Edit</button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default HotelCoupon;
