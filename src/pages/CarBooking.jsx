// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "https://bmtadmin.onrender.com/api/car-bookings";

// function CarBookingAdmin() {

//   const emptyForm = {
//     refNo: "",
//     source: "",
//     inventoryBy: "",
//     car: "",
//     userName: "",
//     mobile: "",
//     email: "",
//     origin: "",
//     destination: "",
//     travelType: "",
//     journeyDate: "",
//     returnDate: "",
//     price: "",
//     totalAmount: "",
//     bookingStatus: "pending",
//     paymentStatus: "pending",
//     bookingType: "",
//     currency: "INR",
//     currencyRate: "",
//     assigned: ""
//   };

//   const [bookings, setBookings] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);

//   // ================= FETCH =================
//   const fetchBookings = async () => {
//     try {
//       const res = await axios.get(API);
//       setBookings(res.data.bookings || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   // ================= CHANGE =================
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (editingId) {
//         await axios.put(`${API}/${editingId}`, form);
//         alert("Booking Updated");
//       } else {
//         await axios.post(API, form);
//         alert("Booking Added");
//       }

//       setForm(emptyForm);
//       setEditingId(null);
//       fetchBookings();

//     } catch (err) {
//       console.log(err);
//       alert("Error saving booking");
//     }
//   };

//   // ================= EDIT =================
//   const handleEdit = (b) => {
//     setEditingId(b._id);

//     setForm({
//       ...b,
//       journeyDate: b.journeyDate ? b.journeyDate.split("T")[0] : "",
//       returnDate: b.returnDate ? b.returnDate.split("T")[0] : ""
//     });

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete booking?")) return;

//     await axios.delete(`${API}/${id}`);
//     fetchBookings();
//   };

//   return (
//     <div style={{ padding: 30, background: "#f4f6f9", minHeight: "100vh" }}>

//       <h2 style={{ marginBottom: 20 }}>🚗 Car Booking Management</h2>

//       {/* ================= FORM ================= */}
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           background: "#fff",
//           padding: 25,
//           borderRadius: 10,
//           boxShadow: "0 0 10px #ccc",
//           marginBottom: 40
//         }}
//       >
//         <h3>{editingId ? "✏️ Update Booking" : "➕ Add Booking"}</h3>

//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(4,1fr)",
//           gap: 12,
//           marginTop: 15
//         }}>
//           {Object.keys(emptyForm).map((key) => (
//             <input
//               key={key}
//               name={key}
//               placeholder={key}
//               value={form[key] || ""}
//               onChange={handleChange}
//               type={
//                 key.includes("Date") ? "date" :
//                 key.toLowerCase().includes("price") ||
//                 key.toLowerCase().includes("amount") ||
//                 key.toLowerCase().includes("rate")
//                   ? "number"
//                   : "text"
//               }
//               style={{
//                 padding: 10,
//                 borderRadius: 6,
//                 border: "1px solid #ccc"
//               }}
//             />
//           ))}
//         </div>

//         <button style={{
//           marginTop: 20,
//           padding: "12px 35px",
//           background: editingId ? "orange" : "green",
//           color: "#fff",
//           border: "none",
//           borderRadius: 6,
//           fontSize: 16,
//           cursor: "pointer"
//         }}>
//           {editingId ? "UPDATE BOOKING" : "ADD BOOKING"}
//         </button>
//       </form>

//       {/* ================= TABLE ================= */}
//       <h3>📋 All Bookings</h3>

//       <div style={{ overflowX: "auto", background: "#fff", padding: 15, borderRadius: 10 }}>
//         <table border="1" cellPadding="8" width="100%">
//           <thead style={{ background: "#eee" }}>
//             <tr>
//               <th>#</th>

//               {/* dynamic headers */}
//               {bookings.length > 0 &&
//                 Object.keys(bookings[0]).map((key) => (
//                   key !== "__v" && (
//                     <th key={key}>{key}</th>
//                   )
//                 ))
//               }

//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {bookings.length > 0 ? bookings.map((b, index) => (
//               <tr key={b._id}>
//                 <td>{index + 1}</td>

//                 {/* dynamic values */}
//                 {Object.keys(b).map((key) => (
//                   key !== "__v" && (
//                     <td key={key}>
//                       {key.includes("Date")
//                         ? b[key] ? new Date(b[key]).toLocaleDateString() : ""
//                         : b[key]}
//                     </td>
//                   )
//                 ))}

//                 <td>
//                   <button
//                     onClick={() => handleEdit(b)}
//                     style={{
//                       marginRight: 5,
//                       background: "orange",
//                       color: "#fff",
//                       padding: "5px 10px",
//                       border: "none"
//                     }}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleDelete(b._id)}
//                     style={{
//                       background: "red",
//                       color: "#fff",
//                       padding: "5px 10px",
//                       border: "none"
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan="30">No bookings found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }

