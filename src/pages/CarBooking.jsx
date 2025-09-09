import React, { useEffect, useState } from 'react';
import './CarBooking.css';
import axios from 'axios';

function CarBooking() {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    businessType: '',
    key: '',
    value: '',
    fromDate: '',
    toDate: ''
  });

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/car-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="car-booking-container">
      <div className="filter-bar">
        <select onChange={(e) => setFilters({ ...filters, businessType: e.target.value })}>
          <option value="">Business Type</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
        </select>

        <select onChange={(e) => setFilters({ ...filters, key: e.target.value })}>
          <option value="">Select key to search by</option>
          <option value="refNo">Ref No</option>
          <option value="origin">Origin</option>
          <option value="destination">Destination</option>
        </select>

        <input type="text" placeholder="Value" onChange={(e) => setFilters({ ...filters, value: e.target.value })} />

        <input type="date" onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
        <input type="date" onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />

        <button className="search-btn" onClick={fetchBookings}>SEARCH</button>
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>Ref. No.</th>
            <th>Booking Source</th>
            <th>Inventory By</th>
            <th>Car</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Travel Type</th>
            <th>Journey Date</th>
            <th>Price</th>
            <th>Booking Status</th>
            <th>Payment Status</th>
            <th>Booking Type</th>
            <th>Booking Currency</th>
            <th>Currency Rate</th>
            <th>Assigned</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? bookings.map((booking, i) => (
            <tr key={i}>
              <td>{booking.refNo}</td>
              <td>{booking.source}</td>
              <td>{booking.inventoryBy}</td>
              <td>{booking.car}</td>
              <td>{booking.origin}</td>
              <td>{booking.destination}</td>
              <td>{booking.travelType}</td>
              <td>{new Date(booking.journeyDate).toLocaleDateString()}</td>
              <td>{booking.price}</td>
              <td>{booking.bookingStatus}</td>
              <td>{booking.paymentStatus}</td>
              <td>{booking.bookingType}</td>
              <td>{booking.currency}</td>
              <td>{booking.currencyRate}</td>
              <td>{booking.assigned}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="15">No Booking Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CarBooking;
