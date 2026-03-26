import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://bmtadmin.onrender.com/api/train-coupons";

export default function TrainCouponList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const emptyForm = {
    code: "",
    discountType: "Flat",
    discountValue: "",
    minAmount: "",
    maxDiscount: "",
    validFrom: "",
    validTill: "",
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
        setTotal(res.data.total);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error(err.message);
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

  const openEdit = (c) => {
    setEditId(c._id);
    setForm({
      ...c,
      validFrom: c.validFrom?.split("T")[0],
      validTill: c.validTill?.split("T")[0],
    });
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

  const remove = async (id) => {
    if (!window.confirm("Delete coupon?")) return;
    await axios.delete(`${API}/${id}`);
    fetchList(q, page);
  };

  const goPage = (p) => {
    setPage(p);
    fetchList(q, p);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Train Coupons</h2>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border px-3 py-2 rounded"
            placeholder="Search coupon code..."
          />
          <button onClick={handleSearch} className="px-3 py-2 bg-gray-100 rounded">
            Search
          </button>
          <button onClick={openCreate} className="px-3 py-2 bg-blue-600 text-white rounded">
            Add Coupon
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Value</th>
              <th className="px-3 py-2 text-left">Valid</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">Loading...</td>
              </tr>
            )}

            {!loading && list.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-lg font-semibold text-gray-500">
                  Coming Soon — No Coupon Added Yet
                </td>
              </tr>
            )}

            {!loading &&
              list.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="px-3 py-2">{c.code}</td>
                  <td className="px-3 py-2">{c.discountType}</td>
                  <td className="px-3 py-2">
                    {c.discountType === "Percentage"
                      ? `${c.discountValue}%`
                      : `₹${c.discountValue}`}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(c.validFrom).toLocaleDateString()} →{" "}
                    {new Date(c.validTill).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{c.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="px-2 py-1 border rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(c._id)}
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
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => goPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
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
              {editId ? "Edit Coupon" : "Create Coupon"}
            </h3>

            <form onSubmit={saveForm} className="grid grid-cols-1 gap-3">
              <input
                required
                placeholder="Coupon Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="border p-2 rounded"
              />

              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="border p-2 rounded"
              >
                <option>Flat</option>
                <option>Percentage</option>
              </select>

              <input
                type="number"
                placeholder="Discount Value"
                value={form.discountValue}
                onChange={(e) =>
                  setForm({ ...form, discountValue: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Minimum Amount"
                value={form.minAmount}
                onChange={(e) =>
                  setForm({ ...form, minAmount: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Max Discount (if Percentage)"
                value={form.maxDiscount}
                onChange={(e) =>
                  setForm({ ...form, maxDiscount: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) =>
                    setForm({ ...form, validFrom: e.target.value })
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  value={form.validTill}
                  onChange={(e) =>
                    setForm({ ...form, validTill: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </div>

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

                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
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
