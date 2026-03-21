// src/pages/TrainBookingList.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/train-bookings";

export default function TrainBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const emptyForm = {
    passengerName: "",
    passengerEmail: "",
    phone: "",
    trainNo: "",
    trainName: "",
    fromStation: "",
    toStation: "",
    journeyDate: "",
    travelClass: "Sleeper",
    seats: 1,
    amount: 0,
    status: "Pending",
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // CLEAN fetch function with useCallback (No ESLint error)
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}?page=${page}&limit=${pageSize}&q=${encodeURIComponent(q)}`
      );

      if (res.data.items) {
        setBookings(res.data.items);
        setTotal(res.data.total || 0);
      } else {
        setBookings(res.data);
        setTotal(res.data.length || 0);
      }
    } catch (err) {
      console.error("fetchList:", err.message);
    } finally {
      setLoading(false);
    }
  }, [q, page]);

  // NO ERROR — useEffect clean
  useEffect(() => {
    fetchList();
  }, [fetchList]);


  const handleSearch = () => {
    setPage(1);
    fetchList();
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (booking) => {
    setEditingId(booking._id);
    setForm({
      ...booking,
      journeyDate: booking.journeyDate
        ? booking.journeyDate.split("T")[0]
        : "",
    });
    setModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (payload.journeyDate)
        payload.journeyDate = new Date(payload.journeyDate);

      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
      } else {
        await axios.post(API, payload);
      }

      setModalOpen(false);
      fetchList();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete booking?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchList();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Train Bookings</h2>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search passenger/train..."
            className="border px-3 py-2 rounded"
          />
          <button onClick={handleSearch} className="px-3 py-2 bg-gray-100 rounded">
            Search
          </button>
          <button
            onClick={openCreate}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            New Booking
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Passenger</th>
              <th className="px-3 py-2 text-left">Train</th>
              <th className="px-3 py-2 text-left">Route</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Seats</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && bookings.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-400 text-xl font-semibold">
  🚆 Coming Soon…
</td>
              </tr>
            )}

            {!loading &&
              bookings.map((b) => (
                <tr className="border-t" key={b._id}>
                  <td className="px-3 py-2">{b.passengerName}</td>
                  <td className="px-3 py-2">
                    {b.trainNo} {b.trainName ? "- " + b.trainName : ""}
                  </td>
                  <td className="px-3 py-2">
                    {b.fromStation} → {b.toStation}
                  </td>
                  <td className="px-3 py-2">
                    {b.journeyDate
                      ? new Date(b.journeyDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-3 py-2">{b.seats}</td>
                  <td className="px-3 py-2">₹ {b.amount}</td>
                  <td className="px-3 py-2">{b.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(b)}
                        className="px-2 py-1 border rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="px-2 py-1 border rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-3 border-t flex justify-between items-center">
          <span>
            Showing {Math.min((page - 1) * pageSize + 1, total)} -{" "}
            {Math.min(page * pageSize, total)} of {total}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start p-6">
          <div className="bg-white rounded w-full max-w-2xl p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              {editingId ? "Edit Booking" : "New Booking"}
            </h3>

            <form onSubmit={submitForm} className="grid gap-3">

              {/* NAME + EMAIL */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Passenger Name"
                  value={form.passengerName}
                  onChange={(e) =>
                    setForm({ ...form, passengerName: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="Email"
                  value={form.passengerEmail}
                  onChange={(e) =>
                    setForm({ ...form, passengerEmail: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </div>

              {/* TRAIN */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  required
                  placeholder="Train No"
                  value={form.trainNo}
                  onChange={(e) =>
                    setForm({ ...form, trainNo: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="Train Name"
                  value={form.trainName}
                  onChange={(e) =>
                    setForm({ ...form, trainName: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </div>

              {/* ROUTE */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  required
                  placeholder="From"
                  value={form.fromStation}
                  onChange={(e) =>
                    setForm({ ...form, fromStation: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  required
                  placeholder="To"
                  value={form.toStation}
                  onChange={(e) =>
                    setForm({ ...form, toStation: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  required
                  type="date"
                  value={form.journeyDate}
                  onChange={(e) =>
                    setForm({ ...form, journeyDate: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </div>

              {/* CLASS + SEATS + AMOUNT */}
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={form.travelClass}
                  onChange={(e) =>
                    setForm({ ...form, travelClass: e.target.value })
                  }
                  className="border p-2 rounded"
                >
                  <option>Sleeper</option>
                  <option>3A</option>
                  <option>2A</option>
                  <option>1A</option>
                </select>

                <input
                  type="number"
                  min="1"
                  value={form.seats}
                  onChange={(e) =>
                    setForm({ ...form, seats: Number(e.target.value) })
                  }
                  className="border p-2 rounded"
                />

                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: Number(e.target.value) })
                  }
                  className="border p-2 rounded"
                />
              </div>

              {/* NOTES */}
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                className="border p-2 rounded"
              />

              {/* BTN */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingId ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
