import React, { useState, useEffect } from "react";
import "./AddInventory.css";
import axios from "axios";

function AddInventory() {
  const [inventory, setInventory] = useState({
    inventoryName: "",
    disableBeforeHr: "",
    tripType: "Domestic",
    journeyType: "Oneway",
  });

  const [segments, setSegments] = useState([
    {
      originAirportCode: "",
      originTerminal: "",
      destinationAirportCode: "",
      destinationTerminal: "",
      airlineCode: "",
      flightNumber: "",
      aircraft: "",
      departureTime: "",
      arrivalTime: "",
      isArrivalNextDay: false,
    },
  ]);

  const [inventories, setInventories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleInventoryChange = (e) => {
    setInventory({ ...inventory, [e.target.name]: e.target.value });
  };

  const handleSegmentChange = (index, e) => {
    const updated = [...segments];
    updated[index][e.target.name] =
      e.target.name === "isArrivalNextDay" ? e.target.value === "true" : e.target.value;
    setSegments(updated);
  };

  const addSegment = () => {
    setSegments([
      ...segments,
      {
        originAirportCode: "",
        originTerminal: "",
        destinationAirportCode: "",
        destinationTerminal: "",
        airlineCode: "",
        flightNumber: "",
        aircraft: "",
        departureTime: "",
        arrivalTime: "",
        isArrivalNextDay: false,
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/inventories/${editingId}`, {
          ...inventory,
          segments,
        });
        setEditingId(null);
      } else {
        await axios.post("/api/inventories", {
          ...inventory,
          segments,
        });
      }

      alert("Inventory saved");
      setInventory({
        inventoryName: "",
        disableBeforeHr: "",
        tripType: "Domestic",
        journeyType: "Oneway",
      });
      setSegments([
        {
          originAirportCode: "",
          originTerminal: "",
          destinationAirportCode: "",
          destinationTerminal: "",
          airlineCode: "",
          flightNumber: "",
          aircraft: "",
          departureTime: "",
          arrivalTime: "",
          isArrivalNextDay: false,
        },
      ]);
      fetchInventories(); // reload table
    } catch (err) {
      console.error(err);
      alert("Error saving inventory");
    }
  };

  const fetchInventories = async () => {
    try {
      const res = await axios.get("/api/inventories");
      setInventories(res.data);
    } catch (err) {
      console.error("Failed to fetch inventories:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/inventories/${id}`);
      fetchInventories();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (inv) => {
    setInventory({
      inventoryName: inv.inventoryName,
      disableBeforeHr: inv.disableBeforeHr,
      tripType: inv.tripType,
      journeyType: inv.journeyType,
    });
    setSegments(inv.segments);
    setEditingId(inv._id);
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return (
    <div className="inventory-container">
      <h2>{editingId ? "Edit Inventory" : "Add Inventory"}</h2>

      {/* Inventory Inputs */}
      <div className="basic-info">
        <input name="inventoryName" placeholder="Inventory Name" value={inventory.inventoryName} onChange={handleInventoryChange} />
        <input name="disableBeforeHr" placeholder="Disable Before departure (hr)" value={inventory.disableBeforeHr} onChange={handleInventoryChange} />
        <select name="tripType" value={inventory.tripType} onChange={handleInventoryChange}>
          <option value="Domestic">Domestic</option>
          <option value="International">International</option>
        </select>
        <select name="journeyType" value={inventory.journeyType} onChange={handleInventoryChange}>
          <option value="Oneway">Oneway</option>
          <option value="Return">Return</option>
        </select>
      </div>

      {/* Segment Inputs */}
      {segments.map((seg, index) => (
        <div className="segment" key={index}>
          <h4>Trip {index + 1}</h4>
          {["originAirportCode", "originTerminal", "destinationAirportCode", "destinationTerminal", "airlineCode", "flightNumber", "aircraft", "departureTime", "arrivalTime"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={seg[field]}
              onChange={(e) => handleSegmentChange(index, e)}
            />
          ))}
          <select
            name="isArrivalNextDay"
            value={seg.isArrivalNextDay.toString()}
            onChange={(e) => handleSegmentChange(index, e)}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      ))}

      <button className="add-segment-btn" onClick={addSegment}>
        + Add More Segment
      </button>

      <button className="submit-btn" onClick={handleSubmit}>
        {editingId ? "Update & Save" : "SAVE & CONTINUE"}
      </button>

      {/* Inventory Table */}
      <h3>All Inventories</h3>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Trip</th>
            <th>Journey</th>
            <th>Disable Hr</th>
            <th>Segments Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.inventoryName}</td>
              <td>{inv.tripType}</td>
              <td>{inv.journeyType}</td>
              <td>{inv.disableBeforeHr}</td>
              <td>{inv.segments.length}</td>
              <td>
                <button onClick={() => handleEdit(inv)}>Edit</button>
                <button onClick={() => handleDelete(inv._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddInventory;
