import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FlightQueryList.css";

function FlightQueryList() {
  const [queries, setQueries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchQueries = async (page = 1) => {
    try {
      const res = await axios.get(`/api/flight-queries?page=${page}&limit=${limit}`);
      setQueries(res.data.queries);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Failed to load queries", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      try {
        await axios.delete(`/api/flight-queries/${id}`);
        fetchQueries(page);
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get("/api/flight-queries/export/excel", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "flight_queries.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Export failed");
    }
  };

  useEffect(() => {
    fetchQueries(page);
  }, [page]);

  return (
    <div className="query-container">
      <div className="query-header">
        <h2>Flight Query List</h2>
        <button onClick={handleExport} className="export-btn">Export to Excel</button>
      </div>
      <table className="query-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Web Partner</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>OBClass</th>
            <th>IBClass</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((q, index) => (
            <tr key={q._id}>
              <td>{(page - 1) * limit + index + 1}</td>
              <td>{q.webPartner}</td>
              <td>{q.email}</td>
              <td>{q.mobile}</td>
              <td>{q.obClass}</td>
              <td>{q.ibClass}</td>
              <td>{q.origin}</td>
              <td>{q.destination}</td>
              <td>{q.created}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(q._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
          <button
            key={i + 1}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <p className="total-count">Page {page} of {Math.ceil(total / limit)} | Total {total} records</p>
    </div>
  );
}

export default FlightQueryList;
