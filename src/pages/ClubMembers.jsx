import React, { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "https://bmt-backend-1.onrender.com/api",
});

export default function ClubMembers() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", membershipType: "Silver" });
  const [editingId, setEditingId] = useState(null);

  // Fetch all members
  const fetchMembers = async () => {
    try {
      const res = await API.get("/club-members");
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save or Update member
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/club-members/${editingId}`, form);
      } else {
        await API.post("/club-members", form);
      }
      setForm({ name: "", email: "", phone: "", membershipType: "Silver" });
      setEditingId(null);
      fetchMembers();
    } catch (err) {
      console.error("Error saving member:", err);
    }
  };

  // Delete member
  const handleDelete = async (id) => {
    try {
      await API.delete(`/club-members/${id}`);
      fetchMembers();
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  // Edit member
  const handleEdit = (member) => {
    setForm({ name: member.name, email: member.email, phone: member.phone, membershipType: member.membershipType });
    setEditingId(member._id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Club Members</h2>

      {/* Member Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        <select name="membershipType" value={form.membershipType} onChange={handleChange}>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"} Member</button>
      </form>

      {/* Members Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Membership</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m._id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.membershipType}</td>
              <td>
                <button onClick={() => handleEdit(m)}>Edit</button>
                <button onClick={() => handleDelete(m._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
