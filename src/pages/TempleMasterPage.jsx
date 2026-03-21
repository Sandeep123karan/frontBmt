import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TempleMasterPage() {
  const [temples, setTemples] = useState([]);
  const [form, setForm] = useState({ templeName:"", templeLocation:"", mainDeity:"" });
  const [editId, setEditId] = useState(null);

  const fetchTemples = async () => {
    const res = await axios.get("/api/darshan/temples");
    setTemples(res.data);
  };

  useEffect(() => { fetchTemples(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(editId){
      await axios.put(`/api/darshan/temples/${editId}`, form);
    } else {
      await axios.post("/api/darshan/temples", form);
    }
    setForm({ templeName:"", templeLocation:"", mainDeity:"" });
    setEditId(null);
    fetchTemples();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/darshan/temples/${id}`);
    fetchTemples();
  };

  const handleEdit = (temple) => {
    setForm(temple);
    setEditId(temple._id);
  };

  return (
    <div>
      <h2>Temple Master</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Temple Name" value={form.templeName}
          onChange={e=>setForm({...form, templeName:e.target.value})}/>
        <input placeholder="Location" value={form.templeLocation}
          onChange={e=>setForm({...form, templeLocation:e.target.value})}/>
        <input placeholder="Main Deity" value={form.mainDeity}
          onChange={e=>setForm({...form, mainDeity:e.target.value})}/>
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <table border="1">
        <thead>
          <tr><th>Name</th><th>Location</th><th>Deity</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {temples.map(t => (
            <tr key={t._id}>
              <td>{t.templeName}</td>
              <td>{t.templeLocation}</td>
              <td>{t.mainDeity}</td>
              <td>
                <button onClick={()=>handleEdit(t)}>Edit</button>
                <button onClick={()=>handleDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

 