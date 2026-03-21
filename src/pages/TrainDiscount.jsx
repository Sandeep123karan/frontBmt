import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/train-discounts";

export default function TrainDiscountList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const emptyForm = {
    trainNo: "",
    trainName: "",
    classType: "Sleeper",
    discountPercentage: 0,
    maxDiscount: 0,
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchList = async (search = q, p = page) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}?page=${p}&limit=${pageSize}&q=${encodeURIComponent(search)}`
      );

      if (res.data.items) {
        setList(res.data.items);
        setTotal(res.data.total || 0);
      } else {
        setList([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchList(q, 1);
  };

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (d) => {
    setEditId(d._id);
    setForm(d);
    setModal(true);
  };

  const saveForm = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
      } else {
        await axios.post(API, form);
      }
      setModal(false);
      fetchList(q, page);
    } catch (err) {
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      fetchList(q, page);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const goPage = (p) => {
    setPage(p);
    fetchList(q, p);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Train Discounts</h2>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search train no / class..."
            className="border px-3 py-2 rounded"
          />
          <button onClick={handleSearch} className="px-3 py-2 bg-gray-100 rounded">
            Search
          </button>
          <button
            onClick={openCreate}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Add Discount
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Train</th>
              <th className="px-3 py-2 text-left">Class</th>
              <th className="px-3 py-2 text-left">Discount %</th>
              <th className="px-3 py-2 text-left">Max Discount</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && list.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center font-semibold text-gray-500 text-lg"
                >
                   Coming Soon — No Discount Data Added
                </td>
              </tr>
            )}

            {!loading &&
              list.map((d) => (
                <tr key={d._id} className="border-t">
                  <td className="px-3 py-2">
                    {d.trainNo} — {d.trainName}
                  </td>
                  <td className="px-3 py-2">{d.classType}</td>
                  <td className="px-3 py-2">{d.discountPercentage}%</td>
                  <td className="px-3 py-2">₹{d.maxDiscount}</td>
                  <td className="px-3 py-2">{d.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(d)}
                        className="px-2 py-1 border rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
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
        <div className="p-3 border-t flex items-center justify-between">
          <span>
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => goPage(page - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>
            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => goPage(page + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center p-6">
          <div className="bg-white rounded p-5 w-full max-w-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-3">
              {editId ? "Edit Discount" : "Add Discount"}
            </h3>

            <form onSubmit={saveForm} className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Train No"
                  value={form.trainNo}
                  onChange={(e) => setForm({ ...form, trainNo: e.target.value })}
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
              </div>

              <select
                value={form.classType}
                onChange={(e) =>
                  setForm({ ...form, classType: e.target.value })
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
                placeholder="Discount %"
                value={form.discountPercentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountPercentage: Number(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Max Discount"
                value={form.maxDiscount}
                onChange={(e) =>
                  setForm({ ...form, maxDiscount: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 rounded"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editId ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
