
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Auth.css';

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [step, setStep] = useState(1); // Step 1: email, Step 2: OTP
//   const [form, setForm] = useState({ email: '', otp: '' });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setStep(1);
//     setMessage('');
//     setForm({ email: '', otp: '' });
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSendOTP = async (e) => {
//     e.preventDefault();
//     try {
//       const endpoint = isLogin
//         ? 'https://bmt-backend-1-vq3f.onrender.com/api/users/login'
//         : 'https://bmt-backend-1-vq3f.onrender.com/api/users/send-otp';

//       const res = await axios.post(endpoint, { email: form.email });
//       setMessage(res.data.message || 'OTP sent successfully');
//       setStep(2);
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Failed to send OTP');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const endpoint = isLogin
//         ? 'https://bmt-backend-1-vq3f.onrender.com/api/users/verify-login-otp'
//         : 'https://bmt-backend-1-vq3f.onrender.com/api/users/register';

//       const res = await axios.post(endpoint, {
//         email: form.email,
//         otp: form.otp,
//       });

//       if (isLogin) {
//         // ✅ Save login state and token
//         localStorage.setItem('token', res.data.token);
//         localStorage.setItem('isLoggedIn', 'true');

//         setMessage('Login successful');

//         // ✅ Redirect to admin dashboard
//         navigate('/admin/dashboard');
//       } else {
//         setMessage(res.data.message || 'Registered successfully');
//         setIsLogin(true);
//         setStep(1);
//         setForm({ email: '', otp: '' });
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Verification failed');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={step === 1 ? handleSendOTP : handleSubmit}>
//         <h2>{isLogin ? 'Login with OTP' : 'Register with OTP'}</h2>

//         {step === 1 && (
//           <>
//             <input
//               name="email"
//               type="email"
//               placeholder="Enter your Email"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />
//             <button type="submit">Send OTP</button>
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <input
//               name="otp"
//               placeholder="Enter OTP"
//               value={form.otp}
//               onChange={handleChange}
//               required
//             />
//             <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
//           </>
//         )}

//         <p className="message">{message}</p>

//         <p className="toggle">
//           {isLogin ? (
//             <>Don't have an account? <span onClick={toggleForm}>Register</span></>
//           ) : (
//             <>Already have an account? <span onClick={toggleForm}>Login</span></>
//           )}
//         </p>
//       </form>
//     </div>
//   );
// };

// export default AuthPage;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // Step 1: email (+role), Step 2: OTP
  const [form, setForm] = useState({ email: '', otp: '', role: 'admin' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setMessage('');
    setForm({ email: '', otp: '', role: 'admin' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? 'https://bmt-backend-1-vq3f.onrender.com/api/users/login'
        : 'https://bmt-backend-1-vq3f.onrender.com/api/users/send-otp';

      const res = await axios.post(endpoint, { email: form.email });
      setMessage(res.data.message || 'OTP sent successfully');
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin
        ? 'https://bmt-backend-1-vq3f.onrender.com/api/users/verify-login-otp'
        : 'https://bmt-backend-1-vq3f.onrender.com/api/users/register';

      const res = await axios.post(endpoint, {
        email: form.email,
        otp: form.otp,
        role: form.role, // ✅ backend me bhejna zaruri hai
      });

      if (isLogin) {
        // ✅ Save login state and token
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', res.data.user.role);

        setMessage('Login successful');

        // ✅ Redirect based on role
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res.data.user.role === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          setMessage('Unknown role');
        }
      } else {
        setMessage(res.data.message || 'Registered successfully');
        setIsLogin(true);
        setStep(1);
        setForm({ email: '', otp: '', role: 'admin' });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={step === 1 ? handleSendOTP : handleSubmit}>
        <h2>{isLogin ? 'Login with OTP' : 'Register with OTP'}</h2>

        {step === 1 && (
          <>
            <input
              name="email"
              type="email"
              placeholder="Enter your Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            {!isLogin && (
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
              </select>
            )}

            <button type="submit">Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
            />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          </>
        )}

        <p className="message">{message}</p>

        <p className="toggle">
          {isLogin ? (
            <>Don't have an account? <span onClick={toggleForm}>Register</span></>
          ) : (
            <>Already have an account? <span onClick={toggleForm}>Login</span></>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
