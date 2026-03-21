// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./HotelBookingList.css";

// function HotelBookingList() {
//   const [bookings, setBookings] = useState([]);
//   const [filters, setFilters] = useState({
//     key: "",
//     value: "",
//     fromDate: "",
//     toDate: ""
//   });

//   const fetchBookings = async () => {
//     const params = {
//       key: filters.key,
//       value: filters.value,
//       fromDate: filters.fromDate,
//       toDate: filters.toDate
//     };
//     const res = await axios.get("/api/hotel-bookings", { params });
//     setBookings(res.data);
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleSearch = () => {
//     fetchBookings();
//   };

//   const resetSearch = () => {
//     setFilters({ key: "", value: "", fromDate: "", toDate: "" });
//     fetchBookings();
//   };

//   return (
//     <div className="hotel-booking-wrapper">
//       <h2>Hotel Booking List</h2>
//       <div className="filters">
//         <select onChange={(e) => setFilters({ ...filters, key: e.target.value })}>
//           <option value="">Select key</option>
//           <option value="hotelName">Hotel Name</option>
//           <option value="destination">Destination</option>
//           <option value="refNo">Ref No.</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Value"
//           value={filters.value}
//           onChange={(e) => setFilters({ ...filters, value: e.target.value })}
//         />
//         <input
//           type="date"
//           value={filters.fromDate}
//           onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
//         />
//         <input
//           type="date"
//           value={filters.toDate}
//           onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
//         />
//         <button onClick={handleSearch}>Search</button>
//         <button onClick={resetSearch}>Reset</button>
//       </div>

//       <table className="booking-table">
//         <thead>
//           <tr>
//             <th>Ref No.</th>
//             <th>Booking Source</th>
//             <th>Hotel Name</th>
//             <th>Destination</th>
//             <th>Check-in</th>
//             <th>Checkout</th>
//             <th>Fare</th>
//             <th>Pay Status</th>
//             <th>Book Status</th>
//             <th>CNF No.</th>
//             <th>Supplier</th>
//             <th>Type</th>
//             <th>Currency</th>
//             <th>Currency Rate</th>
//             <th>Assign User</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.length > 0 ? (
//             bookings.map((b) => (
//               <tr key={b._id}>
//                 <td>{b.refNo}</td>
//                 <td>{b.bookingSource}</td>
//                 <td>{b.hotelName}</td>
//                 <td>{b.destination}</td>
//                 <td>{new Date(b.checkinDate).toLocaleDateString()}</td>
//                 <td>{new Date(b.checkoutDate).toLocaleDateString()}</td>
//                 <td>{b.fare}</td>
//                 <td>{b.payStatus}</td>
//                 <td>{b.bookStatus}</td>
//                 <td>{b.cnfNumber}</td>
//                 <td>{b.supplier}</td>
//                 <td>{b.type}</td>
//                 <td>{b.bookingCurrency}</td>
//                 <td>{b.currencyRate}</td>
//                 <td>{b.assignUser}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="15">No Booking Found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default HotelBookingList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./HotelBookingList.css";

// function HotelBookingList() {
//   const [bookings, setBookings] = useState([]);
//   const [editId, setEditId] = useState(null);

//   const [filters, setFilters] = useState({
//     key: "",
//     value: "",
//     fromDate: "",
//     toDate: "",
//   });

//   const [form, setForm] = useState({
//     refNo: "",
//     bookingSource: "",
//     hotelName: "",
//     destination: "",
//     checkinDate: "",
//     checkoutDate: "",
//     fare: "",
//     payStatus: "",
//     bookStatus: "",
//     cnfNumber: "",
//     supplier: "",
//     type: "",
//     bookingCurrency: "",
//     currencyRate: "",
//     assignUser: "",
//   });

//   const fetchBookings = async () => {
//     const res = await axios.get("/api/hotel-bookings", { params: filters });
//     setBookings(res.data);
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (editId) {
//       await axios.put(`/api/hotel-bookings/${editId}`, form);
//     } else {
//       await axios.post("/api/hotel-bookings", form);
//     }

//     setEditId(null);
//     resetForm();
//     fetchBookings();
//   };

//   const resetForm = () => {
//     setForm({
//       refNo: "",
//       bookingSource: "",
//       hotelName: "",
//       destination: "",
//       checkinDate: "",
//       checkoutDate: "",
//       fare: "",
//       payStatus: "",
//       bookStatus: "",
//       cnfNumber: "",
//       supplier: "",
//       type: "",
//       bookingCurrency: "",
//       currencyRate: "",
//       assignUser: "",
//     });
//   };

//   const handleEdit = (item) => {
//     setEditId(item._id);
//     setForm(item);
//   };

//   const handleDelete = async (id) => {
//     await axios.delete(`/api/hotel-bookings/${id}`);
//     fetchBookings();
//   };

//   const handleSearch = () => fetchBookings();

//   const resetSearch = () => {
//     setFilters({ key: "", value: "", fromDate: "", toDate: "" });
//     fetchBookings();
//   };

//   return (
//     <div className="hotel-booking-wrapper">
//       <h2>Hotel Booking List</h2>

//       {/* FILTERS */}
//       <div className="filters">
//         <select onChange={(e) => setFilters({ ...filters, key: e.target.value })}>
//           <option value="">Select key</option>
//           <option value="hotelName">Hotel Name</option>
//           <option value="destination">Destination</option>
//           <option value="refNo">Ref No</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Search value"
//           value={filters.value}
//           onChange={(e) => setFilters({ ...filters, value: e.target.value })}
//         />

//         <input
//           type="date"
//           value={filters.fromDate}
//           onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
//         />

//         <input
//           type="date"
//           value={filters.toDate}
//           onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
//         />

//         <button onClick={handleSearch}>Search</button>
//         <button onClick={resetSearch}>Reset</button>
//       </div>

//       {/* ADD / EDIT FORM */}
//       <form className="booking-form" onSubmit={handleSubmit}>
//         {Object.keys(form).map((field) => (
//           <input
//             key={field}
//             type={field.toLowerCase().includes("date") ? "date" : "text"}
//             placeholder={field}
//             value={form[field]}
//             onChange={(e) => setForm({ ...form, [field]: e.target.value })}
//           />
//         ))}
//         <button type="submit">{editId ? "Update" : "Add Booking"}</button>
//       </form>

//       {/* TABLE */}
//       <table className="booking-table">
//         <thead>
//           <tr>
//             <th>Ref No</th>
//             <th>Source</th>
//             <th>Hotel</th>
//             <th>Destination</th>
//             <th>Check-in</th>
//             <th>Checkout</th>
//             <th>Fare</th>
//             <th>Pay</th>
//             <th>Status</th>
//             <th>CNF</th>
//             <th>Supplier</th>
//             <th>Type</th>
//             <th>Currency</th>
//             <th>Rate</th>
//             <th>Assign</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {bookings.length > 0 ? (
//             bookings.map((b) => (
//               <tr key={b._id}>
//                 <td>{b.refNo}</td>
//                 <td>{b.bookingSource}</td>
//                 <td>{b.hotelName}</td>
//                 <td>{b.destination}</td>
//                 <td>{new Date(b.checkinDate).toLocaleDateString()}</td>
//                 <td>{new Date(b.checkoutDate).toLocaleDateString()}</td>
//                 <td>{b.fare}</td>
//                 <td>{b.payStatus}</td>
//                 <td>{b.bookStatus}</td>
//                 <td>{b.cnfNumber}</td>
//                 <td>{b.supplier}</td>
//                 <td>{b.type}</td>
//                 <td>{b.bookingCurrency}</td>
//                 <td>{b.currencyRate}</td>
//                 <td>{b.assignUser}</td>

//                 <td>
//                   <button onClick={() => handleEdit(b)}>✏️</button>
//                   <button onClick={() => handleDelete(b._id)}>🗑️</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="16">No Booking Found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default HotelBookingList;





// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function HotelBookingList() {

// const API = "http://localhost:9000/api/hotel-bookings";

// const emptyForm = {
//   refNo: "",
//   bookingSource: "",
//   hotelName: "",
//   destination: "",

//   checkinDate: "",
//   checkinHour: "",

//   checkoutDate: "",
//   checkoutHour: "",

//   fare: "",
//   payStatus: "Pending",
//   bookStatus: "Hold",

//   cnfNumber: "",
//   supplier: "",
//   type: "",

//   bookingCurrency: "INR",
//   currencyRate: 1,

//   assignUser: "",
// };

// const [form, setForm] = useState(emptyForm);
// const [bookings, setBookings] = useState([]);
// const [editId, setEditId] = useState(null);


// // ✅ HANDLE CHANGE
// const handleChange = (e) => {
//   setForm({
//     ...form,
//     [e.target.name]: e.target.value,
//   });
// };


// // ✅ FETCH
// const fetchBookings = async () => {
//   try {
//     const res = await axios.get(API);
//     setBookings(res.data);
//   } catch {
//     alert("Failed to load bookings");
//   }
// };

// useEffect(() => {
//   fetchBookings();
// }, []);


// // ✅ SUBMIT
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {

//     const payload = {
//       ...form,
//       fare: Number(form.fare),
//       currencyRate: Number(form.currencyRate),
//     };

//     if (editId) {
//       await axios.put(`${API}/${editId}`, payload);
//       alert("Booking Updated ✅");
//     } else {
//       await axios.post(API, payload);
//       alert("Booking Added ✅");
//     }

//     setForm(emptyForm);
//     setEditId(null);
//     fetchBookings();

//   } catch (err) {
//     console.log(err.response?.data);
//     alert("Server Error ❌");
//   }
// };


// // ✅ EDIT
// const handleEdit = (b) => {

// setEditId(b._id);

// setForm({
//   ...emptyForm,
//   ...b,

//   checkinDate: b.checkinDate?.substring(0,10) || "",
//   checkoutDate: b.checkoutDate?.substring(0,10) || "",
// });

// window.scrollTo({top:0, behavior:"smooth"});
// };


// // ✅ DELETE
// const handleDelete = async(id)=>{
// if(!window.confirm("Delete booking?")) return;

// await axios.delete(`${API}/${id}`);
// fetchBookings();
// };



// return (
// <div style={{padding:40}}>

// <h1>Hotel Booking Admin</h1>


// {/* ================= FORM ================= */}

// <form
// onSubmit={handleSubmit}
// style={{
// display:"grid",
// gridTemplateColumns:"1fr 1fr",
// gap:15,
// maxWidth:1000,
// marginBottom:50
// }}
// >

// <input name="refNo" placeholder="Ref No" required
// value={form.refNo} onChange={handleChange} />

// <input name="bookingSource" placeholder="Booking Source"
// value={form.bookingSource} onChange={handleChange} />

// <input name="hotelName" placeholder="Hotel Name"
// value={form.hotelName} onChange={handleChange} />

// <input name="destination" placeholder="Destination"
// value={form.destination} onChange={handleChange} />


// <label>Checkin Date</label>
// <label>Checkin Time</label>

// <input type="date"
// name="checkinDate"
// value={form.checkinDate}
// onChange={handleChange}
// />

// <input type="time"
// name="checkinHour"
// value={form.checkinHour}
// onChange={handleChange}
// />



// <label>Checkout Date</label>
// <label>Checkout Time</label>

// <input type="date"
// name="checkoutDate"
// value={form.checkoutDate}
// onChange={handleChange}
// />

// <input type="time"
// name="checkoutHour"
// value={form.checkoutHour}
// onChange={handleChange}
// />


// <input type="number"
// name="fare"
// placeholder="Fare"
// value={form.fare}
// onChange={handleChange}
// />



// {/* STATUS */}

// <select name="payStatus"
// value={form.payStatus}
// onChange={handleChange}>

// <option>Pending</option>
// <option>Paid</option>

// </select>


// <select name="bookStatus"
// value={form.bookStatus}
// onChange={handleChange}>

// <option>Hold</option>
// <option>Confirmed</option>
// <option>Cancelled</option>

// </select>



// <input name="cnfNumber"
// placeholder="Confirmation Number"
// value={form.cnfNumber}
// onChange={handleChange}
// />

// <input name="supplier"
// placeholder="Supplier"
// value={form.supplier}
// onChange={handleChange}
// />

// <input name="type"
// placeholder="Booking Type"
// value={form.type}
// onChange={handleChange}
// />

// <input name="bookingCurrency"
// placeholder="Currency"
// value={form.bookingCurrency}
// onChange={handleChange}
// />

// <input type="number"
// name="currencyRate"
// placeholder="Currency Rate"
// value={form.currencyRate}
// onChange={handleChange}
// />

// <input name="assignUser"
// placeholder="Assign User"
// value={form.assignUser}
// onChange={handleChange}
// />



// <button
// style={{
// gridColumn:"span 2",
// padding:16,
// background: editId ? "orange" : "green",
// color:"#fff",
// border:"none",
// fontSize:18,
// fontWeight:"bold",
// cursor:"pointer"
// }}
// >
// {editId ? "Update Booking" : "Add Booking"}
// </button>

// </form>



// {/* ================= TABLE ================= */}

// <table border="1" cellPadding="12" width="100%">
// <thead style={{background:"#f2f2f2"}}>
// <tr>
// <th>Ref</th>
// <th>Hotel</th>
// <th>Destination</th>
// <th>Checkin</th>
// <th>Checkout</th>
// <th>Status</th>
// <th>Fare</th>
// <th>Action</th>
// </tr>
// </thead>

// <tbody>

// {bookings.map((b)=>(
// <tr key={b._id}>

// <td>{b.refNo}</td>
// <td>{b.hotelName}</td>
// <td>{b.destination}</td>

// <td>
// {b.checkinDate
// ? new Date(b.checkinDate).toLocaleDateString()
// : "-"} {" "}
// {b.checkinHour}
// </td>

// <td>
// {b.checkoutDate
// ? new Date(b.checkoutDate).toLocaleDateString()
// : "-"} {" "}
// {b.checkoutHour}
// </td>

// <td>
// {b.payStatus} / {b.bookStatus}
// </td>

// <td>₹ {b.fare}</td>

// <td>
// <button onClick={()=>handleEdit(b)}>Edit</button>
// {" "}
// <button onClick={()=>handleDelete(b._id)}>Delete</button>
// </td>

// </tr>
// ))}

// </tbody>
// </table>

// </div>
// );
// }

// export default HotelBookingList;

import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/hotel-bookings";

function HotelBooking() {

  const [form, setForm] = useState({
    refNo: "",
    bookingSource: "",
    type: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    adults: "",
    children: "",
    hotelName: "",
    destination: "",
    city: "",
    roomType: "",
    mealPlan: "",
    nights: "",
    rooms: "",
    checkinDate: "",
    checkoutDate: "",
    bookingDate: "",
    fare: "",
    tax: "",
    discount: "",
    totalAmount: "",
    paidAmount: "",
    dueAmount: "",
    paymentMode: "",
    transactionId: "",
    supplier: "",
    supplierCost: "",
    supplierPaymentStatus: "",
    bookingCurrency: "",
    currencyRate: "",
    assignUser: "",
    notes: "",
    specialRequest: "",
    gallery: ["", "", ""],
  });

  const [bookings, setBookings] = useState([]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= GALLERY ================= */
  const handleGalleryChange = (i, val) => {
    const arr = [...form.gallery];
    arr[i] = val;
    setForm({ ...form, gallery: arr });
  };

  /* ================= FETCH ================= */
  const fetchBookings = async () => {
    const res = await axios.get(`${API}/all`);
    setBookings(res.data.bookings || []);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/create`, form);
      alert("Booking Created 🔥");

      fetchBookings();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🏨 Hotel Booking Form</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit}>

        {/* BASIC */}
        <input name="refNo" placeholder="Ref No" onChange={handleChange} /><br/><br/>
        <input name="bookingSource" placeholder="Booking Source" onChange={handleChange} /><br/><br/>
        <input name="type" placeholder="Type" onChange={handleChange} /><br/><br/>

        {/* CUSTOMER */}
        <input name="customerName" placeholder="Customer Name" onChange={handleChange} /><br/><br/>
        <input name="customerEmail" placeholder="Email" onChange={handleChange} /><br/><br/>
        <input name="customerPhone" placeholder="Phone" onChange={handleChange} /><br/><br/>
        <input name="adults" placeholder="Adults" onChange={handleChange} /><br/><br/>
        <input name="children" placeholder="Children" onChange={handleChange} /><br/><br/>

        {/* HOTEL */}
        <input name="hotelName" placeholder="Hotel Name" onChange={handleChange} /><br/><br/>
        <input name="destination" placeholder="Destination" onChange={handleChange} /><br/><br/>
        <input name="city" placeholder="City" onChange={handleChange} /><br/><br/>
        <input name="roomType" placeholder="Room Type" onChange={handleChange} /><br/><br/>
        <input name="mealPlan" placeholder="Meal Plan" onChange={handleChange} /><br/><br/>
        <input name="nights" placeholder="Nights" onChange={handleChange} /><br/><br/>
        <input name="rooms" placeholder="Rooms" onChange={handleChange} /><br/><br/>

        {/* DATES */}
        <input type="date" name="checkinDate" onChange={handleChange} /><br/><br/>
        <input type="date" name="checkoutDate" onChange={handleChange} /><br/><br/>
        <input type="date" name="bookingDate" onChange={handleChange} /><br/><br/>

        {/* PAYMENT */}
        <input name="fare" placeholder="Fare" onChange={handleChange} /><br/><br/>
        <input name="tax" placeholder="Tax" onChange={handleChange} /><br/><br/>
        <input name="discount" placeholder="Discount" onChange={handleChange} /><br/><br/>
        <input name="totalAmount" placeholder="Total Amount" onChange={handleChange} /><br/><br/>
        <input name="paidAmount" placeholder="Paid Amount" onChange={handleChange} /><br/><br/>
        <input name="dueAmount" placeholder="Due Amount" onChange={handleChange} /><br/><br/>
        <input name="paymentMode" placeholder="Payment Mode" onChange={handleChange} /><br/><br/>
        <input name="transactionId" placeholder="Transaction ID" onChange={handleChange} /><br/><br/>

        {/* SUPPLIER */}
        <input name="supplier" placeholder="Supplier" onChange={handleChange} /><br/><br/>
        <input name="supplierCost" placeholder="Supplier Cost" onChange={handleChange} /><br/><br/>
        <input name="supplierPaymentStatus" placeholder="Supplier Payment Status" onChange={handleChange} /><br/><br/>

        {/* OTHER */}
        <input name="bookingCurrency" placeholder="Currency" onChange={handleChange} /><br/><br/>
        <input name="currencyRate" placeholder="Currency Rate" onChange={handleChange} /><br/><br/>
        <input name="assignUser" placeholder="Assign User" onChange={handleChange} /><br/><br/>
        <input name="notes" placeholder="Notes" onChange={handleChange} /><br/><br/>
        <input name="specialRequest" placeholder="Special Request" onChange={handleChange} /><br/><br/>

        {/* GALLERY */}
        <h4>Gallery (min 3)</h4>
        {form.gallery.map((g, i) => (
          <input
            key={i}
            placeholder={`Image ${i+1}`}
            onChange={(e)=>handleGalleryChange(i,e.target.value)}
          />
        ))}

        <br/><br/>
        <button type="submit">Create Booking</button>
      </form>

      {/* ================= TABLE ================= */}
      <h2 style={{marginTop:40}}>📋 All Bookings</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Hotel</th>
            <th>City</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Supplier</th>
            <th>Assign</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b)=>(
            <tr key={b._id}>
              <td>{b.refNo}</td>
              <td>{b.customerName}</td>
              <td>{b.customerPhone}</td>
              <td>{b.hotelName}</td>
              <td>{b.city}</td>
              <td>{b.checkinDate}</td>
              <td>{b.checkoutDate}</td>
              <td>{b.totalAmount}</td>
              <td>{b.paidAmount}</td>
              <td>{b.dueAmount}</td>
              <td>{b.supplier}</td>
              <td>{b.assignUser}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default HotelBooking;
