// src/pages/AddHotel.jsx
import React, { useState } from 'react';
import './AddHotel.css';

const AddHotel = () => {
  const [formData, setFormData] = useState({
    hotelName: '',
    city: '',
    propertyType: '',
    amenities: '',
    starRating: '',
    status: 'active',
    reviewUrl: '',
    address: '',
    postalCode: '',
    country: '',
    coordinates: '',
    state: '',
    location: '',
    trending: false,
    idProofRequired: false,
    promotion: false,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://your-backend-api.com/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      alert(data.message || 'Hotel added successfully');
      setFormData({
        hotelName: '', city: '', propertyType: '', amenities: '', starRating: '',
        status: 'active', reviewUrl: '', address: '', postalCode: '', country: '',
        coordinates: '', state: '', location: '', trending: false, idProofRequired: false,
        promotion: false, description: '',
      });
    } catch (error) {
      alert('Error adding hotel');
      console.error(error);
    }
  };

  return (
    <div className="add-hotel-container">
      <h2>Add Hotel</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="hotelName" placeholder="Hotel Name" value={formData.hotelName} onChange={handleChange} required />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input type="text" name="propertyType" placeholder="Property Type" value={formData.propertyType} onChange={handleChange} />
        <input type="text" name="amenities" placeholder="Amenities (comma separated)" value={formData.amenities} onChange={handleChange} />
        <input type="number" name="starRating" placeholder="Star Rating" value={formData.starRating} onChange={handleChange} />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input type="url" name="reviewUrl" placeholder="Review URL" value={formData.reviewUrl} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />
        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
        <input type="text" name="coordinates" placeholder="Coordinates (lat, long)" value={formData.coordinates} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <label><input type="checkbox" name="trending" checked={formData.trending} onChange={handleChange} /> Trending</label>
        <label><input type="checkbox" name="idProofRequired" checked={formData.idProofRequired} onChange={handleChange} /> PAN/Passport Required</label>
        <label><input type="checkbox" name="promotion" checked={formData.promotion} onChange={handleChange} /> Promotion</label>
        <textarea name="description" placeholder="Hotel Description" value={formData.description} onChange={handleChange}></textarea>
        <button type="submit">Save Hotel</button>
      </form>
    </div>
  );
};

export default AddHotel;
