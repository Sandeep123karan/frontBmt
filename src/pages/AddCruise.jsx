import React, { useState } from "react";

function AddCruise() {
  const [formData, setFormData] = useState({
    cruiseName: "",
    destination: "",
    price: "",
    departureDate: "",
    returnDate: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cruise Added:", formData);
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Cruise</h2>
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Cruise
        </button>
      </form>
    </div>
  );
}

export default AddCruise;
