import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OnlineTransaction.css";

const OnlineTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    key: "",
    value: "",
    service: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  const getData = async () => {
    try {
      const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/online-transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = () => {
    // Basic filter logic (extend later if needed)
    const filtered = transactions.filter((tx) => {
      const matchKey =
        filters.key && filters.value
          ? (tx[filters.key] || "").toLowerCase().includes(filters.value.toLowerCase())
          : true;
      const matchService = filters.service ? tx.service === filters.service : true;
      const matchStatus = filters.status ? tx.status === filters.status : true;

      const txDate = new Date(tx.createdDate).toISOString().slice(0, 10);
      const matchFromDate = filters.fromDate ? txDate >= filters.fromDate : true;
      const matchToDate = filters.toDate ? txDate <= filters.toDate : true;

      return matchKey && matchService && matchStatus && matchFromDate && matchToDate;
    });
    setTransactions(filtered);
  };

  return (
    <div className="online-transaction">
      <div className="filter-bar">
        <select
          onChange={(e) => setFilters({ ...filters, key: e.target.value })}
        >
          <option value="">Select key to search by</option>
          <option value="transactionId">Transaction ID</option>
          <option value="orderId">Order ID</option>
          <option value="bookingRefNo">Booking Ref No</option>
          <option value="customerName">Customer Name</option>
          <option value="email">Email</option>
        </select>

        <input
          type="text"
          placeholder="Value"
          value={filters.value}
          onChange={(e) => setFilters({ ...filters, value: e.target.value })}
        />

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

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>

        <select
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
        >
          <option value="">Service</option>
          <option value="Flight">Flight</option>
          <option value="Hotel">Hotel</option>
          <option value="Bus">Bus</option>
        </select>

        <button onClick={handleSearch}>Search 🔍</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Order ID</th>
              <th>Booking Ref No</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Convenience Fee</th>
              <th>Status</th>
              <th>Remark/Staff</th>
              <th>Company/User</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Payment Source</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx.transactionId}</td>
                  <td>{tx.orderId}</td>
                  <td>{tx.bookingRefNo}</td>
                  <td>{tx.service}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.convenienceFee}</td>
                  <td>{tx.status}</td>
                  <td>{tx.remark}</td>
                  <td>{tx.company}</td>
                  <td>{tx.customerName}</td>
                  <td>{tx.email}</td>
                  <td>{tx.mobile}</td>
                  <td>{tx.paymentSource}</td>
                  <td>{new Date(tx.createdDate).toLocaleDateString()}</td>
                  <td>—</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" style={{ textAlign: "center", color: "gray" }}>
                  No Online Transaction Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnlineTransaction;
