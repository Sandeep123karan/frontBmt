import React, { useEffect, useState } from "react";

function VisaCountryList() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCountry, setNewCountry] = useState({ name: "", iso2: "" });
  const [updateCountry, setUpdateCountry] = useState({ id: "", name: "", iso2: "" });

  const API_URL = "https://bmt-backend-1-vq3f.onrender.com/api/visa-countries"; // backend URL

  // Fetch all countries
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      setError("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Add new country
  const handleAdd = async () => {
    if (!newCountry.name || !newCountry.iso2) return alert("Enter name and ISO2 code");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCountry),
      });
      if (!res.ok) throw new Error("Add failed");
      setNewCountry({ name: "", iso2: "" });
      fetchCountries();
    } catch (err) {
      alert(err.message);
    }
  };

  // Update country
  const handleUpdate = async () => {
    if (!updateCountry.id) return alert("Select a country to update");
    try {
      const res = await fetch(`${API_URL}/${updateCountry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updateCountry.name, iso2: updateCountry.iso2 }),
      });
      if (!res.ok) throw new Error("Update failed");
      setUpdateCountry({ id: "", name: "", iso2: "" });
      fetchCountries();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete country
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchCountries();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Visa Countries</h2>

      {/* Add new country */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={newCountry.name}
          onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
        />
        <input
          placeholder="ISO2 Code"
          value={newCountry.iso2}
          onChange={(e) => setNewCountry({ ...newCountry, iso2: e.target.value })}
        />
        <button onClick={handleAdd}>Add Country</button>
      </div>

      {/* Update country */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Select Country ID"
          value={updateCountry.id}
          onChange={(e) => setUpdateCountry({ ...updateCountry, id: e.target.value })}
        />
        <input
          placeholder="New Name"
          value={updateCountry.name}
          onChange={(e) => setUpdateCountry({ ...updateCountry, name: e.target.value })}
        />
        <input
          placeholder="New ISO2 Code"
          value={updateCountry.iso2}
          onChange={(e) => setUpdateCountry({ ...updateCountry, iso2: e.target.value })}
        />
        <button onClick={handleUpdate}>Update Country</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : countries.length === 0 ? (
        <p>No countries found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>ISO2</th>
              <th>Flag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c._id}>
                <td>{c._id}</td>
                <td>{c.name}</td>
                <td>{c.iso2}</td>
                <td>
                  {c.flagUrl && <img src={c.flagUrl} alt="flag" width="50" />}
                </td>
                <td>
                  <button
                    onClick={() =>
                      setUpdateCountry({ id: c._id, name: c.name, iso2: c.iso2 })
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VisaCountryList;
