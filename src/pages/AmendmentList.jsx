// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./AmendmentList.css"
// export default function AmendmentList() {
//   const [amendments, setAmendments] = useState([]);

//   useEffect(() => {
//     axios.get("/api/flight-amendments/by-date?fromDate=2025-06-01&toDate=2025-06-30")
//       .then(res => setAmendments(res.data))
//       .catch(err => console.error("❌", err));
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Flight Amendments List</h2>
//       <table className="table-auto w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-2 border">Booking Ref</th>
//             <th className="p-2 border">Source</th>
//             <th className="p-2 border">Amendment ID</th>
//             <th className="p-2 border">Type</th>
//             <th className="p-2 border">Status</th>
//             <th className="p-2 border">Journey</th>
//             <th className="p-2 border">Sector</th>
//             <th className="p-2 border">Departure</th>
//             <th className="p-2 border">Airline</th>
//             <th className="p-2 border">PNR</th>
//             <th className="p-2 border">Booking Status</th>
//             <th className="p-2 border">Admin Remark</th>
//             <th className="p-2 border">General Remark</th>
//           </tr>
//         </thead>
//         <tbody>
//           {amendments.map((a, i) => (
//             <tr key={i}>
//               <td className="p-2 border">{a.bookingRefNo}</td>
//               <td className="p-2 border">{a.bookingSource}</td>
//               <td className="p-2 border">{a.amendmentId}</td>
//               <td className="p-2 border">{a.amendmentType}</td>
//               <td className="p-2 border">{a.amendmentStatus}</td>
//               <td className="p-2 border">{a.journeyType}</td>
//               <td className="p-2 border">{a.sector}</td>
//               <td className="p-2 border">{a.departureDate?.slice(0, 10)}</td>
//               <td className="p-2 border">{a.airlineCode}</td>
//               <td className="p-2 border">{a.pnr}</td>
//               <td className="p-2 border">{a.bookingStatus}</td>
//               <td className="p-2 border">{a.adminRemark}</td>
//               <td className="p-2 border">{a.generalRemark}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AmendmentList.css";

export default function AmendmentList() {
  const [amendments, setAmendments] = useState([]);
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: ""
  });

  const [form, setForm] = useState({
    bookingRefNo: "",
    bookingSource: "",
    amendmentId: "",
    amendmentType: "",
    amendmentStatus: "",
    journeyType: "",
    sector: "",
    departureDate: "",
    airlineCode: "",
    pnr: "",
    bookingStatus: "",
    adminRemark: "",
    generalRemark: ""
  });

  // LOAD ALL
  const fetchAmendments = async () => {
    const res = await axios.get("/api/flight-amendments");
    setAmendments(res.data);
  };

  useEffect(() => {
    fetchAmendments();
  }, []);

  // FILTER BY DATE
  const searchByDate = async () => {
    const res = await axios.get("/api/flight-amendments/by-date", {
      params: filters
    });
    setAmendments(res.data);
  };

  const resetFilter = () => {
    setFilters({ fromDate: "", toDate: "" });
    fetchAmendments();
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      ...item,
      departureDate: item.departureDate?.slice(0, 10)
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`/api/flight-amendments/${id}`);
    fetchAmendments();
  };

  // SUBMIT ADD / EDIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`/api/flight-amendments/${editId}`, form);
    } else {
      await axios.post("/api/flight-amendments", form);
    }

    setEditId(null);
    resetForm();
    fetchAmendments();
  };

  const resetForm = () => {
    setForm({
      bookingRefNo: "",
      bookingSource: "",
      amendmentId: "",
      amendmentType: "",
      amendmentStatus: "",
      journeyType: "",
      sector: "",
      departureDate: "",
      airlineCode: "",
      pnr: "",
      bookingStatus: "",
      adminRemark: "",
      generalRemark: ""
    });
  };

  return (
    <div className="flight-wrapper">

      <h2>FLIGHT AMENDMENTS</h2>

      {/* FILTER */}
      <div className="filter-box">
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        />

        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        />

        <button onClick={searchByDate}>Search</button>
        <button onClick={resetFilter}>Reset</button>
      </div>

      {/* FORM */}
      <form className="amendment-form" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key === "departureDate" ? "date" : "text"}
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        <button>{editId ? "Update" : "Add"}</button>
      </form>

      {/* TABLE */}
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking Ref</th>
            <th>Source</th>
            <th>Amendment ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Journey</th>
            <th>Sector</th>
            <th>Depart</th>
            <th>Airline</th>
            <th>PNR</th>
            <th>Booking Status</th>
            <th>Admin Remark</th>
            <th>General</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {amendments.map((a) => (
            <tr key={a._id}>
              <td>{a.bookingRefNo}</td>
              <td>{a.bookingSource}</td>
              <td>{a.amendmentId}</td>
              <td>{a.amendmentType}</td>
              <td>{a.amendmentStatus}</td>
              <td>{a.journeyType}</td>
              <td>{a.sector}</td>
              <td>{a.departureDate?.slice(0, 10)}</td>
              <td>{a.airlineCode}</td>
              <td>{a.pnr}</td>
              <td>{a.bookingStatus}</td>
              <td>{a.adminRemark}</td>
              <td>{a.generalRemark}</td>

              <td>
                <button onClick={() => handleEdit(a)}>✏️</button>
                <button className="del" onClick={() => handleDelete(a._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
