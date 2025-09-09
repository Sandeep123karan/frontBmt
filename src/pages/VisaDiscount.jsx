import React, { useState } from "react";

function VisaDiscount() {
  const [discounts, setDiscounts] = useState([
    { id: 1, country: "USA", discount: "10%", validTill: "2025-12-31" },
    { id: 2, country: "Canada", discount: "5%", validTill: "2025-11-15" },
  ]);

  const [form, setForm] = useState({
    country: "",
    discount: "",
    validTill: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.country || !form.discount || !form.validTill) return;
    const newDiscount = {
      id: discounts.length + 1,
      ...form,
    };
    setDiscounts([...discounts, newDiscount]);
    setForm({ country: "", discount: "", validTill: "" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Visa Discounts</h2>

      {/* Add Discount Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Discount</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleAdd}>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount %"
            className="border rounded-lg p-2"
          />
          <input
            type="date"
            name="validTill"
            value={form.validTill}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Discount
          </button>
        </form>
      </div>

      {/* Discounts List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Available Discounts</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Country</th>
              <th className="border p-2 text-left">Discount</th>
              <th className="border p-2 text-left">Valid Till</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-gray-100">
                <td className="border p-2">{d.country}</td>
                <td className="border p-2">{d.discount}</td>
                <td className="border p-2">{d.validTill}</td>
                <td className="border p-2 text-center">
                  <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No discounts available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisaDiscount;
