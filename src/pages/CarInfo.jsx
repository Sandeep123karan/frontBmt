import React, { useEffect, useState } from "react";
import axios from "axios";

const CarInfoList = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    carName: "",
    carModel: "",
    fuelType: "",
    carType: "",
    seatCapacity: "",
    gearType: "",
    carColor: "",
    carCategory: "",
    pickupLocation: "",
    dropLocation: "",
  });

  const fetchCars = async () => {
    try {
      const res = await axios.get("https://bmt-backend-1-vq3f.onrender.com/api/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const addCar = async () => {
    try {
      await axios.post("https://bmt-backend-1-vq3f.onrender.com/api/add-car", form);
      setForm({
        carName: "",
        carModel: "",
        fuelType: "",
        carType: "",
        seatCapacity: "",
        gearType: "",
        carColor: "",
        carCategory: "",
        pickupLocation: "",
        dropLocation: "",
      });
      fetchCars();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const deleteCar = async (id) => {
    try {
      await axios.delete(`https://bmt-backend-1-vq3f.onrender.com/api/car/${id}`);
      fetchCars();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🚗 Add Car Info</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
      </div>
      <button onClick={addCar} style={{ marginTop: 10 }}>Add Car</button>

      <h2 style={{ marginTop: 30 }}>📋 Car List</h2>
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>#</th>
            {Object.keys(form).map((k) => (
              <th key={k}>{k}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, i) => (
            <tr key={car._id}>
              <td>{i + 1}</td>
              {Object.keys(form).map((k) => (
                <td key={k}>{car[k]}</td>
              ))}
              <td>
                <button onClick={() => deleteCar(car._id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarInfoList;
