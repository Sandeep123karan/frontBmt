import React, { useState } from "react";

function VisaBookingList() {
  // Static dummy data
  const [bookings] = useState([
    { id: 1, name: "Rahul Sharma", country: "Dubai", status: "Approved", date: "2025-08-01" },
    { id: 2, name: "Aman Verma", country: "Singapore", status: "Pending", date: "2025-08-05" },
    { id: 3, name: "Priya Singh", country: "USA", status: "Rejected", date: "2025-08-10" },
  ]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "15px" }}>Visa Booking List</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Country</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{b.id}</td>
              <td style={tdStyle}>{b.name}</td>
              <td style={tdStyle}>{b.country}</td>
              <td style={tdStyle}>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "5px",
                    color: "white",
                    backgroundColor:
                      b.status === "Approved"
                        ? "green"
                        : b.status === "Pending"
                        ? "orange"
                        : "red",
                  }}
                >
                  {b.status}
                </span>
              </td>
              <td style={tdStyle}>{b.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "10px",
};

export default VisaBookingList;
