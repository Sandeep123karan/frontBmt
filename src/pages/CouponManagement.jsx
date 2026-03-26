import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CouponManagement.css"; // Custom CSS

const API = "https://bmtadmin.onrender.com/api/admin";

function CouponLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API}/coupon-logs`);
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      try {
        await axios.delete(`${API}/coupon-log/${id}`);
        fetchLogs();
      } catch (err) {
        console.error("Failed to delete", err);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="coupon-log-container">
      <h2>Coupon Logs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <div className="coupon-log-table-wrapper">
          <table className="coupon-log-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Booking Ref</th>
                <th>Token</th>
                <th>Service</th>
                <th>Coupon Code</th>
                <th>Coupon Info</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log._id}>
                  <td>{index + 1}</td>
                  <td>{log.bookingReference}</td>
                  <td>{log.token}</td>
                  <td>{log.service}</td>
                  <td>{log.couponCode}</td>
                  <td>{log.couponInfo}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(log._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CouponLog;
