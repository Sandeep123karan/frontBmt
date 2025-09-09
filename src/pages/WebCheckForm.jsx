import React, { useState, useEffect } from 'react';
import { createCheckin, updateCheckin } from '../api/webCheckin';
import './WebCheck.css';

function WebCheckForm({ reload, editing, setEditing }) {
  const [form, setForm] = useState({
    airlineCode: '',
    airlineName: '',
    url: '',
    image: null
  });

  useEffect(() => {
    if (editing) {
      setForm({
        airlineCode: editing.airlineCode,
        airlineName: editing.airlineName,
        url: editing.url,
        image: null
      });
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (editing) {
      await updateCheckin(editing._id, formData);
    } else {
      await createCheckin(formData);
    }

    setForm({ airlineCode: '', airlineName: '', url: '', image: null });
    setEditing(null);
    reload();
  };

  return (
    <form className="webcheck-form" onSubmit={handleSubmit}>
      <input type="text" name="airlineCode" placeholder="Airline Code" value={form.airlineCode} onChange={handleChange} required />
      <input type="text" name="airlineName" placeholder="Airline Name" value={form.airlineName} onChange={handleChange} required />
      <input type="url" name="url" placeholder="Check-In URL" value={form.url} onChange={handleChange} required />
      <input type="file" name="image" accept="image/*" onChange={handleChange} />
      <button type="submit">{editing ? 'Update' : 'Add'} Web Check-In</button>
    </form>
  );
}

export default WebCheckForm;
