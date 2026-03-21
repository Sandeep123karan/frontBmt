// import React, { useState } from "react";

// function InsurancePolicies() {
//   const [policies, setPolicies] = useState([
//     { id: 1, name: "Travel Insurance", provider: "PolicyBazaar", premium: "₹1500", status: "Active" },
//     { id: 2, name: "Health Insurance", provider: "ICICI Lombard", premium: "₹3000", status: "Expired" },
//   ]);

//   const [newPolicy, setNewPolicy] = useState({
//     name: "",
//     provider: "",
//     premium: "",
//     status: "Active",
//   });

//   const handleChange = (e) => {
//     setNewPolicy({ ...newPolicy, [e.target.name]: e.target.value });
//   };

//   const addPolicy = () => {
//     if (!newPolicy.name || !newPolicy.provider || !newPolicy.premium) return;
//     setPolicies([...policies, { id: policies.length + 1, ...newPolicy }]);
//     setNewPolicy({ name: "", provider: "", premium: "", status: "Active" });
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Insurance Policies</h2>

//       {/* Add Policy Form */}
//       <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//         <h3 className="text-lg font-semibold mb-3">Add New Policy</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Policy Name"
//             value={newPolicy.name}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />
//           <input
//             type="text"
//             name="provider"
//             placeholder="Provider"
//             value={newPolicy.provider}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />
//           <input
//             type="text"
//             name="premium"
//             placeholder="Premium (₹)"
//             value={newPolicy.premium}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />
//           <select
//             name="status"
//             value={newPolicy.status}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           >
//             <option value="Active">Active</option>
//             <option value="Expired">Expired</option>
//           </select>
//         </div>
//         <button
//           onClick={addPolicy}
//           className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Add Policy
//         </button>
//       </div>

//       {/* Policies Table */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold mb-3">Policy List</h3>
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">ID</th>
//               <th className="border p-2">Policy Name</th>
//               <th className="border p-2">Provider</th>
//               <th className="border p-2">Premium</th>
//               <th className="border p-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {policies.map((policy) => (
//               <tr key={policy.id} className="text-center">
//                 <td className="border p-2">{policy.id}</td>
//                 <td className="border p-2">{policy.name}</td>
//                 <td className="border p-2">{policy.provider}</td>
//                 <td className="border p-2">{policy.premium}</td>
//                 <td className="border p-2">
//                   <span
//                     className={`px-2 py-1 rounded text-white ${
//                       policy.status === "Active"
//                         ? "bg-green-500"
//                         : "bg-red-500"
//                     }`}
//                   >
//                     {policy.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// // export default InsurancePolicies;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:9000/api/insurance-policies";

// function InsurancePolicies(){

// const [policies,setPolicies]=useState([]);

// const [form,setForm]=useState({
// name:"",
// insurer:"",
// insurerCode:"",
// premium:"",
// medical:"",
// passport:"",
// baggage:"",
// tripCancellation:"",
// personalAccident:"",
// features:"",
// badge:"",
// badgeColor:"",
// fullFeatures:""
// });


// // ✅ FETCH
// const fetchPolicies = async()=>{
// const res = await axios.get(API);
// setPolicies(res.data);
// };

// useEffect(()=>{
// fetchPolicies();
// },[]);


// // ✅ HANDLE
// const handleChange=(e)=>{
// setForm({...form,[e.target.name]:e.target.value});
// };


// // ✅ CREATE
// const addPolicy = async()=>{

// const payload={
// ...form,
// premium:Number(form.premium),
// features:form.features.split(","),
// fullFeatures:form.fullFeatures.split(",")
// };

// await axios.post(API,payload);

// fetchPolicies();

// setForm({
// name:"",
// insurer:"",
// insurerCode:"",
// premium:"",
// medical:"",
// passport:"",
// baggage:"",
// tripCancellation:"",
// personalAccident:"",
// features:"",
// badge:"",
// badgeColor:"",
// fullFeatures:""
// });
// };



// // ✅ DELETE
// const deletePolicy=async(id)=>{
// await axios.delete(`${API}/${id}`);
// fetchPolicies();
// };



// return(
// <div className="p-6 max-w-7xl mx-auto">

// <h2 className="text-3xl font-bold mb-6">
// Insurance Admin 🚀
// </h2>


// {/* FORM */}

// <div className="grid grid-cols-3 gap-3 bg-white p-5 shadow rounded">

// {Object.keys(form).map((key)=>(
// <input
// key={key}
// name={key}
// placeholder={key}
// value={form[key]}
// onChange={handleChange}
// className="border p-2 rounded"
// />
// ))}

// <button
// onClick={addPolicy}
// className="bg-blue-600 text-white p-2 rounded col-span-3"
// >
// Add Policy
// </button>

// </div>



// {/* TABLE */}

// <div className="mt-10 bg-white p-5 shadow rounded">

// <table className="w-full">

// <thead>
// <tr className="bg-gray-100">
// <th>Name</th>
// <th>Insurer</th>
// <th>Premium</th>
// <th>Medical</th>
// <th>Badge</th>
// <th>Delete</th>
// </tr>
// </thead>

// <tbody>

// {policies.map(p=>(
// <tr key={p._id} className="border-t text-center">

// <td>{p.name}</td>
// <td>{p.insurer}</td>
// <td>₹{p.premium}</td>
// <td>{p.medical}</td>
// <td>{p.badge}</td>

// <td>
// <button
// onClick={()=>deletePolicy(p._id)}
// className="bg-red-500 text-white px-3 py-1 rounded"
// >
// Delete
// </button>
// </td>

// </tr>
// ))}

// </tbody>

// </table>

// </div>

// </div>
// );
// }

// export default InsurancePolicies;
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/insurance-policies";

function InsurancePolicies() {

  const [policies, setPolicies] = useState([]);

  const [form, setForm] = useState({
    name: "",
    insurer: "",
    insurerCode: "",
    premium: "",
    medical: "",
    passport: "",
    baggage: "",
    tripCancellation: "",
    personalAccident: "",
    features: "",
    badge: "",
    badgeColor: "",
    fullFeatures: ""
  });

  // FETCH
  const fetchPolicies = async () => {
    const res = await axios.get(API);
    setPolicies(res.data);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE
  const addPolicy = async () => {

    const payload = {
      name: form.name,
      insurer: form.insurer,
      insurerCode: form.insurerCode,
      premium: Number(form.premium),
      medical: form.medical,
      passport: form.passport,
      baggage: form.baggage,
      tripCancellation: form.tripCancellation,
      personalAccident: form.personalAccident,
      badge: form.badge,
      badgeColor: form.badgeColor,
      features: form.features
        ? form.features.split(",").map(f => f.trim()).filter(Boolean)
        : [],
      fullFeatures: form.fullFeatures
        ? form.fullFeatures.split(",").map(f => f.trim()).filter(Boolean)
        : []
    };

    await axios.post(API, payload);

    fetchPolicies();

    setForm({
      name: "",
      insurer: "",
      insurerCode: "",
      premium: "",
      medical: "",
      passport: "",
      baggage: "",
      tripCancellation: "",
      personalAccident: "",
      features: "",
      badge: "",
      badgeColor: "",
      fullFeatures: ""
    });
  };

  const deletePolicy = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchPolicies();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <h2 className="text-3xl font-bold mb-6">Insurance Admin 🚀</h2>

      {/* FORM */}

      <div className="grid grid-cols-2 gap-3 bg-white p-5 shadow rounded">

        <input name="name" placeholder="Policy Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
        <input name="insurer" placeholder="Insurer" value={form.insurer} onChange={handleChange} className="border p-2 rounded" />
        <input name="insurerCode" placeholder="Insurer Code" value={form.insurerCode} onChange={handleChange} className="border p-2 rounded" />
        <input name="premium" placeholder="Premium" value={form.premium} onChange={handleChange} className="border p-2 rounded" />
        <input name="medical" placeholder="Medical Cover" value={form.medical} onChange={handleChange} className="border p-2 rounded" />
        <input name="passport" placeholder="Passport Cover" value={form.passport} onChange={handleChange} className="border p-2 rounded" />
        <input name="baggage" placeholder="Baggage Cover" value={form.baggage} onChange={handleChange} className="border p-2 rounded" />
        <input name="tripCancellation" placeholder="Trip Cancellation" value={form.tripCancellation} onChange={handleChange} className="border p-2 rounded" />
        <input name="personalAccident" placeholder="Personal Accident" value={form.personalAccident} onChange={handleChange} className="border p-2 rounded" />
        <input name="badge" placeholder="Badge" value={form.badge} onChange={handleChange} className="border p-2 rounded" />
        <input name="badgeColor" placeholder="Badge Color" value={form.badgeColor} onChange={handleChange} className="border p-2 rounded" />

        <textarea
          name="features"
          placeholder="Short Features (comma separated)"
          value={form.features}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />

        <textarea
          name="fullFeatures"
          placeholder="Full Features (comma separated)"
          value={form.fullFeatures}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />

        <button
          onClick={addPolicy}
          className="bg-blue-600 text-white p-2 rounded col-span-2"
        >
          Add Policy
        </button>

      </div>

      {/* TABLE */}

      <div className="mt-10 bg-white p-5 shadow rounded overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Insurer</th>
              <th>Premium</th>
              <th>Medical</th>
              <th>Passport</th>
              <th>Baggage</th>
              <th>Trip Cancel</th>
              <th>Accident</th>
              <th>Badge</th>
              <th>Features</th>
              <th>Full Features</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>

            {policies.map(p => (
              <tr key={p._id} className="border-t text-center align-top">

                <td>{p.name}</td>
                <td>{p.insurer}</td>
                <td>₹{p.premium}</td>
                <td>{p.medical}</td>
                <td>{p.passport}</td>
                <td>{p.baggage}</td>
                <td>{p.tripCancellation}</td>
                <td>{p.personalAccident}</td>

                <td>
                  {p.badge && (
                    <span className="px-2 py-1 bg-blue-500 text-white rounded">
                      {p.badge}
                    </span>
                  )}
                </td>

                <td className="text-left">
                  {p.features?.map((f, i) => (
                    <div key={i}>• {f}</div>
                  ))}
                </td>

                <td className="text-left">
                  {p.fullFeatures?.map((f, i) => (
                    <div key={i}>• {f}</div>
                  ))}
                </td>

                <td>
                  <button
                    onClick={() => deletePolicy(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default InsurancePolicies;
