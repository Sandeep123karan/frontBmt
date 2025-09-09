import React, { useState } from "react";

function PremiumCalculator() {
  const [age, setAge] = useState("");
  const [policyType, setPolicyType] = useState("Health");
  const [coverage, setCoverage] = useState("");
  const [premium, setPremium] = useState(null);

  const calculatePremium = () => {
    if (!age || !coverage) {
      alert("Please enter all fields!");
      return;
    }

    let baseRate = 0;

    if (policyType === "Health") {
      baseRate = 0.02; // 2%
    } else if (policyType === "Life") {
      baseRate = 0.03; // 3%
    } else if (policyType === "Car") {
      baseRate = 0.05; // 5%
    }

    // Simple formula: Premium = coverage * baseRate + age * 2
    const calculatedPremium = (coverage * baseRate + age * 2).toFixed(2);

    setPremium(calculatedPremium);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>💰 Premium Calculator</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
          style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Policy Type:</label>
        <select
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
          style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="Health">Health Insurance</option>
          <option value="Life">Life Insurance</option>
          <option value="Car">Car Insurance</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Coverage Amount (₹):</label>
        <input
          type="number"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
          placeholder="Enter coverage amount"
          style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>

      <button
        onClick={calculatePremium}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#4CAF50",
          color: "white",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Calculate Premium
      </button>

      {premium && (
        <div style={{ marginTop: "20px", textAlign: "center", padding: "15px", background: "#f0f0f0", borderRadius: "8px" }}>
          <h3>Estimated Premium: ₹{premium}</h3>
        </div>
      )}
    </div>
  );
}

export default PremiumCalculator;
