import React, { useState, useEffect } from 'react';

function VisaDocumentList() {
  const [docs, setDocs] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'https://bmt-backend-1-vq3f.onrender.com/api/document-requirements';

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setDocs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, description };

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    setName('');
    setDescription('');
    fetchDocs();
  };

  const handleEdit = (doc) => {
    setEditingId(doc._id);
    setName(doc.name);
    setDescription(doc.description);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchDocs();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Document Requirements</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {docs.map(doc => (
          <li key={doc._id}>
            <b>{doc.name}</b> - {doc.description}
            <button onClick={() => handleEdit(doc)}>Edit</button>
            <button onClick={() => handleDelete(doc._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VisaDocumentList;
