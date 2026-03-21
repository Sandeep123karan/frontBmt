// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:9000/api/bus-bookings"; 

// function BusBooking() {
//   const [bookings, setBookings] = useState([]);
//   const [formData, setFormData] = useState({
//     passengerName: "",
//     seatNumber: "",
//     route: "",
//     date: "",
//   });
//   const [editingId, setEditingId] = useState(null);

//   // Fetch all bookings
//   const fetchBookings = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       setBookings(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Submit form (Add or Update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.put(`${API_URL}/${editingId}`, formData);
//         setEditingId(null);
//       } else {
//         await axios.post(API_URL, formData);
//       }
//       setFormData({ passengerName: "", seatNumber: "", route: "", date: "" });
//       fetchBookings();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Edit Booking
//   const handleEdit = (booking) => {
//     setEditingId(booking._id);
//     setFormData({
//       passengerName: booking.passengerName,
//       seatNumber: booking.seatNumber,
//       route: booking.route?._id || "",
//       date: booking.date?.slice(0, 10) || "",
//     });
//   };

//   // Delete Booking
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchBookings();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>🚌 Bus Bookings</h2>

//       {/* Form */}
//       <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//         <input
//           type="text"
//           name="passengerName"
//           placeholder="Passenger Name"
//           value={formData.passengerName}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="seatNumber"
//           placeholder="Seat Number"
//           value={formData.seatNumber}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="route"
//           placeholder="Route ID"
//           value={formData.route}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">{editingId ? "Update" : "Add"} Booking</button>
//       </form>

//       {/* Table */}
//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Passenger Name</th>
//             <th>Seat</th>
//             <th>Route</th>
//             <th>Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((b) => (
//             <tr key={b._id}>
//               <td>{b.passengerName}</td>
//               <td>{b.seatNumber}</td>
//               <td>{b.route?.name || b.route}</td>
//               <td>{new Date(b.date).toLocaleDateString()}</td>
//               <td>
//                 <button onClick={() => handleEdit(b)}>Edit</button>
//                 <button onClick={() => handleDelete(b._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default BusBooking;
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/bus-bookings";
const ROUTE_API = "http://localhost:9000/api/bus-routes";

export default function BusBooking() {
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    passengerName: "",
    seatNumber: "",
    route: "",
    bookingDate: "",
    amount: "",
    status: "booked",
  });

  // Fetch Bookings
  const fetchBookings = async () => {
    const res = await axios.get(API);
    setBookings(res.data);
  };

  // Fetch Routes for dropdown
  const fetchRoutes = async () => {
    const res = await axios.get(ROUTE_API);
    setRoutes(res.data.items ? res.data.items : res.data);
  };

  useEffect(() => {
    fetchBookings();
    fetchRoutes();
  }, []);

  // Handle input
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form, bookingDate: new Date(form.bookingDate) };

    if (editingId) {
      await axios.put(`${API}/${editingId}`, payload);
      setEditingId(null);
    } else {
      await axios.post(API, payload);
    }

    fetchBookings();

    setForm({
      passengerName: "",
      seatNumber: "",
      route: "",
      bookingDate: "",
      amount: "",
      status: "booked",
    });
  };

  // Edit
  const editBooking = (b) => {
    setEditingId(b._id);
    setForm({
      passengerName: b.passengerName,
      seatNumber: b.seatNumber,
      route: b.route?._id || "",
      bookingDate: b.bookingDate?.slice(0, 10),
      amount: b.amount || "",
      status: b.status,
    });
  };

  // Delete
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    await axios.delete(`${API}/${id}`);
    fetchBookings();
  };

  return (
    <div className="p-6">
      <h2 style={{ marginBottom: "20px" }}>🚌 Bus Booking Management</h2>

      {/* Form */}
      <form onSubmit={onSubmit} className="grid gap-2 mb-4" style={{ maxWidth: "400px" }}>
        <input
          name="passengerName"
          placeholder="Passenger Name"
          value={form.passengerName}
          onChange={onChange}
          required
          className="border p-2 rounded"
        />

        <input
          name="seatNumber"
          placeholder="Seat Number"
          value={form.seatNumber}
          onChange={onChange}
          required
          className="border p-2 rounded"
        />

        {/* Route Dropdown */}
        <select
          name="route"
          value={form.route}
          onChange={onChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Route</option>
          {routes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.fromCity} → {r.toCity}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="bookingDate"
          value={form.bookingDate}
          onChange={onChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={onChange}
          className="border p-2 rounded"
        />

        <select name="status" value={form.status} onChange={onChange} className="border p-2 rounded">
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button className="mt-2 bg-blue-600 text-white p-2 rounded">
          {editingId ? "Update Booking" : "Add Booking"}
        </button>
      </form>

      {/* Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Passenger</th>
            <th>Seat</th>
            <th>Route</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.passengerName}</td>
              <td>{b.seatNumber}</td>
              <td>
                {b.route ? `${b.route.fromCity} → ${b.route.toCity}` : "—"}
              </td>
              <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
              <td>₹ {b.amount}</td>
              <td>{b.status}</td>
              <td>
                <button onClick={() => editBooking(b)}>Edit</button>
                <button onClick={() => deleteBooking(b._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
