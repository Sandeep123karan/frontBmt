// import React, { useState, useEffect } from "react";

// function VisaDiscount() {
//   const [discounts, setDiscounts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [form, setForm] = useState({
//     country: "",
//     discount: "",
//     validTill: "",
//   });

//   // Fetch discounts from backend
//   const fetchDiscounts = async () => {
//     try {
//       const res = await fetch("http://localhost:9000/api/visa-discounts");
//       const data = await res.json();
//       setDiscounts(data);
//     } catch (error) {
//       console.error("Error loading discounts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDiscounts();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Add discount (POST)
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     if (!form.country || !form.discount || !form.validTill) return;

//     try {
//       const res = await fetch("http://localhost:9000/api/visa-discounts", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const newDiscount = await res.json();

//       setDiscounts([...discounts, newDiscount]);

//       setForm({ country: "", discount: "", validTill: "" });
//     } catch (error) {
//       console.error("Error adding discount:", error);
//     }
//   };

//   // Delete discount
//   const handleDelete = async (id) => {
//     const ok = window.confirm("Are you sure you want to delete this?");
//     if (!ok) return;

//     try {
//       await fetch(`http://localhost:9000/api/visa-discounts/${id}`, {
//         method: "DELETE",
//       });

//       setDiscounts(discounts.filter((d) => d._id !== id));
//     } catch (error) {
//       console.error("Error deleting discount:", error);
//     }
//   };

//   if (loading) {
//     return <p className="p-6">Loading...</p>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6">Visa Discounts</h2>

//       {/* Add Discount Form */}
//       <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//         <h3 className="text-lg font-semibold mb-4">Add New Discount</h3>
//         <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleAdd}>
//           <input
//             type="text"
//             name="country"
//             value={form.country}
//             onChange={handleChange}
//             placeholder="Country"
//             className="border rounded-lg p-2"
//           />
//           <input
//             type="text"
//             name="discount"
//             value={form.discount}
//             onChange={handleChange}
//             placeholder="Discount %"
//             className="border rounded-lg p-2"
//           />
//           <input
//             type="date"
//             name="validTill"
//             value={form.validTill}
//             onChange={handleChange}
//             className="border rounded-lg p-2"
//           />

//           <button
//             type="submit"
//             className="col-span-1 md:col-span-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Add Discount
//           </button>
//         </form>
//       </div>

//       {/* Discount Table */}
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h3 className="text-lg font-semibold mb-4">Available Discounts</h3>

//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2 text-left">Country</th>
//               <th className="border p-2 text-left">Discount</th>
//               <th className="border p-2 text-left">Valid Till</th>
//               <th className="border p-2 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {discounts.map((d) => (
//               <tr key={d._id} className="hover:bg-gray-100">
//                 <td className="border p-2">{d.country}</td>
//                 <td className="border p-2">{d.discount}</td>
//                 <td className="border p-2">
//                   {new Date(d.validTill).toLocaleDateString()}
//                 </td>
//                 <td className="border p-2 text-center">
//                   <button
//                     onClick={() => handleDelete(d._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {discounts.length === 0 && (
//               <tr>
//                 <td colSpan="4" className="text-center p-4 text-gray-500">
//                   No discounts available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default VisaDiscount;
import React, { useState, useEffect } from "react";

function VisaDiscount() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    country: "",
    discount: "",
    validTill: "",
  });

  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch discounts from backend
  const fetchDiscounts = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/visa-discounts");
      const data = await res.json();
      setDiscounts(data);
    } catch (error) {
      console.error("Error loading discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add discount
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.country || !form.discount || !form.validTill) return;

    try {
      const res = await fetch("http://localhost:9000/api/visa-discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const newDiscount = await res.json();
      setDiscounts([...discounts, newDiscount]);

      setForm({ country: "", discount: "", validTill: "" });
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  // Delete discount
  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this?");
    if (!ok) return;

    try {
      await fetch(`http://localhost:9000/api/visa-discounts/${id}`, {
        method: "DELETE",
      });

      setDiscounts(discounts.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  // Open edit modal
  const openEdit = (d) => {
    setEditData({ ...d });
  };

  // Edit input change
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save updated discount
  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:9000/api/visa-discounts/${editData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );

      const updated = await res.json();

      setDiscounts((prev) =>
        prev.map((d) => (d._id === updated._id ? updated : d))
      );

      setEditData(null);
    } catch (error) {
      console.error("Error updating discount:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Visa Discounts</h2>

      {/* Add Discount Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Discount</h3>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          onSubmit={handleAdd}
        >
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

      {/* Discount Table */}
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
              <tr key={d._id} className="hover:bg-gray-100">
                <td className="border p-2">{d.country}</td>
                <td className="border p-2">{d.discount}</td>
                <td className="border p-2">
                  {new Date(d.validTill).toLocaleDateString()}
                </td>
                <td className="border p-2 text-center space-x-3">
                  <button
                    onClick={() => openEdit(d)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
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

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Discount</h3>

            <div className="space-y-3">
              <input
                type="text"
                name="country"
                value={editData.country}
                onChange={handleEditChange}
                placeholder="Country"
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="text"
                name="discount"
                value={editData.discount}
                onChange={handleEditChange}
                placeholder="Discount %"
                className="border rounded-lg p-2 w-full"
              />
              <input
                type="date"
                name="validTill"
                value={editData.validTill?.split("T")[0]}
                onChange={handleEditChange}
                className="border rounded-lg p-2 w-full"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-5">
              <button
                onClick={() => setEditData(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisaDiscount;
