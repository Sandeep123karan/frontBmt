// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./FlightBookingList.css"
// export default function FlightBookingList() {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     axios.get("/api/bookings")
//       .then(res => setBookings(res.data))
//       .catch(err => console.error("❌ Error:", err));
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">FLIGHT BOOKING LIST</h2>
//       <table className="table-auto w-full border">
//         <thead>
//           <tr className="bg-blue-100">
//             <th className="p-2 border">Ref No</th>
//             <th className="p-2 border">Booking Source</th>
//             <th className="p-2 border">Airline</th>
//             <th className="p-2 border">Journey Type</th>
//             <th className="p-2 border">Sector</th>
//             <th className="p-2 border">Lead Passenger</th>
//             <th className="p-2 border">PNR</th>
//             <th className="p-2 border">Supplier</th>
//             <th className="p-2 border">Selling Fare</th>
//             <th className="p-2 border">Purchase Fare</th>
//             <th className="p-2 border">Pay Status</th>
//             <th className="p-2 border">Book Status</th>
//             <th className="p-2 border">Type</th>
//             <th className="p-2 border">Currency</th>
//             <th className="p-2 border">Created By</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((b, idx) => (
//             <tr key={idx}>
//               <td className="p-2 border">{b.refNo}</td>
//               <td className="p-2 border">{b.bookingSource}</td>
//               <td className="p-2 border">{b.airline}</td>
//               <td className="p-2 border">{b.journeyType}</td>
//               <td className="p-2 border">{b.sector}</td>
//               <td className="p-2 border">{b.leadPassenger}</td>
//               <td className="p-2 border">{b.pnr}</td>
//               <td className="p-2 border">{b.supplier}</td>
//               <td className="p-2 border">£ {b.sellingFare}</td>
//               <td className="p-2 border">£ {b.purchaseFare}</td>
//               <td className="p-2 border text-green-600">{b.payStatus}</td>
//               <td className="p-2 border text-blue-600">{b.bookStatus}</td>
//               <td className="p-2 border">{b.type}</td>
//               <td className="p-2 border">{b.bookingCurrency}</td>
//               <td className="p-2 border">{b.createdBy}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FlightBookingList.css";

export default function FlightBookingList() {
  const [bookings, setBookings] = useState([]);
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: ""
  });

  const [form, setForm] = useState({
    refNo: "",
    bookingSource: "",
    airline: "",
    journeyType: "",
    sector: "",
    leadPassenger: "",
    pnr: "",
    supplier: "",
    sellingFare: "",
    purchaseFare: "",
    payStatus: "",
    bookStatus: "",
    type: "",
    bookingCurrency: "",
    createdBy: "",
    bookingDate: ""
  });

  // FETCH ALL
  const fetchBookings = async () => {
    const res = await axios.get("/api/flight-bookings");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // FILTER BY DATE
  const searchByDate = async () => {
    const res = await axios.get("/api/flight-bookings/by-date", {
      params: filters
    });
    setBookings(res.data);
  };

  const resetFilter = () => {
    setFilters({ fromDate: "", toDate: "" });
    fetchBookings();
  };

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`/api/flight-bookings/${id}`);
    fetchBookings();
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      ...item,
      bookingDate: item.bookingDate?.slice(0, 10)
    });
  };

  // SUBMIT (ADD + EDIT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`/api/flight-bookings/${editId}`, form);
    } else {
      await axios.post("/api/flight-bookings", form);
    }

    setEditId(null);
    resetForm();
    fetchBookings();
  };

  const resetForm = () => {
    setForm({
      refNo: "",
      bookingSource: "",
      airline: "",
      journeyType: "",
      sector: "",
      leadPassenger: "",
      pnr: "",
      supplier: "",
      sellingFare: "",
      purchaseFare: "",
      payStatus: "",
      bookStatus: "",
      type: "",
      bookingCurrency: "",
      createdBy: "",
      bookingDate: ""
    });
  };

  return (
    <div className="flight-wrapper">

      <h2>FLIGHT BOOKING LIST</h2>

      {/* FILTER BOX */}
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
      <form className="booking-form" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key === "bookingDate" ? "date" : "text"}
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}

        <button type="submit">
          {editId ? "Update Booking" : "Add Booking"}
        </button>
      </form>

      {/* TABLE */}
      <table className="booking-table">
        <thead>
          <tr>
            <th>Ref No</th>
            <th>Source</th>
            <th>Airline</th>
            <th>Journey</th>
            <th>Sector</th>
            <th>Passenger</th>
            <th>PNR</th>
            <th>Supplier</th>
            <th>Selling</th>
            <th>Purchase</th>
            <th>Pay</th>
            <th>Status</th>
            <th>Type</th>
            <th>Currency</th>
            <th>Created By</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.refNo}</td>
              <td>{b.bookingSource}</td>
              <td>{b.airline}</td>
              <td>{b.journeyType}</td>
              <td>{b.sector}</td>
              <td>{b.leadPassenger}</td>
              <td>{b.pnr}</td>
              <td>{b.supplier}</td>
              <td>{b.sellingFare}</td>
              <td>{b.purchaseFare}</td>
              <td>{b.payStatus}</td>
              <td>{b.bookStatus}</td>
              <td>{b.type}</td>
              <td>{b.bookingCurrency}</td>
              <td>{b.createdBy}</td>
              <td>{new Date(b.bookingDate).toLocaleDateString()}</td>

              <td>
                <button onClick={() => handleEdit(b)}>✏️</button>
                <button className="del" onClick={() => handleDelete(b._id)}>
                  🗑️
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
