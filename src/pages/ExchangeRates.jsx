import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:9000/api/exchange-rates"; // FIXED URL

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: "",
    fromCurrency: "",
    toCurrency: "",
    rate: "",
    effectiveDate: "",
    active: true,
  });

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRates();
  }, [page, query]);

  // Fetch Rates
  const fetchRates = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${BASE_URL}?page=${page}&limit=${pageSize}&q=${query}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setRates(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Add new rate modal
  const openAdd = () => {
    setIsEditing(false);
    setForm({
      id: "",
      fromCurrency: "",
      toCurrency: "",
      rate: "",
      effectiveDate: "",
      active: true,
    });
    setShowModal(true);
  };

  // Edit modal
  const openEdit = (item) => {
    setIsEditing(true);
    setForm({
      id: item._id,
      fromCurrency: item.fromCurrency,
      toCurrency: item.toCurrency,
      rate: item.rate,
      effectiveDate: item.effectiveDate?.split("T")[0] || "",
      active: item.active,
    });
    setShowModal(true);
  };

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fromCurrency: form.fromCurrency,
        toCurrency: form.toCurrency,
        rate: Number(form.rate),
        effectiveDate: form.effectiveDate,
        active: form.active,
      };

      let url = BASE_URL;
      let method = "POST";

      if (isEditing) {
        url = `${BASE_URL}/${form.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      fetchRates();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchRates();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Exchange Rates</h2>

        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="border rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => setPage(1)}
            className="px-4 py-2 bg-gray-100 rounded"
          >
            Search
          </button>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Add Rate
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">From</th>
              <th className="px-4 py-2 text-left">To</th>
              <th className="px-4 py-2 text-left">Rate</th>
              <th className="px-4 py-2 text-left">Effective Date</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && rates.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No records found
                </td>
              </tr>
            )}

            {!loading &&
              rates.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-2">{r.fromCurrency}</td>
                  <td className="px-4 py-2">{r.toCurrency}</td>
                  <td className="px-4 py-2">{r.rate}</td>
                  <td className="px-4 py-2">
                    {r.effectiveDate?.split("T")[0]}
                  </td>
                  <td className="px-4 py-2">{r.active ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="px-3 py-1 border rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-3 py-1 border rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <span>
            Page {page} of {Math.ceil(total / pageSize)}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">
              {isEditing ? "Edit Rate" : "Add Rate"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">From</label>
                  <input
                    name="fromCurrency"
                    value={form.fromCurrency}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm">To</label>
                  <input
                    name="toCurrency"
                    value={form.toCurrency}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm">Rate</label>
                  <input
                    name="rate"
                    type="number"
                    value={form.rate}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm">Effective Date</label>
                  <input
                    type="date"
                    name="effectiveDate"
                    value={form.effectiveDate}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />
                Active
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  {isEditing ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
