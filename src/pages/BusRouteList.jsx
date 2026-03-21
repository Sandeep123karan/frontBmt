// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BusRouteList = () => {
//   const [routes, setRoutes] = useState([]);

//   useEffect(() => {
//     axios.get("/api/bus-routes")
//       .then(res => setRoutes(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div>
//       <h2>Bus Route List</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>From</th><th>To</th><th>Distance</th><th>Duration</th><th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {routes.map(r => (
//             <tr key={r._id}>
//               <td>{r.fromCity}</td>
//               <td>{r.toCity}</td>
//               <td>{r.distance}</td>
//               <td>{r.duration}</td>
//               <td>{r.status ? "Active" : "Inactive"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BusRouteList;
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "/api/bus-routes";
const pageSize = 10;

export default function BusRouteList() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const emptyForm = {
    fromCity: "",
    toCity: "",
    distance: "",
    duration: "",
    status: true,
  };

  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchList = async (search = q, currentPage = page) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}?page=${currentPage}&limit=${pageSize}&q=${encodeURIComponent(search)}`
      );

      setRoutes(res.data.items);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm(item);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
    } else {
      await axios.post(API, form);
    }

    setModalOpen(false);
    fetchList();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;

    await axios.delete(`${API}/${id}`);
    fetchList();
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Bus Routes</h2>

        <div className="flex gap-2">
          <input
            placeholder="Search from/to..."
            className="border px-3 py-2 rounded"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="px-3 py-2 bg-gray-100 rounded"
            onClick={() => fetchList(q, 1)}
          >
            Search
          </button>

          <button
            className="px-3 py-2 bg-blue-600 text-white rounded"
            onClick={openCreate}
          >
            Add Route
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">From</th>
              <th className="p-2 text-left">To</th>
              <th className="p-2 text-left">Distance</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="p-3 text-center" colSpan="6">Loading...</td>
              </tr>
            )}

            {!loading && routes.length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="6">
                  No routes found
                </td>
              </tr>
            )}

            {routes.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.fromCity}</td>
                <td className="p-2">{r.toCity}</td>
                <td className="p-2">{r.distance}</td>
                <td className="p-2">{r.duration}</td>
                <td className="p-2">{r.status ? "Active" : "Inactive"}</td>
                <td className="p-2">
                  <button
                    className="px-2 py-1 border rounded mr-2"
                    onClick={() => openEdit(r)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between p-3 border-t">
          <span>
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1) || fetchList(q, page - 1)}
              className="px-2 py-1 border rounded"
            >
              Prev
            </button>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1) || fetchList(q, page + 1)}
              className="px-2 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center p-6">
          <div className="bg-white p-5 rounded w-full max-w-lg shadow-lg">

            <h3 className="text-lg font-bold mb-3">
              {editingId ? "Edit Route" : "Add New Route"}
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-3">

              <input
                required
                placeholder="From City"
                className="border p-2 rounded"
                value={form.fromCity}
                onChange={(e) => setForm({ ...form, fromCity: e.target.value })}
              />

              <input
                required
                placeholder="To City"
                className="border p-2 rounded"
                value={form.toCity}
                onChange={(e) => setForm({ ...form, toCity: e.target.value })}
              />

              <input
                placeholder="Distance (km)"
                type="number"
                className="border p-2 rounded"
                value={form.distance}
                onChange={(e) => setForm({ ...form, distance: e.target.value })}
              />

              <input
                placeholder="Duration (e.g 5h 30m)"
                className="border p-2 rounded"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />

              <select
                className="border p-2 rounded"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value === "true" })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded"
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
