import React, { useState } from "react";

function InsuranceBookings() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customer: "Ravi Kumar",
      policy: "Health Insurance",
      date: "2025-08-20",
      status: "Confirmed",
    },
    {
      id: 2,
      customer: "Anita Sharma",
      policy: "Travel Insurance",
      date: "2025-08-22",
      status: "Pending",
    },
  ]);

  const [formData, setFormData] = useState({
    customer: "",
    policy: "",
    date: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.policy || !formData.date) return;

    setBookings([
      ...bookings,
      { id: bookings.length + 1, ...formData },
    ]);

    setFormData({ customer: "", policy: "", date: "", status: "Pending" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Insurance Bookings</h2>

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg"
      >
        <input
          type="text"
          name="customer"
          placeholder="Customer Name"
          value={formData.customer}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="policy"
          placeholder="Policy Type"
          value={formData.policy}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Booking
        </button>
      </form>

      {/* Bookings Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Policy</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="border p-2">{booking.id}</td>
              <td className="border p-2">{booking.customer}</td>
              <td className="border p-2">{booking.policy}</td>
              <td className="border p-2">{booking.date}</td>
              <td
                className={`border p-2 ${
                  booking.status === "Confirmed"
                    ? "text-green-600 font-bold"
                    : "text-yellow-600 font-semibold"
                }`}
              >
                {booking.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InsuranceBookings;
