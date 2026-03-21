import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // ✅ correct import
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Token missing, please login again");

    const decoded = jwtDecode(token);

    // ✅ Only allow if role is admin
    if (decoded.role !== 'admin') {
      alert("Access denied. Admins only.");
      return;
    }

    axios
      .get('http://localhost:9000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Error fetching users:", err);
        alert("Failed to fetch users");
      });
  }, []);

  return (
    <div className="user-management-container">
      <div className="user-header">
        <h2>User Management</h2>
        <div className="user-actions">
          
          
        </div>
      </div>

      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name</th>
              <th>Email</th>
              <th className="hide-mobile">Designation</th>
              <th>Status</th>
              <th>Access</th>
              <th>Created Date</th>
              
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{user.name || '-'}</td>
                <td>{user.email || '-'}</td>
                <td className="hide-mobile">{user.designation || '-'}</td>
                <td>
                  <span className={`status ${user.status ? user.status.toLowerCase() : 'inactive'}`}>
                    {user.status || 'Inactive'}
                  </span>
                </td>
                <td><button className="access-btn">Access</button></td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
