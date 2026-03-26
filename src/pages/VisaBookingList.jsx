// import React, { useState } from "react";

// function VisaBookingList() {
//   // Static dummy data
//   const [bookings] = useState([
//     { id: 1, name: "Rahul Sharma", country: "Dubai", status: "Approved", date: "2025-08-01" },
//     { id: 2, name: "Aman Verma", country: "Singapore", status: "Pending", date: "2025-08-05" },
//     { id: 3, name: "Priya Singh", country: "USA", status: "Rejected", date: "2025-08-10" },
//   ]);

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h2 style={{ fontSize: "22px", marginBottom: "15px" }}>Visa Booking List</h2>

//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           textAlign: "left",
//           marginTop: "10px",
//         }}
//       >
//         <thead>
//           <tr style={{ backgroundColor: "#f2f2f2" }}>
//             <th style={thStyle}>ID</th>
//             <th style={thStyle}>Name</th>
//             <th style={thStyle}>Country</th>
//             <th style={thStyle}>Status</th>
//             <th style={thStyle}>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((b) => (
//             <tr key={b.id} style={{ borderBottom: "1px solid #ddd" }}>
//               <td style={tdStyle}>{b.id}</td>
//               <td style={tdStyle}>{b.name}</td>
//               <td style={tdStyle}>{b.country}</td>
//               <td style={tdStyle}>
//                 <span
//                   style={{
//                     padding: "3px 8px",
//                     borderRadius: "5px",
//                     color: "white",
//                     backgroundColor:
//                       b.status === "Approved"
//                         ? "green"
//                         : b.status === "Pending"
//                         ? "orange"
//                         : "red",
//                   }}
//                 >
//                   {b.status}
//                 </span>
//               </td>
//               <td style={tdStyle}>{b.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// const thStyle = {
//   padding: "10px",
//   borderBottom: "2px solid #ddd",
// };

// const tdStyle = {
//   padding: "10px",
// };

// export default VisaBookingList;
import React, { useState, useEffect } from "react";

function VisaBookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await fetch("https://bmtadmin.onrender.com/api/visaApplications");
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

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
            <th style={thStyle}>Passport</th>
            <th style={thStyle}>Nationality</th>
            <th style={thStyle}>Visa Type</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b, index) => (
            <tr key={b._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{b.fullName}</td>
              <td style={tdStyle}>{b.passportNumber}</td>
              <td style={tdStyle}>{b.nationality}</td>
              <td style={tdStyle}>{b.visaType}</td>

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

              <td style={tdStyle}>
                {new Date(b.createdAt).toLocaleDateString()}
              </td>
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
