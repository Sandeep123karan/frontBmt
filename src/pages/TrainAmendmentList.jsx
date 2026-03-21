// src/pages/TrainAmendmentList.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/train-amendments";

export default function TrainAmendmentList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // Fetch Amendments
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}?page=${page}&limit=${pageSize}&q=${encodeURIComponent(q)}`
      );

      if (res.data.items) {
        setList(res.data.items);
        setTotal(res.data.total);
      } else {
        setList(res.data);
        setTotal(res.data.length);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }, [q, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleSearch = () => {
    setPage(1);
    fetchList();
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Train Amendments</h2>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search amendment..."
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-100 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Passenger</th>
              <th className="px-4 py-2 text-left">Train</th>
              <th className="px-4 py-2 text-left">Old Details</th>
              <th className="px-4 py-2 text-left">New Details</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
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
                  className="p-4 text-center text-xl text-gray-400 font-semibold"
                >
                  🚆 Coming Soon…
                </td>
              </tr>
            )}

            {!loading &&
              list.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="px-4 py-2">{a.passengerName}</td>
                  <td className="px-4 py-2">
                    {a.trainNo} {a.trainName ? "- " + a.trainName : ""}
                  </td>
                  <td className="px-4 py-2">{a.oldInfo}</td>
                  <td className="px-4 py-2">{a.newInfo}</td>
                  <td className="px-4 py-2">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{a.status}</td>
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
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
