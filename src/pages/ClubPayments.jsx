import React, { useState, useEffect } from "react";
import axios from "axios";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", amount: "" });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await axios.get("/api/club-payments");
    setPayments(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createOrder = async () => {
    const res = await axios.post("/api/club-payments/create-order", form);
    const { orderId, key } = res.data;

    const options = {
      key,
      amount: form.amount * 100,
      currency: "INR",
      name: "Club Payment",
      description: "Test Transaction",
      order_id: orderId,
      handler: async (response) => {
        await axios.post("/api/club-payments/verify", response);
        fetchPayments();
      },
      prefill: {
        name: form.name,
        email: form.email,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const deletePayment = async (id) => {
    await axios.delete(`/api/club-payments/${id}`);
    fetchPayments();
  };

  return (
    <div>
      <h2>Payments</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="amount" placeholder="Amount" onChange={handleChange} />
      <button onClick={createOrder}>Pay Now</button>

      <h3>All Payments</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
              <td>
                <button onClick={() => deletePayment(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payments;
