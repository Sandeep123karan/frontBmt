import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HolidayBookingList.css';

function HolidayBookingList() {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    businessType: '',
    searchKey: 'name',
    value: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    refNo: '',
    name: '',
    package: '',
    duration: '',
    travelDate: '',
    bookingStatus: 'Confirmed',
    price: '',
    type: 'B2C',
    assign: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get('/api/holiday-bookings');
    setBookings(res.data);
  };

  const handleFilter = async () => {
    const res = await axios.get('/api/holiday-bookings', {
      params: filters
    });
    setBookings(res.data);
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    const bookingWithDefaults = {
      ...newBooking,
      currency: "INR",
      currencyRate: "1.0",
      createdAt: new Date().toISOString()
    };
    try {
      await axios.post('/api/holiday-bookings', bookingWithDefaults);
      fetchBookings();
      setShowForm(false);
      setNewBooking({
        refNo: '',
        name: '',
        package: '',
        duration: '',
        travelDate: '',
        bookingStatus: 'Confirmed',
        price: '',
        type: 'B2C',
        assign: '',
      });
    } catch (err) {
      alert("Failed to add booking");
    }
  };

  const handleDelete = async (refNo) => {
    try {
      await axios.delete(`/api/holiday-bookings/${refNo}`);
      fetchBookings();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="booking-list-wrapper">
      <div className="header-bar">
        <h2>Holiday Bookings</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Booking"}
        </button>
      </div>

      {showForm && (
        <form className="booking-form" onSubmit={handleAddBooking}>
          {['refNo', 'name', 'package', 'duration', 'travelDate', 'price', 'assign'].map((field) => (
            <input
              key={field}
              type={field === 'travelDate' ? 'date' : 'text'}
              placeholder={field}
              value={newBooking[field]}
              onChange={(e) => setNewBooking({ ...newBooking, [field]: e.target.value })}
              required
            />
          ))}
          <select value={newBooking.type} onChange={(e) => setNewBooking({ ...newBooking, type: e.target.value })}>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
          </select>
          <select value={newBooking.bookingStatus} onChange={(e) => setNewBooking({ ...newBooking, bookingStatus: e.target.value })}>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button type="submit" className="save-btn">Save Booking</button>
        </form>
      )}

      <div className="filter-section">
        <select
          value={filters.businessType}
          onChange={(e) => setFilters({ ...filters, businessType: e.target.value })}
        >
          <option value="">All</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
        </select>

        <select
          value={filters.searchKey}
          onChange={(e) => setFilters({ ...filters, searchKey: e.target.value })}
        >
          <option value="name">Name</option>
          <option value="package">Package</option>
          <option value="refNo">Ref No</option>
        </select>

        <input
          type="text"
          placeholder="Search value"
          value={filters.value}
          onChange={(e) => setFilters({ ...filters, value: e.target.value })}
        />

        <button onClick={handleFilter}>Search</button>
      </div>

      <table className="booking-table">
        <thead>
          <tr>
            <th>Ref No</th>
            <th>Name</th>
            <th>Package</th>
            <th>Duration</th>
            <th>Travel Date</th>
            <th>Status</th>
            <th>Price</th>
            <th>Type</th>
            <th>Assign</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr><td colSpan="10" className="no-data">No bookings found</td></tr>
          ) : (
            bookings.map((booking, idx) => (
              <tr key={idx}>
                <td>{booking.refNo}</td>
                <td>{booking.name}</td>
                <td>{booking.package}</td>
                <td>{booking.duration}</td>
                <td>{booking.travelDate?.slice(0, 10)}</td>
                <td>{booking.bookingStatus}</td>
                <td>₹{booking.price}</td>
                <td>{booking.type}</td>
                <td>{booking.assign}</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(booking.refNo)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HolidayBookingList;
