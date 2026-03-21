
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./HotelList.css";

// function HotelList() {
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch hotels from your own database
//   const fetchHotels = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.get("http://localhost:9000/api/hotels");

//       setHotels(res.data);

//     } catch (err) {
//       console.error(err);
//       setError("❌ Failed to load hotels from database.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   return (
//     <div className="hotel-list-container">
//       <h2>🏨 Saved Hotels List</h2>

//       {/* Loading */}
//       {loading && <p className="loading">⏳ Loading hotels...</p>}

//       {/* Error */}
//       {error && <p className="error">{error}</p>}

//       {/* No Data */}
//       {!loading && hotels.length === 0 && !error && (
//         <p className="no-data">No hotels found in database.</p>
//       )}

//       {/* Table */}
//       {hotels.length > 0 && (
//         <div className="hotel-table">
//           <div className="hotel-row header">
//             <span>Hotel Name</span>
//             <span>City</span>
//             <span>Property Type</span>
//             <span>Star Rating</span>
//             <span>Status</span>
//           </div>

//           {hotels.map((hotel, index) => (
//             <div className="hotel-row" key={index}>
//               <span>{hotel.hotelName || "N/A"}</span>
//               <span>{hotel.city || "-"}</span>
//               <span>{hotel.propertyType || "-"}</span>
//               <span>{hotel.starRating || "0"}</span>
//               <span>{hotel.status || "active"}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default HotelList;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HotelList.css";

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://localhost:9000/api/hotels");
      setHotels(res.data);

    } catch (err) {
      console.error(err);
      setError("❌ Failed to load hotels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="hotel-list-container">
      <h2>🏨 Saved Hotels List</h2>

      {loading && <p className="loading">⏳ Loading hotels...</p>}
      {error && <p className="error">{error}</p>}

      {hotels.length === 0 && !loading && !error && (
        <p className="no-data">No hotels found.</p>
      )}

      {hotels.length > 0 && (
        <div className="hotel-table">

          {/* HEADER */}
          <div className="hotel-row header">
            <span>Hotel Name</span>
            <span>City</span>
            <span>Property Type</span>
            <span>Star Rating</span>
            <span>Status</span>
          </div>

          {/* ROWS */}
          {hotels.map((hotel, index) => (
            <div className="hotel-row" key={index}>
              <span data-label="Hotel Name">{hotel.hotelName}</span>
              <span data-label="City">{hotel.city}</span>
              <span data-label="Property Type">{hotel.propertyType}</span>
              <span data-label="Star Rating">{hotel.starRating}</span>
              <span data-label="Status">{hotel.status}</span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default HotelList;
