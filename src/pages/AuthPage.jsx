import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:9000/api/users";

export default function AuthPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ AUTO REDIRECT (AGAR LOGIN HAI)
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("FORM:", form);

      const res = await axios.post(`${API}/login`, form);

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ TOKEN SAVE
      localStorage.setItem("adminToken", res.data.token);

      // ✅ REDIRECT
      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      console.log("ERROR:", err);
      alert(err.response?.data?.message || "Login Failed");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>

        <h1>Admin Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {loading ? "Logging..." : "LOGIN"}
        </button>

      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#4facfe,#00f2fe)"
  },
  card: {
    width: "400px",
    padding: "40px",
    borderRadius: "12px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#4facfe",
    color: "#fff",
    cursor: "pointer"
  }
};