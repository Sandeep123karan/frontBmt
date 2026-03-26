


import React, { useEffect, useState } from "react";
import axios from "axios";

function InsuranceBookingForm() {

const API = "https://bmtadmin.onrender.com/api/insurance-bookings";

const emptyForm = {
plan:{ name:"", premium:"" },

fullName:"",
dob:"",
nationality:"",
visaType:"",

passportNumber:"",
passportExpiry:"",

panNumber:"",
noPan:false,

email:"",
phoneNumber:"",
alternatePhone:"",

address:"",
city:"",
pincode:"",

nomineeName:"",
nomineeRelation:"",
nomineeDob:"",

hasMedicalConditions:false,
medicalConditions:"",

isPregnant:false,
pregnancyWeeks:"",

paymentStatus:"Pending",
status:"Booked"
};

const [form,setForm] = useState(emptyForm);
const [bookings,setBookings] = useState([]);
const [editId,setEditId] = useState(null);



/* ================= FETCH ================= */

const fetchBookings = async()=>{
const res = await axios.get(API);
setBookings(res.data.bookings || res.data);
};

useEffect(()=>{
fetchBookings();
},[]);



/* ================= HANDLE CHANGE ================= */

const handleChange = (e)=>{

const {name,value,type,checked} = e.target;

if(name.startsWith("plan.")){
const key = name.split(".")[1];

setForm({
...form,
plan:{
...form.plan,
[key]: key==="premium"? Number(value):value
}
});

}else{

setForm({
...form,
[name]: type==="checkbox"?checked:value
});

}

};



/* ================= SUBMIT ================= */

const handleSubmit = async(e)=>{
e.preventDefault();

try{

if(editId){

await axios.put(`${API}/${editId}`,form);
alert("Booking Updated ✅");

}else{

await axios.post(API,form);
alert("Insurance Booked ✅");

}

setForm(emptyForm);
setEditId(null);
fetchBookings();

}catch(err){

console.log(err.response?.data);
alert("Error ❌");

}
};



/* ================= DELETE ================= */

const handleDelete = async(id)=>{

if(!window.confirm("Delete booking?")) return;

await axios.delete(`${API}/${id}`);
fetchBookings();

};



/* ================= EDIT ================= */

const handleEdit = (b)=>{

setEditId(b._id);

setForm({

...emptyForm,
...b,

plan:{
name:b.plan?.name || "",
premium:b.plan?.premium || ""
},

dob:b.dob?.substring(0,10) || "",
passportExpiry:b.passportExpiry?.substring(0,10) || "",
nomineeDob:b.nomineeDob?.substring(0,10) || "",

});

window.scrollTo({top:0,behavior:"smooth"});
};



return(
<div style={{padding:40}}>

<h1>Insurance Booking Admin</h1>

{/* ================= FORM ================= */}

<form
onSubmit={handleSubmit}
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:15,
maxWidth:1100
}}
>

{/* PLAN */}
<input name="plan.name" placeholder="Plan Name"
value={form.plan.name} onChange={handleChange} required />

<input type="number"
name="plan.premium"
placeholder="Premium"
value={form.plan.premium}
onChange={handleChange}
required
/>

<input name="fullName"
placeholder="Full Name"
value={form.fullName}
onChange={handleChange}
required
/>

<input type="date"
name="dob"
value={form.dob}
onChange={handleChange}
/>

<input name="nationality"
placeholder="Nationality"
value={form.nationality}
onChange={handleChange}
/>

<input name="visaType"
placeholder="Visa Type"
value={form.visaType}
onChange={handleChange}
/>

<input name="passportNumber"
placeholder="Passport Number"
value={form.passportNumber}
onChange={handleChange}
/>

<input type="date"
name="passportExpiry"
value={form.passportExpiry}
onChange={handleChange}
/>

<input name="panNumber"
placeholder="PAN Number"
value={form.panNumber}
onChange={handleChange}
/>

<label>
<input type="checkbox"
name="noPan"
checked={form.noPan}
onChange={handleChange}
/>
No PAN
</label>

<input name="email"
placeholder="Email"
value={form.email}
onChange={handleChange}
/>

<input name="phoneNumber"
placeholder="Phone Number"
value={form.phoneNumber}
onChange={handleChange}
required
/>

<input name="alternatePhone"
placeholder="Alternate Phone"
value={form.alternatePhone}
onChange={handleChange}
/>

<input name="address"
placeholder="Address"
value={form.address}
onChange={handleChange}
/>

<input name="city"
placeholder="City"
value={form.city}
onChange={handleChange}
/>

<input name="pincode"
placeholder="Pincode"
value={form.pincode}
onChange={handleChange}
/>

<input name="nomineeName"
placeholder="Nominee Name"
value={form.nomineeName}
onChange={handleChange}
/>

<input name="nomineeRelation"
placeholder="Nominee Relation"
value={form.nomineeRelation}
onChange={handleChange}
/>

<input type="date"
name="nomineeDob"
value={form.nomineeDob}
onChange={handleChange}
/>


<label>
<input type="checkbox"
name="hasMedicalConditions"
checked={form.hasMedicalConditions}
onChange={handleChange}
/>
Medical Conditions
</label>

{form.hasMedicalConditions && (
<input
name="medicalConditions"
placeholder="Medical Conditions"
value={form.medicalConditions}
onChange={handleChange}
/>
)}

<label>
<input type="checkbox"
name="isPregnant"
checked={form.isPregnant}
onChange={handleChange}
/>
Pregnant
</label>

{form.isPregnant && (
<input
name="pregnancyWeeks"
placeholder="Pregnancy Weeks"
value={form.pregnancyWeeks}
onChange={handleChange}
/>
)}

<select
name="paymentStatus"
value={form.paymentStatus}
onChange={handleChange}
>
<option>Pending</option>
<option>Paid</option>
</select>

<select
name="status"
value={form.status}
onChange={handleChange}
>
<option>Booked</option>
<option>Cancelled</option>
</select>


<button
style={{
gridColumn:"span 2",
padding:16,
background: editId?"orange":"green",
color:"#fff",
border:"none",
fontWeight:"bold"
}}
>
{editId?"Update Booking":"Book Insurance"}
</button>

</form>



{/* ================= TABLE ================= */}

<h2 style={{marginTop:60}}>All Insurance Bookings</h2>

<table border="1" cellPadding="10" width="100%">
<thead style={{background:"#eee"}}>
<tr>

<th>Name</th>
<th>Plan</th>
<th>Premium</th>
<th>Phone</th>
<th>Status</th>
<th>Payment</th>
<th>Action</th>

</tr>
</thead>

<tbody>

{bookings.map((b)=>(
<tr key={b._id}>

<td>{b.fullName}</td>
<td>{b.plan?.name}</td>
<td>₹ {b.plan?.premium}</td>
<td>{b.phoneNumber}</td>
<td>{b.status}</td>
<td>{b.paymentStatus}</td>

<td>

<button
onClick={()=>handleEdit(b)}
style={{marginRight:10}}
>
Edit
</button>

<button
onClick={()=>handleDelete(b._id)}
style={{background:"red",color:"#fff"}}
>
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

export default InsuranceBookingForm;
