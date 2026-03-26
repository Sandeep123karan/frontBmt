import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://bmtadmin.onrender.com/api/darshan-bookings";

function AdminDarshanBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(API);
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // delete booking
  const handleDelete = async (id) => {
    if (!window.confirm("Delete booking?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">
        📋 Darshan Bookings (Admin)
      </h2>

      <div className="overflow-auto">
        <table className="w-full bg-white shadow rounded-xl">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Darshan</th>
              <th>Date</th>
              <th>Persons</th>
              <th>Total ₹</th>
              <th>Booked At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="border-t text-center">

                  <td>{b.userName}</td>
                  <td>{b.email}</td>
                  <td>{b.phone}</td>

                  <td>{b.darshanId?.name}</td>
                  <td>
                    {b.darshanId?.date
                      ? new Date(b.darshanId.date).toLocaleDateString()
                      : ""}
                  </td>

                  <td>{b.persons}</td>
                  <td>₹{b.totalPrice}</td>
                  <td>{new Date(b.createdAt).toLocaleString()}</td>

                  <td>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-5 text-center">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default AdminDarshanBookings;
