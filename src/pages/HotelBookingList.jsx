import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HotelBookingList.css";

function HotelBookingList() {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    key: "",
    value: "",
    fromDate: "",
    toDate: ""
  });

  const fetchBookings = async () => {
    const params = {
      key: filters.key,
      value: filters.value,
      fromDate: filters.fromDate,
      toDate: filters.toDate
    };
    const res = await axios.get("/api/hotel-bookings", { params });
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = () => {
    fetchBookings();
  };

  const resetSearch = () => {
    setFilters({ key: "", value: "", fromDate: "", toDate: "" });
    fetchBookings();
  };

  return (
    <div className="hotel-booking-wrapper">
      <h2>Hotel Booking List</h2>
      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, key: e.target.value })}>
          <option value="">Select key</option>
          <option value="hotelName">Hotel Name</option>
          <option value="destination">Destination</option>
          <option value="refNo">Ref No.</option>
        </select>
        <input
          type="text"
          placeholder="Value"
          value={filters.value}
          onChange={(e) => setFilters({ ...filters, value: e.target.value })}
        />
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        />
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={resetSearch}>Reset</button>
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>Ref No.</th>
            <th>Booking Source</th>
            <th>Hotel Name</th>
            <th>Destination</th>
            <th>Check-in</th>
            <th>Checkout</th>
            <th>Fare</th>
            <th>Pay Status</th>
            <th>Book Status</th>
            <th>CNF No.</th>
            <th>Supplier</th>
            <th>Type</th>
            <th>Currency</th>
            <th>Currency Rate</th>
            <th>Assign User</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.refNo}</td>
                <td>{b.bookingSource}</td>
                <td>{b.hotelName}</td>
                <td>{b.destination}</td>
                <td>{new Date(b.checkinDate).toLocaleDateString()}</td>
                <td>{new Date(b.checkoutDate).toLocaleDateString()}</td>
                <td>{b.fare}</td>
                <td>{b.payStatus}</td>
                <td>{b.bookStatus}</td>
                <td>{b.cnfNumber}</td>
                <td>{b.supplier}</td>
                <td>{b.type}</td>
                <td>{b.bookingCurrency}</td>
                <td>{b.currencyRate}</td>
                <td>{b.assignUser}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="15">No Booking Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HotelBookingList;
