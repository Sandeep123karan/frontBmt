import React, { useEffect, useState } from "react";
import API from "../api";
import RazorpayModal from "../components/RazorpayModal";

function AdminPayments() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔹 Dummy orders (replace with API later)
  useEffect(() => {
    setOrders([
      { _id: "ORD001", customer: "Rahul", amount: 1500, status: "PENDING" },
      { _id: "ORD002", customer: "Anita", amount: 2200, status: "PENDING" },
    ]);
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Payments</h2>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customer}</td>
              <td>{order.amount}</td>
              <td>{order.status}</td>
              <td>
                {order.status === "PENDING" && (
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{ padding: "6px 12px" }}
                  >
                    Collect Payment
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <RazorpayModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default AdminPayments;
