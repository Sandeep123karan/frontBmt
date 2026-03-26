// import React, { useState } from 'react';
// import axios from 'axios';

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('https://bmtadmin.onrender.com/api/users/login', form);
//       localStorage.setItem('token', res.data.token);
//       setMaessage('Login successful');
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Error');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <input name="email" placeholder="Email" onChange={handleChange} required />
//       <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
//       <button type="submit">Login</button>
//       <p>{message}</p>
//     </form>
//   );
// };

// export default Login;