// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function FlightDiscount() {
//   const [discounts, setDiscounts] = useState([]);

//   useEffect(() => {
//     axios.get("/api/flight-discounts")
//       .then(res => setDiscounts(res.data))
//       .catch(err => console.error("Failed to fetch:", err));
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">FLIGHT DISCOUNT</h2>
//       <table className="table-auto w-full border">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2 border">Discount For</th>
//             <th className="p-2 border">Agent Class</th>
//             <th className="p-2 border">Airline Code</th>
//             <th className="p-2 border">Flight Type</th>
//             <th className="p-2 border">Journey Type</th>
//             <th className="p-2 border">Discount Type</th>
//             <th className="p-2 border">Amount</th>
//             <th className="p-2 border">Cabin Class</th>
//           </tr>
//         </thead>
//         <tbody>
//           {discounts.map((item, idx) => (
//             <tr key={idx} className="border-t">
//               <td className="p-2 border">{item.discountFor}</td>
//               <td className="p-2 border">{item.agentClass?.join(", ")}</td>
//               <td className="p-2 border">{item.airlineCode?.join(", ")}</td>
//               <td className="p-2 border">{item.flightType?.join(", ")}</td>
//               <td className="p-2 border">{item.journeyType?.join(", ")}</td>
//               <td className="p-2 border">{item.discountType}</td>
//               <td className="p-2 border">{item.amount}</td>
//               <td className="p-2 border">{item.cabinClass?.join(", ")}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FlightDiscount() {
  const [discounts, setDiscounts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    discountFor: "",
    agentClass: "",
    airlineCode: "",
    flightType: "",
    journeyType: "",
    discountType: "",
    amount: "",
    cabinClass: "",
    fromDate: "",
    toDate: "",
  });

  const fetchData = async () => {
    const res = await axios.get("/api/flight-discounts");
    setDiscounts(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      agentClass: formData.agentClass.split(","),
      airlineCode: formData.airlineCode.split(","),
      flightType: formData.flightType.split(","),
      journeyType: formData.journeyType.split(","),
      cabinClass: formData.cabinClass.split(","),
    };

    if (editId) {
      await axios.put(`/api/flight-discounts/${editId}`, payload);
    } else {
      await axios.post("/api/flight-discounts", payload);
    }

    setEditId(null);
    resetForm();
    fetchData();
  };

  const resetForm = () => {
    setFormData({
      discountFor: "",
      agentClass: "",
      airlineCode: "",
      flightType: "",
      journeyType: "",
      discountType: "",
      amount: "",
      cabinClass: "",
      fromDate: "",
      toDate: "",
    });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      ...item,
      agentClass: item.agentClass.join(","),
      airlineCode: item.airlineCode.join(","),
      flightType: item.flightType.join(","),
      journeyType: item.journeyType.join(","),
      cabinClass: item.cabinClass.join(","),
      fromDate: item.fromDate?.slice(0, 10),
      toDate: item.toDate?.slice(0, 10),
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/flight-discounts/${id}`);
    fetchData();
  };

  const toggleStatus = async (id) => {
    await axios.put(`/api/flight-discounts/status/${id}`);
    fetchData();
  };

  return (
    <div className="p-5 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">FLIGHT DISCOUNT</h2>

      {/* FORM */}
      <form className="grid grid-cols-3 gap-3 bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            type={
              field === "fromDate" || field === "toDate" ? "date" : "text"
            }
            placeholder={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        ))}

        <button className="col-span-3 bg-blue-600 text-white p-2 rounded">
          {editId ? "Update Discount" : "Add Discount"}
        </button>
      </form>

      {/* TABLE */}
      <table className="table-auto w-full mt-5 border bg-white shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Discount For</th>
            <th className="p-2 border">Agent Class</th>
            <th className="p-2 border">Airline Code</th>
            <th className="p-2 border">Flight Type</th>
            <th className="p-2 border">Journey Type</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Cabin</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {discounts.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2 border">{item.discountFor}</td>
              <td className="p-2 border">{item.agentClass.join(", ")}</td>
              <td className="p-2 border">{item.airlineCode.join(", ")}</td>
              <td className="p-2 border">{item.flightType.join(", ")}</td>
              <td className="p-2 border">{item.journeyType.join(", ")}</td>
              <td className="p-2 border">{item.discountType}</td>
              <td className="p-2 border">{item.amount}</td>
              <td className="p-2 border">{item.cabinClass.join(", ")}</td>

              <td className="p-2 border">
                <button
                  onClick={() => toggleStatus(item._id)}
                  className={`px-3 py-1 rounded text-white ${
                    item.status === "Active"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {item.status}
                </button>
              </td>

              <td className="p-2 border flex gap-2">
                <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
