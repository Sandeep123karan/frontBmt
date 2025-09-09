import React, { useState } from "react";

function AddActivity() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Activity Data: ", formData);
    alert("Activity Added Successfully 🚀");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">➕ Add Activity</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Activity Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter activity name"
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows="3"
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Activity
        </button>
      </form>
    </div>
  );
}

export default AddActivity;