// export default CarBookingAdmin;







import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://bmtadmin.onrender.com/api/car-bookings";

function CarBookingAdmin() {

  const emptyForm = {
    refNo: "",
    source: "",
    inventoryBy: "",
    car: "",
    userName: "",
    mobile: "",
    email: "",
    origin: "",
    destination: "",
    travelType: "",
    journeyDate: "",
    returnDate: "",
    price: "",
    totalAmount: "",
    bookingStatus: "",
    paymentStatus: "",
    bookingType: "",
    currency: "",
    currencyRate: "",
    assigned: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ================= FETCH =================
  const fetchBookings = async () => {
    const res = await axios.get(API);
    setBookings(res.data); // 🔥 tera api direct array bhej rha
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      alert("Updated");
    } else {
      await axios.post(API, form);
      alert("Added");
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchBookings();
  };

  // ================= EDIT =================
  const handleEdit = (b) => {
    setEditingId(b._id);
    setForm({
      ...b,
      journeyDate: b.journeyDate ? b.journeyDate.split("T")[0] : "",
      returnDate: b.returnDate ? b.returnDate.split("T")[0] : ""
    });
    window.scrollTo({ top: 0 });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`${API}/${id}`);
    fetchBookings();
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>🚗 Car Booking Admin</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit}
        style={{ background: "#fff", padding: 20, marginBottom: 40 }}>

        <h3>{editingId ? "Update Booking" : "Add Booking"}</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10
        }}>
          {Object.keys(emptyForm).map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key}
              value={form[key] || ""}
              onChange={handleChange}
              type={
                key.includes("Date") ? "date" :
                key.includes("price") || key.includes("Amount") || key.includes("Rate")
                  ? "number"
                  : "text"
              }
            />
          ))}
        </div>

        <button style={{
          marginTop: 15,
          padding: "10px 25px",
          background: "blue",
          color: "#fff"
        }}>
          {editingId ? "Update" : "Add Booking"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <h3>📋 All Booking Data</h3>

      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="8" width="100%">
          <thead style={{ background: "#eee" }}>
            <tr>
              <th>#</th>

              {/* 🔥 ALL FORM FIELDS SHOW */}
              {Object.keys(emptyForm).map((key) => (
                <th key={key}>{key}</th>
              ))}

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b, i) => (
              <tr key={b._id}>
                <td>{i + 1}</td>

                {/* 🔥 FORM KA SARA DATA TABLE ME */}
                {Object.keys(emptyForm).map((key) => (
                  <td key={key}>
                    {key.includes("Date")
                      ? b[key] ? new Date(b[key]).toLocaleDateString() : ""
                      : b[key]}
                  </td>
                ))}

                <td>
                  <button onClick={() => handleEdit(b)}
                    style={{ background: "orange", color: "#fff", marginRight: 5 }}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(b._id)}
                    style={{ background: "red", color: "#fff" }}>
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CarBookingAdmin;
