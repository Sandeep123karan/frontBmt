import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HotelList.css";

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityCode, setCityCode] = useState("PAR"); // default: Paris
  const [error, setError] = useState("");

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://bmt-backend-1-vq3f.onrender.com/api/global-hotels?cityCode=${cityCode}`);
      setHotels(res.data.data); // Amadeus gives data in res.data.data
    } catch (err) {
      setError("Failed to fetch hotels.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [cityCode]);

  return (
    <div className="hotel-list-container">
      <h2>🌍 Global Hotel List</h2>
      <input
        type="text"
        placeholder="Enter city code (e.g. NYC, PAR)"
        value={cityCode}
        onChange={(e) => setCityCode(e.target.value.toUpperCase())}
        className="city-input"
      />

      {loading ? <p>Loading...</p> : null}
      {error && <p className="error">{error}</p>}

      <div className="hotel-table">
        <div className="hotel-row header">
          <span>Name</span>
          <span>City Code</span>
          <span>Hotel Id</span>
        </div>
        {hotels.map((hotel, index) => (
          <div className="hotel-row" key={index}>
            <span>{hotel.name}</span>
            <span>{hotel.cityCode}</span>
            <span>{hotel.hotelId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelList;
