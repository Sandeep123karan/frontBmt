import React, { useEffect, useState } from 'react';
import './AgentPaymentHistory.css';

function AgentPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchPayments = async () => {
    let query = [];
    if (searchKey && searchValue) query.push(`key=${searchKey}&value=${searchValue}`);
    if (fromDate && toDate) query.push(`fromDate=${fromDate}&toDate=${toDate}`);

    const res = await fetch(`http://localhost:9000/api/agent-payments?${query.join('&')}`);
    const data = await res.json();
    setPayments(data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="agent-history-container">
      <div className="filter-row">
        <select value={searchKey} onChange={e => setSearchKey(e.target.value)}>
          <option value="">Please select</option>
          <option value="companyName">Company Name</option>
          <option value="agentName">Agent Name</option>
          <option value="transactionId">Transaction ID</option>
        </select>
        <input placeholder="Value" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button onClick={fetchPayments}>SEARCH 🔍</button>
      </div>

      <table className="agent-payment-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Company Name</th>
            <th>Name</th>
            <th>Amount</th>
            <th>PG Info</th>
            <th>Payment Date</th>
            <th>Transaction Id</th>
            <th>Status</th>
            <th>Mode</th>
            <th>Admin Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.companyName}</td>
                <td>{p.agentName}</td>
                <td>₹{p.amount}</td>
                <td>{p.pgInfo}</td>
                <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                <td>{p.transactionId}</td>
                <td>{p.status}</td>
                <td>{p.mode}</td>
                <td>{p.adminRemark}</td>
                <td><button className="action-btn">View</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="no-data">No Data Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AgentPaymentHistory;
