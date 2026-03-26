// import React, { useState } from 'react';
// import axios from 'axios';

// const Register = () => {
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [message, setMessage] = useState('');

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('https://bmtadmin.onrender.com/api/users/register', form);
//       setMessage(res.data.message);
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Error');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Register</h2>
//       <input name="name" placeholder="Name" onChange={handleChange} required />
//       <input name="email" placeholder="Email" onChange={handleChange} required />
//       <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
//       <button type="submit">Register</button>
//       <p>{message}</p>
//     </form>
//   );
// };

// export default Register;