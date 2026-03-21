import React, { useEffect, useState } from 'react';
import "./EmailTemplates.css";

function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    title: "",
    service: "",
    status: "Active",
    subject: "",
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/email-templates");
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editId
        ? `http://localhost:9000/api/email-templates/${editId}`
        : "http://localhost:9000/api/email-templates";

      const method = editId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({ title: "", service: "", status: "Active", subject: "" });
      setEditId(null);
      setShowForm(false);
      fetchTemplates();
    } catch (err) {
      console.error("Error saving template:", err);
    }
  };

  const handleEdit = (template) => {
    setForm({
      title: template.title,
      service: template.service,
      status: template.status,
      subject: template.subject,
    });
    setEditId(template._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:9000/api/email-templates/${id}`, {
        method: "DELETE",
      });
      fetchTemplates();
    } catch (err) {
      console.error("Error deleting template:", err);
    }
  };

  return (
    <div className="email-template-container">
      <div className="header-bar">
        <h2>Email Templates List</h2>
        <button
          className="add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setForm({ title: "", service: "", status: "Active", subject: "" });
            setEditId(null);
          }}
        >
          {showForm ? "Close" : "+ Add Email Template"}
        </button>
      </div>

      {showForm && (
        <div className="template-form">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
          />
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="save-btn" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Service</th>
            <th>Status</th>
            <th>Subject</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.length === 0 ? (
            <tr>
              <td colSpan="6">No Data Found</td>
            </tr>
          ) : (
            templates.map((template) => (
              <tr key={template._id}>
                <td>{template.title}</td>
                <td>{template.service}</td>
                <td>{template.status}</td>
                <td><span className="badge">{template.subject}</span></td>
                <td>{new Date(template.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(template)}>Edit</button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmailTemplates;
