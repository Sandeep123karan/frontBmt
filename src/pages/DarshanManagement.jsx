

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = "https://bmtadmin.onrender.com/api/darshans";

// function DarshanManagement() {
//   const [darshans, setDarshans] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [imageFile, setImageFile] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     location: "",
//     date: "",
//     time: "",
//     description: "",
//     price: "",
//     availableSeats: "",
//     status: "active",
//   });

//   /* ================= FETCH ALL ================= */
//   const fetchDarshans = async () => {
//     try {
//       const res = await axios.get(API_URL);
//       console.log("DATA:", res.data);
//       setDarshans(res.data);
//     } catch (err) {
//       console.log("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchDarshans();
//   }, []);

//   /* ================= INPUT CHANGE ================= */
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const sendData = new FormData();

//       sendData.append("name", formData.name);
//       sendData.append("location", formData.location);
//       sendData.append("date", formData.date);
//       sendData.append("time", formData.time);
//       sendData.append("description", formData.description);
//       sendData.append("price", formData.price);
//       sendData.append("availableSeats", formData.availableSeats);
//       sendData.append("status", formData.status);

//       if (imageFile) {
//         sendData.append("image", imageFile);
//       }

//       if (editingId) {
//         await axios.put(`${API_URL}/${editingId}`, sendData);
//         alert("Darshan Updated");
//       } else {
//         await axios.post(API_URL, sendData);
//         alert("Darshan Added Successfully");
//       }

//       // reset
//       setFormData({
//         name: "",
//         location: "",
//         date: "",
//         time: "",
//         description: "",
//         price: "",
//         availableSeats: "",
//         status: "active",
//       });

//       setImageFile(null);
//       setEditingId(null);

//       fetchDarshans(); // refresh table

//     } catch (err) {
//       console.log("Submit error:", err);
//       alert("Error saving darshan");
//     }
//   };

//   /* ================= EDIT ================= */
//   const handleEdit = (d) => {
//     setFormData({
//       name: d.name || "",
//       location: d.location || "",
//       date: d.date ? d.date.split("T")[0] : "",
//       time: d.time || "",
//       description: d.description || "",
//       price: d.price || "",
//       availableSeats: d.availableSeats || "",
//       status: d.status || "active",
//     });
//     setEditingId(d._id);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this darshan?")) return;
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchDarshans();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h2 className="text-3xl font-bold text-center mb-8">🙏 Darshan Management</h2>

//       {/* FORM */}
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-10">
//         <div className="grid md:grid-cols-3 gap-4">

//           <input name="name" placeholder="Darshan Name"
//             value={formData.name} onChange={handleChange}
//             className="border p-3 rounded" required />

//           <input name="location" placeholder="Location"
//             value={formData.location} onChange={handleChange}
//             className="border p-3 rounded" required />

//           <input type="date" name="date"
//             value={formData.date} onChange={handleChange}
//             className="border p-3 rounded" required />

//           <input type="time" name="time"
//             value={formData.time} onChange={handleChange}
//             className="border p-3 rounded" required />

//           <input name="price" placeholder="Price"
//             value={formData.price} onChange={handleChange}
//             className="border p-3 rounded" />

//           <input name="availableSeats" placeholder="Available Seats"
//             value={formData.availableSeats} onChange={handleChange}
//             className="border p-3 rounded" />

//           {/* IMAGE */}
//           <input type="file" accept="image/*"
//             onChange={handleImageChange}
//             className="border p-3 rounded" />

//           <select name="status" value={formData.status}
//             onChange={handleChange} className="border p-3 rounded">
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>

//           <textarea name="description" placeholder="Description"
//             value={formData.description} onChange={handleChange}
//             className="border p-3 rounded md:col-span-3" />
//         </div>

//         <button className="mt-5 bg-blue-600 text-white px-6 py-3 rounded">
//           {editingId ? "Update Darshan" : "Add Darshan"}
//         </button>
//       </form>

//       {/* TABLE */}
//       <div className="overflow-auto">
//         <table className="w-full bg-white shadow rounded-xl">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="w-32 h-auto p-3">Image</th>
//               <th>Name</th>
//               <th>Location</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Price</th>
//               <th>Seats</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {darshans.map((d) => (
//               <tr key={d._id} className="border-t text-center">

//                 <td className="p-2">
//                   {d.image && (
//                     <img 
//   src={d.image}
//   alt=""
//   style={{
//     width: "45px",
//     height: "45px",
//     objectFit: "cover",
//     borderRadius: "6px",
//     margin: "auto"
//   }}
// />

//                   )}
//                 </td>

//                 <td>{d.name}</td>
//                 <td>{d.location}</td>
//                 <td>{new Date(d.date).toLocaleDateString()}</td>
//                 <td>{d.time}</td>
//                 <td>₹{d.price}</td>
//                 <td>{d.availableSeats}</td>

