import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BankAccount.css';

const BankAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    branchName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    swiftCode: ""
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/bank-accounts");
      setAccounts(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://bmt-backend-1-vq3f.onrender.com/api/bank-accounts", formData);
      fetchAccounts();
      setShowForm(false);
      setFormData({
        bankName: "", branchName: "", accountHolderName: "",
        accountNumber: "", ifscCode: "", swiftCode: ""
      });
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  return (
    <div className="bank-container">
      <div className="bank-header">
        <h2>BANK ACCOUNTS LIST</h2>
        <button onClick={() => setShowForm(true)}>+ Add Bank Account</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Bank Name</th>
            <th>Branch Name</th>
            <th>Account Holder Name</th>
            <th>Account No</th>
            <th>IFSC Code</th>
            <th>SWIFT Code</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr><td colSpan="7">No Bank Account Found</td></tr>
          ) : accounts.map((acc, i) => (
            <tr key={i}>
              <td>{acc.bankName}</td>
              <td>{acc.branchName}</td>
              <td>{acc.accountHolderName}</td>
              <td>{acc.accountNumber}</td>
              <td>{acc.ifscCode}</td>
              <td>{acc.swiftCode}</td>
              <td>{new Date(acc.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="bank-form">
          <h3>ADD BANK ACCOUNT</h3>
          <input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleChange} />
          <input type="text" name="branchName" placeholder="Branch Name" value={formData.branchName} onChange={handleChange} />
          <input type="text" name="accountHolderName" placeholder="Account Holder Name" value={formData.accountHolderName} onChange={handleChange} />
          <input type="text" name="accountNumber" placeholder="Account Number" value={formData.accountNumber} onChange={handleChange} />
          <input type="text" name="ifscCode" placeholder="IFSC Code" value={formData.ifscCode} onChange={handleChange} />
          <input type="text" name="swiftCode" placeholder="SWIFT Code" value={formData.swiftCode} onChange={handleChange} />
          <button onClick={handleSubmit}>SAVE</button>
        </div>
      )}
    </div>
  );
};

export default BankAccount;
