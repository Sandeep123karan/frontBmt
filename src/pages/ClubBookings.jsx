// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = "http://localhost:9000/api/bookings";

// const ClubBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [form, setForm] = useState({ memberName: "", eventName: "", bookingDate: "", status: "Confirmed" });
//   const [editId, setEditId] = useState(null);

//   const fetchBookings = async () => {
//     const res = await axios.get(API_URL);
//     setBookings(res.data);
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editId) {
//       await axios.put(`${API_URL}/${editId}`, form);
//       setEditId(null);
//     } else {
//       await axios.post(API_URL, form);
//     }
//     setForm({ memberName: "", eventName: "", bookingDate: "", status: "Confirmed" });
//     fetchBookings();
//   };

//   const handleEdit = (booking) => {
//     setForm(booking);
//     setEditId(booking._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Delete booking?")) {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchBookings();
//     }
//   };

//   return (
//     <div style={{ margin: "40px 0" }}>
//       <h2>📑 Bookings</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="memberName" placeholder="Member Name" value={form.memberName} onChange={handleChange} required />
//         <input name="eventName" placeholder="Event Name" value={form.eventName} onChange={handleChange} required />
//         <input type="date" name="bookingDate" value={form.bookingDate} onChange={handleChange} required />
//         <select name="status" value={form.status} onChange={handleChange}>
//           <option value="Confirmed">Confirmed</option>
//           <option value="Pending">Pending</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//         <button type="submit">{editId ? "Update" : "Add"}</button>
//       </form>

//       <table border="1" width="100%" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Member</th><th>Event</th><th>Date</th><th>Status</th><th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((b) => (
//             <tr key={b._id}>
//               <td>{b.memberName}</td><td>{b.eventName}</td><td>{b.bookingDate}</td><td>{b.status}</td>
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
// };

// export default ClubBookings;
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9000/api",
});

const ClubBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    memberId: "",
    eventId: "",
    bookingDate: "",
    status: "Confirmed",
  });

  const [editId, setEditId] = useState(null);

  // Fetch All Bookings
  const fetchBookings = async () => {
    const res = await API.get("/club-bookings");
    setBookings(res.data);
  };

  // Fetch Members for dropdown
  const fetchMembers = async () => {
    const res = await API.get("/club-members");
    setMembers(res.data);
  };

  // Fetch Events for dropdown
  const fetchEvents = async () => {
    const res = await API.get("/club-events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchBookings();
    fetchMembers();
    fetchEvents();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await API.put(`/club-bookings/${editId}`, form);
      setEditId(null);
    } else {
      await API.post("/club-bookings", form);
    }

    setForm({
      memberId: "",
      eventId: "",
      bookingDate: "",
      status: "Confirmed",
    });

    fetchBookings();
  };

  const handleEdit = (b) => {
    setForm({
      memberId: b.memberId?._id || "",
      eventId: b.eventId?._id || "",
      bookingDate: b.bookingDate?.split("T")[0] || "",
      status: b.status,
    });

    setEditId(b._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete booking?")) {
      await API.delete(`/club-bookings/${id}`);
      fetchBookings();
    }
  };

  return (
    <div style={{ margin: "40px 0" }}>
      <h2>📑 Club Bookings</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {/* Member Dropdown */}
        <select
          name="memberId"
          value={form.memberId}
          onChange={handleChange}
          required
        >
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* Event Dropdown */}
        <select
          name="eventId"
          value={form.eventId}
          onChange={handleChange}
          required
        >
          <option value="">Select Event</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title}
            </option>
          ))}
        </select>

        {/* Booking Date */}
        <input
          type="date"
          name="bookingDate"
          value={form.bookingDate}
          onChange={handleChange}
          required
        />

        {/* Status */}
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit">{editId ? "Update" : "Add"} Booking</button>
      </form>

      {/* TABLE */}
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Member</th>
            <th>Event</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.memberId?.name || "N/A"}</td>
              <td>{b.eventId?.title || "N/A"}</td>
              <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
              <td>{b.status}</td>
              <td>
                <button onClick={() => handleEdit(b)}>Edit</button>
                <button onClick={() => handleDelete(b._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubBookings;