//                 <td>
//                   <span className={`px-2 py-1 rounded text-white text-xs ${
//                     d.status === "active" ? "bg-green-500" : "bg-red-500"
//                   }`}>
//                     {d.status}
//                   </span>
//                 </td>

//                 <td className="space-x-2">
//                   <button onClick={() => handleEdit(d)}
//                     className="bg-yellow-500 text-white px-3 py-1 rounded">
//                     Edit
//                   </button>

//                   <button onClick={() => handleDelete(d._id)}
//                     className="bg-red-600 text-white px-3 py-1 rounded">
//                     Delete
//                   </button>
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default DarshanManagement;




import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://bmtadmin.onrender.com/api/darshans";

function DarshanManagement() {
  const [darshans, setDarshans] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // 🔥 multiple images

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    description: "",
    price: "",
    availableSeats: "",
    status: "active",
  });

  /* ================= FETCH ================= */
  const fetchDarshans = async () => {
    try {
      const res = await axios.get(API_URL);
      setDarshans(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDarshans();
  }, []);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files); // 🔥 multiple
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const sendData = new FormData();

      sendData.append("name", formData.name);
      sendData.append("location", formData.location);
      sendData.append("date", formData.date);
      sendData.append("time", formData.time);
      sendData.append("description", formData.description);
      sendData.append("price", formData.price);
      sendData.append("availableSeats", formData.availableSeats);
      sendData.append("status", formData.status);

      // 🔥 MULTIPLE IMAGE APPEND
      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          sendData.append("images", imageFiles[i]);
        }
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, sendData);
        alert("Darshan Updated");
      } else {
        await axios.post(API_URL, sendData);
        alert("Darshan Added Successfully");
      }

      setFormData({
        name: "",
        location: "",
        date: "",
        time: "",
        description: "",
        price: "",
        availableSeats: "",
        status: "active",
      });

      setImageFiles([]);
      setEditingId(null);
      fetchDarshans();

    } catch (err) {
      console.log(err);
      alert("Error saving darshan");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (d) => {
    setFormData({
      name: d.name || "",
      location: d.location || "",
      date: d.date ? d.date.split("T")[0] : "",
      time: d.time || "",
      description: d.description || "",
      price: d.price || "",
      availableSeats: d.availableSeats || "",
      status: d.status || "active",
    });

    setEditingId(d._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this darshan?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchDarshans();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">🙏 Darshan Management</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="grid md:grid-cols-3 gap-4">

          <input name="name" placeholder="Darshan Name"
            value={formData.name} onChange={handleChange}
            className="border p-3 rounded" required />

          <input name="location" placeholder="Location"
            value={formData.location} onChange={handleChange}
            className="border p-3 rounded" required />

          <input type="date" name="date"
            value={formData.date} onChange={handleChange}
            className="border p-3 rounded" required />

          <input type="time" name="time"
            value={formData.time} onChange={handleChange}
            className="border p-3 rounded" required />

          <input name="price" placeholder="Price"
            value={formData.price} onChange={handleChange}
            className="border p-3 rounded" />

          <input name="availableSeats" placeholder="Available Seats"
            value={formData.availableSeats} onChange={handleChange}
            className="border p-3 rounded" />

          {/* 🔥 MULTIPLE IMAGE */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="border p-3 rounded"
          />

          <select name="status" value={formData.status}
            onChange={handleChange} className="border p-3 rounded">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <textarea name="description" placeholder="Description"
            value={formData.description} onChange={handleChange}
            className="border p-3 rounded md:col-span-3" />
        </div>

        <button className="mt-5 bg-blue-600 text-white px-6 py-3 rounded">
          {editingId ? "Update Darshan" : "Add Darshan"}
        </button>
      </form>

      {/* TABLE */}
      <div className="overflow-auto">
        <table className="w-full bg-white shadow rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Images</th>
              <th>Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {darshans.map((d) => (
              <tr key={d._id} className="border-t text-center">

                {/* 🔥 MULTIPLE IMAGE SHOW */}
                <td className="p-2">
                  <div style={{display:"flex",gap:"5px",justifyContent:"center"}}>
                    {d.images?.map((img,i)=>(
                      <img key={i} src={img}
                        style={{width:"45px",height:"45px",objectFit:"cover",borderRadius:"6px"}}
                      />
                    ))}
                  </div>
                </td>

                <td>{d.name}</td>
                <td>{d.location}</td>
                <td>{new Date(d.date).toLocaleDateString()}</td>
                <td>{d.time}</td>
                <td>₹{d.price}</td>
                <td>{d.availableSeats}</td>

                <td>
                  <span className={`px-2 py-1 rounded text-white text-xs ${
                    d.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {d.status}
                  </span>
                </td>

                <td className="space-x-2">
                  <button onClick={() => handleEdit(d)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>

                  <button onClick={() => handleDelete(d._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded">
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

export default DarshanManagement;
