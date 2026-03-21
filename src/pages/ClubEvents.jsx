// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:9000/api",
// });

// export default function ClubEvents() {
//   const [events, setEvents] = useState([]);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     date: "",
//     price: "",
//     status: "Upcoming",
//   });
//   const [editingId, setEditingId] = useState(null);

//   // Fetch all events
//   const fetchEvents = async () => {
//     try {
//       const res = await API.get("/club-events");
//       setEvents(res.data);
//     } catch (err) {
//       console.error("Error fetching events:", err);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // Handle form input
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Save or update event
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await API.put(`/club-events/${editingId}`, form);
//       } else {
//         await API.post("/club-events", form);
//       }
//       setForm({ title: "", description: "", location: "", date: "", price: "", status: "Upcoming" });
//       setEditingId(null);
//       fetchEvents();
//     } catch (err) {
//       console.error("Error saving event:", err);
//     }
//   };

//   // Delete event
//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/club-events/${id}`);
//       fetchEvents();
//     } catch (err) {
//       console.error("Error deleting event:", err);
//     }
//   };

//   // Edit event
//   const handleEdit = (event) => {
//     setForm({
//       title: event.title,
//       description: event.description,
//       location: event.location,
//       date: event.date ? event.date.split("T")[0] : "",
//       price: event.price,
//       status: event.status,
//     });
//     setEditingId(event._id);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Club Events Management</h2>

//       {/* Event Form */}
//       <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="Event Title"
//           required
//         />
//         <input
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Description"
//           required
//         />
//         <input
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//           placeholder="Location"
//           required
//         />
//         <input
//           type="date"
//           name="date"
//           value={form.date}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="number"
//           name="price"
//           value={form.price}
//           onChange={handleChange}
//           placeholder="Price"
//           required
//         />
//         <select name="status" value={form.status} onChange={handleChange}>
//           <option value="Upcoming">Upcoming</option>
//           <option value="Ongoing">Ongoing</option>
//           <option value="Completed">Completed</option>
//         </select>
//         <button type="submit">{editingId ? "Update" : "Add"} Event</button>
//       </form>

//       {/* Events Table */}
//       <table border="1" cellPadding="10" style={{ width: "100%" }}>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Description</th>
//             <th>Location</th>
//             <th>Date</th>
//             <th>Price</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {events.map((ev) => (
//             <tr key={ev._id}>
//               <td>{ev.title}</td>
//               <td>{ev.description}</td>
//               <td>{ev.location}</td>
//               <td>{new Date(ev.date).toLocaleDateString()}</td>
//               <td>₹{ev.price}</td>
//               <td>{ev.status}</td>
//               <td>
//                 <button onClick={() => handleEdit(ev)}>Edit</button>
//                 <button onClick={() => handleDelete(ev._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9000/api",
});

export default function ClubEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    price: "",
    status: "Upcoming",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await API.get("/club-events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save or update event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price), // Ensure price is ALWAYS a number
      };

      if (editingId) {
        await API.put(`/club-events/${editingId}`, payload);
      } else {
        await API.post("/club-events", payload);
      }

      setForm({
        title: "",
        description: "",
        location: "",
        date: "",
        price: "",
        status: "Upcoming",
      });

      setEditingId(null);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    try {
      await API.delete(`/club-events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Edit event
  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date ? event.date.split("T")[0] : "",
      price: event.price,
      status: event.status,
    });
    setEditingId(event._id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Club Events Management</h2>

      {/* Event Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event Title"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">{editingId ? "Update" : "Add"} Event</button>
      </form>

      {/* Events Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map((ev) => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{ev.description}</td>
              <td>{ev.location}</td>
              <td>{new Date(ev.date).toLocaleDateString()}</td>

              {/* FIXED PRICE DISPLAY */}
              <td>{"₹" + (ev.price !== undefined ? ev.price : 0)}</td>

              {/* FIXED STATUS DISPLAY */}
              <td>{ev.status || "Upcoming"}</td>

              <td>
                <button onClick={() => handleEdit(ev)}>Edit</button>
                <button onClick={() => handleDelete(ev._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
