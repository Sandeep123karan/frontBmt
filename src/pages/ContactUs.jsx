// ContactUs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ContactUs.css";

function ContactUs() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    queryType: "",
    subject: "",
    message: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const fetchContacts = async () => {
    let url = `/api/contacts`;
    if (searchKey && searchValue) {
      url += `?key=${searchKey}&value=${searchValue}`;
    }
    const res = await axios.get(url);
    setContacts(res.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/contacts/${editingId}`, formData);
      setEditingId(null);
    } else {
      await axios.post("/api/contacts", formData);
    }
    setFormData({ name: "", email: "", queryType: "", subject: "", message: "" });
    fetchContacts();
  };

  const handleEdit = (contact) => {
    setFormData(contact);
    setEditingId(contact._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/contacts/${id}`);
    fetchContacts();
  };

  const handleExport = () => {
    const csvRows = [
      ["Name", "Email", "Query Type", "Subject", "Message", "Created Date"],
      ...contacts.map((c) => [c.name, c.email, c.queryType, c.subject, c.message, new Date(c.createdAt).toLocaleString()]),
    ];
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>

      <div className="search-area">
        <select value={searchKey} onChange={(e) => setSearchKey(e.target.value)}>
          <option value="">Select key</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="subject">Subject</option>
        </select>
        <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Value" />
        <button onClick={fetchContacts}>Search</button>
        <button onClick={handleExport}>Export</button>
      </div>

      <form onSubmit={handleSubmit} className="form-area">
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <input type="text" placeholder="Query Type" value={formData.queryType} onChange={(e) => setFormData({ ...formData, queryType: e.target.value })} required />
        <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
        <textarea placeholder="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <table className="contact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Query Type</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.queryType}</td>
              <td>{c.subject}</td>
              <td>{c.message}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactUs;