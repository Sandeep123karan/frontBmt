// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const CarInfoList = () => {
// //   const [cars, setCars] = useState([]);
// //   const [form, setForm] = useState({
// //     carName: "",
// //     carModel: "",
// //     fuelType: "",
// //     carType: "",
// //     seatCapacity: "",
// //     gearType: "",
// //     carColor: "",
// //     carCategory: "",
// //     pickupLocation: "",
// //     dropLocation: "",
// //   });

// //   const fetchCars = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:9000/api/");
// //       setCars(res.data);
// //     } catch (err) {
// //       console.error("Fetch failed:", err);
// //     }
// //   };

// //   const addCar = async () => {
// //     try {
// //       await axios.post("http://localhost:9000/api/add-car", form);
// //       setForm({
// //         carName: "",
// //         carModel: "",
// //         fuelType: "",
// //         carType: "",
// //         seatCapacity: "",
// //         gearType: "",
// //         carColor: "",
// //         carCategory: "",
// //         pickupLocation: "",
// //         dropLocation: "",
// //       });
// //       fetchCars();
// //     } catch (err) {
// //       console.error("Add failed:", err);
// //     }
// //   };

// //   const deleteCar = async (id) => {
// //     try {
// //       await axios.delete(`http://localhost:9000/api/car/${id}`);
// //       fetchCars();
// //     } catch (err) {
// //       console.error("Delete failed:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCars();
// //   }, []);

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h2>🚗 Add Car Info</h2>
// //       <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
// //         {Object.keys(form).map((key) => (
// //           <input
// //             key={key}
// //             placeholder={key}
// //             value={form[key]}
// //             onChange={(e) => setForm({ ...form, [key]: e.target.value })}
// //           />
// //         ))}
// //       </div>
// //       <button onClick={addCar} style={{ marginTop: 10 }}>Add Car</button>

// //       <h2 style={{ marginTop: 30 }}>📋 Car List</h2>
// //       <table border="1" cellPadding="8" width="100%">
// //         <thead>
// //           <tr>
// //             <th>#</th>
// //             {Object.keys(form).map((k) => (
// //               <th key={k}>{k}</th>
// //             ))}
// //             <th>Action</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {cars.map((car, i) => (
// //             <tr key={car._id}>
// //               <td>{i + 1}</td>
// //               {Object.keys(form).map((k) => (
// //                 <td key={k}>{car[k]}</td>
// //               ))}
// //               <td>
// //                 <button onClick={() => deleteCar(car._id)}>🗑️ Delete</button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default CarInfoList;





// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const API = "http://localhost:9000/api";

// // const CarInfoList = () => {
// //   const [cars, setCars] = useState([]);

// //   const [form, setForm] = useState({
// //     carName: "",
// //     carModel: "",
// //     fuelType: "",
// //     carType: "",
// //     seatCapacity: "",
// //     gearType: "",
// //     carColor: "",
// //     carCategory: "",
// //     pickupLocation: "",
// //     dropLocation: "",
// //     price: ""
// //   });

// //   // 🟢 FETCH CARS
// //   const fetchCars = async () => {
// //     try {
// //       const res = await axios.get(api);  // GET ALL
// //       setCars(res.data);
// //     } catch (err) {
// //       console.log("Fetch error", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCars();
// //   }, []);

// //   // 🟢 INPUT CHANGE
// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   // 🟢 ADD CAR
// //   const addCar = async () => {
// //     try {
// //       await axios.post(`${API}/add`, form);   // 🔥 tera api
// //       alert("Car Added");

// //       setForm({
// //         carName: "",
// //         carModel: "",
// //         fuelType: "",
// //         carType: "",
// //         seatCapacity: "",
// //         gearType: "",
// //         carColor: "",
// //         carCategory: "",
// //         pickupLocation: "",
// //         dropLocation: "",
// //         price: ""
// //       });

// //       fetchCars();
// //     } catch (err) {
// //       console.log("Add error", err);
// //     }
// //   };

// //   // 🟢 DELETE CAR
// //   const deleteCar = async (id) => {
// //     try {
// //       await axios.delete(`${API}/delete/${id}`);
// //       fetchCars();
// //     } catch (err) {
// //       console.log("Delete error", err);
// //     }
// //   };

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h2>🚗 Add Car</h2>

// //       <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
// //         {Object.keys(form).map((key) => (
// //           <input
// //             key={key}
// //             name={key}
// //             placeholder={key}
// //             value={form[key]}
// //             onChange={handleChange}
// //             style={{ padding: 8 }}
// //           />
// //         ))}
// //       </div>

// //       <button onClick={addCar} style={{ marginTop: 15, padding: 10 }}>
// //         Add Car
// //       </button>

// //       {/* TABLE */}
// //       <h2 style={{ marginTop: 40 }}>📋 Car List</h2>

// //       <table border="1" cellPadding="8" width="100%">
// //         <thead>
// //           <tr>
// //             <th>#</th>
// //             {Object.keys(form).map((k) => (
// //               <th key={k}>{k}</th>
// //             ))}
// //             <th>Action</th>
// //           </tr>
// //         </thead>

// //         <tbody>
// //           {cars.map((car, i) => (
// //             <tr key={car._id}>
// //               <td>{i + 1}</td>

// //               {Object.keys(form).map((k) => (
// //                 <td key={k}>{car[k]}</td>
// //               ))}

// //               <td>
// //                 <button onClick={() => deleteCar(car._id)}>🗑 Delete</button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default CarInfoList;







// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const API = "http://localhost:9000/api";

// // const CarInfoList = () => {
// //   const [cars, setCars] = useState([]);

// //   const [form, setForm] = useState({
// //     carName: "",
// //     carModel: "",
// //     fuelType: "",
// //     carType: "",
// //     seatCapacity: "",
// //     gearType: "",
// //     carColor: "",
// //     carCategory: "",
// //     pickupLocation: "",
// //     dropLocation: "",
// //     price: ""
// //   });

// //   // 🔵 FETCH ALL CARS
// //   const fetchCars = async () => {
// //     try {
// //       const res = await axios.get(API);
// //       setCars(res.data);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCars();
// //   }, []);

// //   // 🔵 INPUT CHANGE
// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   // 🔵 ADD CAR
// //   const addCar = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(`${API}/a`, form);
// //       alert("Car Added");

// //       setForm({
// //         carName: "",
// //         carModel: "",
// //         fuelType: "",
// //         carType: "",
// //         seatCapacity: "",
// //         gearType: "",
// //         carColor: "",
// //         carCategory: "",
// //         pickupLocation: "",
// //         dropLocation: "",
// //         price: ""
// //       });

// //       fetchCars();
// //     } catch (err) {
// //       console.log(err);
// //       alert("Error adding car");
// //     }
// //   };

// //   // 🔴 DELETE
// //   const deleteCar = async (id) => {
// //     if (!window.confirm("Delete car?")) return;

// //     try {
// //       await axios.delete(`${API}/${id}`);
// //       fetchCars();
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   return (
// //     <div style={{ padding: 30 }}>
// //       <h2 style={{ marginBottom: 20 }}>🚗 Car Management</h2>

// //       {/* 🔥 FORM */}
// //       <form onSubmit={addCar}
// //         style={{
// //           background: "#fff",
// //           padding: 20,
// //           borderRadius: 10,
// //           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
// //           marginBottom: 30
// //         }}
// //       >
// //         <h3>Add Car</h3>

// //         <div style={{
// //           display: "grid",
// //           gridTemplateColumns: "repeat(3,1fr)",
// //           gap: 10
// //         }}>
// //           {Object.keys(form).map((key) => (
// //             <input
// //               key={key}
// //               name={key}
// //               placeholder={key}
// //               value={form[key]}
// //               onChange={handleChange}
// //               required
// //               style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
// //             />
// //           ))}
// //         </div>

// //         <button
// //           type="submit"
// //           style={{
// //             marginTop: 15,
// //             padding: "10px 20px",
// //             background: "#007bff",
// //             color: "#fff",
// //             border: "none",
// //             borderRadius: 6
// //           }}
// //         >
// //           Add Car
// //         </button>
// //       </form>

// //       {/* 🔥 TABLE */}
// //       <div style={{
// //         background: "#fff",
// //         padding: 20,
// //         borderRadius: 10,
// //         boxShadow: "0 0 10px rgba(0,0,0,0.1)"
// //       }}>
// //         <h3>Car List</h3>

// //         <table width="100%" border="1" cellPadding="10" style={{ marginTop: 15 }}>
// //           <thead style={{ background: "#eee" }}>
// //             <tr>
// //               <th>#</th>
// //               {Object.keys(form).map((k) => (
// //                 <th key={k}>{k}</th>
// //               ))}
// //               <th>Action</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {cars.length > 0 ? (
// //               cars.map((car, i) => (
// //                 <tr key={car._id}>
// //                   <td>{i + 1}</td>

// //                   {Object.keys(form).map((k) => (
// //                     <td key={k}>{car[k]}</td>
// //                   ))}

// //                   <td>
// //                     <button
// //                       onClick={() => deleteCar(car._id)}
// //                       style={{
// //                         background: "red",
// //                         color: "#fff",
// //                         border: "none",
// //                         padding: "6px 12px",
// //                         borderRadius: 5
// //                       }}
// //                     >
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="15" style={{ textAlign: "center" }}>
// //                   No Cars Found
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CarInfoList;









// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:9000/api";

// function CarInfoList() {
//   const [cars, setCars] = useState([]);

//   const [form, setForm] = useState({
//     carName: "",
//     carModel: "",
//     fuelType: "",
//     carType: "",
//     seatCapacity: "",
//     gearType: "",
//     carColor: "",
//     carCategory: "",
//     pickupLocation: "",
//     dropLocation: "",
//     price: ""
//   });

//   // 🟢 fetch cars
//   const fetchCars = async () => {
//     try {
//       const res = await axios.get(API);
//       setCars(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchCars();
//   }, []);

//   // 🟢 input change
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // 🟢 add car
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post(`${API}/add`, form);
//       alert("Car Added Successfully 🚗");

//       setForm({
//         carName: "",
//         carModel: "",
//         fuelType: "",
//         carType: "",
//         seatCapacity: "",
//         gearType: "",
//         carColor: "",
//         carCategory: "",
//         pickupLocation: "",
//         dropLocation: "",
//         price: ""
//       });

//       fetchCars();
//     } catch (err) {
//       console.log(err);
//       alert("Error adding car");
//     }
//   };

//   // 🔴 delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete car?")) return;

//     try {
//       await axios.delete(`${API}/${id}`);
//       fetchCars();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>🚗 Car Management Panel</h2>

//       {/* 🔥 FORM */}
//       <form onSubmit={handleSubmit}
//         style={{
//           background: "#fff",
//           padding: 20,
//           borderRadius: 10,
//           marginBottom: 30,
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)"
//         }}
//       >
//         <h3>Add New Car</h3>

//         <div style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3,1fr)",
//           gap: 12
//         }}>
//           {Object.keys(form).map((key) => (
//             <input
//               key={key}
//               name={key}
//               placeholder={key}
//               value={form[key]}
//               onChange={handleChange}
//               required
//               style={{
//                 padding: 10,
//                 border: "1px solid #ccc",
//                 borderRadius: 6
//               }}
//             />
//           ))}
//         </div>

//         <button
//           type="submit"
//           style={{
//             marginTop: 15,
//             padding: "10px 20px",
//             background: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer"
//           }}
//         >
//           Add Car
//         </button>
//       </form>

//       {/* 🔥 TABLE */}
//       <div style={{
//         background: "#fff",
//         padding: 20,
//         borderRadius: 10,
//         boxShadow: "0 0 10px rgba(0,0,0,0.1)"
//       }}>
//         <h3>Car List</h3>

//         <table width="100%" border="1" cellPadding="10" style={{ marginTop: 10 }}>
//           <thead style={{ background: "#eee" }}>
//             <tr>
//               <th>#</th>
//               {Object.keys(form).map((k) => (
//                 <th key={k}>{k}</th>
//               ))}
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {cars.length > 0 ? (
//               cars.map((car, i) => (
//                 <tr key={car._id}>
//                   <td>{i + 1}</td>

//                   {Object.keys(form).map((k) => (
//                     <td key={k}>{car[k]}</td>
//                   ))}

//                   <td>
//                     <button
//                       onClick={() => handleDelete(car._id)}
//                       style={{
//                         background: "red",
//                         color: "#fff",
//                         border: "none",
//                         padding: "6px 12px",
//                         borderRadius: 5
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="15" style={{ textAlign: "center" }}>
//                   No Cars Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default CarInfoList;



// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:9000/api";

// function CarManagement() {

//   const [cars, setCars] = useState([]);
//   const [form, setForm] = useState({
//     name:"",
//     carModel:"",
//     fuelType:"",
//     carType:"",
//     seatCapacity:"",
//     gearType:"",
//     carColor:"",
//     carCategory:"",
//     pickupLocation:"",
//     dropLocation:"",
//     price:""
//   });

//   const [image,setImage] = useState(null);

//   // ================= FETCH =================
//   const fetchCars = async () => {
//     const res = await axios.get(API);
//     setCars(res.data.cars || []);
//   };

//   useEffect(()=>{
//     fetchCars();
//   },[]);

//   // ================= CHANGE =================
//   const handleChange = (e)=>{
//     setForm({...form,[e.target.name]:e.target.value});
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async (e)=>{
//     e.preventDefault();

//     const data = new FormData();
//     Object.keys(form).forEach(key=>{
//       data.append(key, form[key]);
//     });

//     if(image){
//       data.append("image", image);
//     }

//     await axios.post(`${API}/add`, data,{
//       headers:{ "Content-Type":"multipart/form-data"}
//     });

//     alert("Car Added");
//     fetchCars();

//     setForm({
//       name:"",
//       carModel:"",
//       fuelType:"",
//       carType:"",
//       seatCapacity:"",
//       gearType:"",
//       carColor:"",
//       carCategory:"",
//       pickupLocation:"",
//       dropLocation:"",
//       price:""
//     });
//     setImage(null);
//   };

//   // ================= DELETE =================
//   const deleteCar = async(id)=>{
//     if(!window.confirm("Delete car?")) return;
//     await axios.delete(`${API}/${id}`);
//     fetchCars();
//   };

//   return (
//     <div style={{padding:30}}>

//       <h2>🚗 Car Management</h2>

//       {/* ================= FORM ================= */}
//       <form onSubmit={handleSubmit}
//         style={{background:"#fff",padding:20,marginBottom:30,boxShadow:"0 0 10px #ccc"}}>

//         <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>

//           {Object.keys(form).map((key)=>(
//             <input
//               key={key}
//               name={key}
//               placeholder={key}
//               value={form[key]}
//               onChange={handleChange}
//               required
//             />
//           ))}

//           <input type="file"
//             onChange={(e)=>setImage(e.target.files[0])}
//             required
//           />

//         </div>

//         <button style={{marginTop:15,padding:"10px 25px"}}>
//           Add Car
//         </button>

//       </form>

//       {/* ================= TABLE ================= */}
//       <h3>📋 Car List</h3>

//       <table border="1" cellPadding="10" width="100%">
//         <thead style={{background:"#eee"}}>
//           <tr>
//             <th>Image</th>
//             <th>Name</th>
//             <th>Model</th>
//             <th>Fuel</th>
//             <th>Price</th>
//             <th>Location</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {cars.map((c)=>(
//             <tr key={c._id}>

//               <td>
//                 {c.image && (
//                   <img src={c.image} alt=""
//                     style={{width:70,height:50,objectFit:"cover"}}/>
//                 )}
//               </td>

//               <td>{c.name}</td>
//               <td>{c.carModel}</td>
//               <td>{c.fuelType}</td>
//               <td>₹{c.price}</td>
//               <td>{c.pickupLocation}</td>

//               <td>
//                 <button
//                   onClick={()=>deleteCar(c._id)}
//                   style={{background:"red",color:"#fff",padding:"5px 10px"}}>
//                   Delete
//                 </button>
//               </td>

//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   );
// }

// export default CarManagement;



import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:9000/api";

function CarManagement() {

  const [cars, setCars] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name:"",
    carModel:"",
    fuelType:"",
    carType:"",
    seatCapacity:"",
    gearType:"",
    carColor:"",
    carCategory:"",
    pickupLocation:"",
    dropLocation:"",
    price:""
  });

  const [image,setImage] = useState(null);

  // ================= FETCH =================
  const fetchCars = async () => {
    const res = await axios.get(API);
    setCars(res.data.cars || []);
  };

  useEffect(()=>{
    fetchCars();
  },[]);

  // ================= CHANGE =================
  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  // ================= SUBMIT (ADD/UPDATE) =================
  const handleSubmit = async (e)=>{
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach(key=>{
      data.append(key, form[key]);
    });

    if(image){
      data.append("image", image);
    }

    if(editingId){
      await axios.put(`${API}/${editingId}`, data,{
        headers:{ "Content-Type":"multipart/form-data"}
      });
      alert("Car Updated");
    }else{
      await axios.post(`${API}/add`, data,{
        headers:{ "Content-Type":"multipart/form-data"}
      });
      alert("Car Added");
    }

    fetchCars();
    setEditingId(null);
    setImage(null);

    setForm({
      name:"",
      carModel:"",
      fuelType:"",
      carType:"",
      seatCapacity:"",
      gearType:"",
      carColor:"",
      carCategory:"",
      pickupLocation:"",
      dropLocation:"",
      price:""
    });
  };

  // ================= EDIT =================
  const editCar = (c)=>{
    setForm({
      name:c.name || "",
      carModel:c.carModel || "",
      fuelType:c.fuelType || "",
      carType:c.carType || "",
      seatCapacity:c.seatCapacity || "",
      gearType:c.gearType || "",
      carColor:c.carColor || "",
      carCategory:c.carCategory || "",
      pickupLocation:c.pickupLocation || "",
      dropLocation:c.dropLocation || "",
      price:c.price || ""
    });

    setEditingId(c._id);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  // ================= DELETE =================
  const deleteCar = async(id)=>{
    if(!window.confirm("Delete car?")) return;
    await axios.delete(`${API}/${id}`);
    fetchCars();
  };

  return (
    <div style={{padding:30}}>
      <h2>🚗 Car Management</h2>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit}
        style={{background:"#fff",padding:20,marginBottom:30,boxShadow:"0 0 10px #ccc"}}>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>

          {Object.keys(form).map((key)=>(
            <input
              key={key}
              name={key}
              placeholder={key}
              value={form[key]}
              onChange={handleChange}
              required
            />
          ))}

          <input type="file"
            onChange={(e)=>setImage(e.target.files[0])}
          />

        </div>

        <button style={{marginTop:15,padding:"10px 25px"}}>
          {editingId ? "Update Car" : "Add Car"}
        </button>
      </form>

      {/* ================= TABLE ================= */}
      <h3>📋 Car List</h3>

      <table border="1" cellPadding="10" width="100%">
        <thead style={{background:"#eee"}}>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Model</th>
            <th>Fuel</th>
            <th>Type</th>
            <th>Seats</th>
            <th>Gear</th>
            <th>Color</th>
            <th>Category</th>
            <th>Pickup</th>
            <th>Drop</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {cars.map((c)=>(
            <tr key={c._id}>

              <td>
                {c.image && (
                  <img src={c.image} alt=""
                    style={{width:70,height:50,objectFit:"cover"}}/>
                )}
              </td>

              <td>{c.name}</td>
              <td>{c.carModel}</td>
              <td>{c.fuelType}</td>
              <td>{c.carType}</td>
              <td>{c.seatCapacity}</td>
              <td>{c.gearType}</td>
              <td>{c.carColor}</td>
              <td>{c.carCategory}</td>
              <td>{c.pickupLocation}</td>
              <td>{c.dropLocation}</td>
              <td>₹{c.price}</td>

              <td>
                <button
                  onClick={()=>editCar(c)}
                  style={{background:"orange",color:"#fff",marginRight:5}}>
                  Edit
                </button>

                <button
                  onClick={()=>deleteCar(c._id)}
                  style={{background:"red",color:"#fff"}}>
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

export default CarManagement;
