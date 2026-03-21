// import React, { useState } from "react";

// function AddCruise() {
//   const [formData, setFormData] = useState({
//     cruiseName: "",
//     destination: "",
//     price: "",
//     departureDate: "",
//     returnDate: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Cruise Added:", formData);
//   };

//   return (
//     <div className="p-6 bg-white shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Add Cruise</h2>
//       <form onSubmit={handleSubmit} className="grid gap-4">
//         <input
//           type="text"
//           name="cruiseName"
//           placeholder="Cruise Name"
//           value={formData.cruiseName}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="destination"
//           placeholder="Destination"
//           value={formData.destination}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder="Price"
//           value={formData.price}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="date"
//           name="departureDate"
//           value={formData.departureDate}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="date"
//           name="returnDate"
//           value={formData.returnDate}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="file"
//           name="image"
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Add Cruise
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddCruise;

import React, { useState } from "react";
import axios from "axios";

function AddCruise() {
  const [formData, setFormData] = useState({
    cruiseName: "",
    destination: "",
    price: "",
    departureDate: "",
    returnDate: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) fd.append(key, formData[key]);
      });

      await axios.post("http://localhost:9000/api/cruises", fd);

      setMsg("Cruise Added Successfully!");
      setFormData({
        cruiseName: "",
        destination: "",
        price: "",
        departureDate: "",
        returnDate: "",
        image: null,
      });
      setPreview(null);

    } catch (err) {
      setMsg("Failed to add cruise");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white shadow rounded max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Cruise</h2>

      {msg && <p className="text-green-600 mb-3">{msg}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">

        <input
          type="text"
          name="cruiseName"
          placeholder="Cruise Name"
          value={formData.cruiseName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 border rounded object-cover"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Add Cruise"}
        </button>

      </form>
    </div>
  );
}

export default AddCruise;
