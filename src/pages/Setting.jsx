// import React, { useState } from 'react';

// import "./Setting.css"
// function CompanySetting() {
//   const [formData, setFormData] = useState({
//     companyName: '',
//     gstNumber: '',
//     cinNumber: '',
//     supportNo: '',
//     tollfreeNo: '',
//     whatsappNo: '',
//     supportEmail: '',
//     panNumber: '',
//     panName: '',
//     address: '',
//     city: '',
//     zip: '',
//     country: '',
//     state: '',
//     copyright: '',
//     analyticsHead: '',
//     analyticsBody: '',
//     holidayPrefix: '',
//     callFix: '',
//     logo: null,
//     favicon: null,
//     facebook: '',
//     linkedin: '',
//     instagram: '',
//     twitter: '',
//     youtube: '',
//     mailer: '',
//     smtpServer: '',
//     port: '',
//     fromEmail: '',
//     emailId: '',
//     emailPassword: '',
//     cc: '',
//     bcc: '',
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataToSend.append(key, value);
//       });

//       await fetch("https://bmt-backend-1-vq3f.onrender.com/api/company-setting", {
//         method: "POST",
//         body: formDataToSend,
//       });

//       alert("Settings saved successfully");
//     } catch (error) {
//       console.error("Error saving settings:", error);
//     }
//   };

//   return (
//     <div className="company-setting-container">
//       <h2>Company Settings</h2>
//       <form className="company-form" onSubmit={handleSubmit}>
//         <div className="section">
//           <label>Company Name <input name="companyName" onChange={handleChange} /></label>
//           <label>Company GST No <input name="gstNumber" onChange={handleChange} /></label>
//           <label>Company CIN No <input name="cinNumber" onChange={handleChange} /></label>
//           <label>Support No <input name="supportNo" onChange={handleChange} /></label>
//           <label>Tollfree No <input name="tollfreeNo" onChange={handleChange} /></label>
//           <label>Whatsapp No <input name="whatsappNo" onChange={handleChange} /></label>
//           <label>Support Email <input name="supportEmail" onChange={handleChange} /></label>
//           <label>PAN Number <input name="panNumber" onChange={handleChange} /></label>
//           <label>PAN Name <input name="panName" onChange={handleChange} /></label>
//           <label>Street/Address <input name="address" onChange={handleChange} /></label>
//           <label>City <input name="city" onChange={handleChange} /></label>
//           <label>Zip Code <input name="zip" onChange={handleChange} /></label>
//           <label>Country <input name="country" onChange={handleChange} /></label>
//           <label>State <input name="state" onChange={handleChange} /></label>
//           <label>Copyright <input name="copyright" onChange={handleChange} /></label>
//           <label>Google Analytics For Head <input name="analyticsHead" onChange={handleChange} /></label>
//           <label>Google Analytics For Body <input name="analyticsBody" onChange={handleChange} /></label>
//           <label>Holiday Prefix <input name="holidayPrefix" onChange={handleChange} /></label>
//           <label>Call Fix <input name="callFix" onChange={handleChange} /></label>
//         </div>

//         <div className="section">
//           <h4>Logo and Favicon</h4>
//           <label>Logo <input type="file" name="logo" onChange={handleChange} /></label>
//           <label>Favicon <input type="file" name="favicon" onChange={handleChange} /></label>
//         </div>

//         <div className="section">
//           <h4>Social Links</h4>
//           <label>Facebook <input name="facebook" onChange={handleChange} /></label>
//           <label>LinkedIn <input name="linkedin" onChange={handleChange} /></label>
//           <label>Instagram <input name="instagram" onChange={handleChange} /></label>
//           <label>Twitter <input name="twitter" onChange={handleChange} /></label>
//           <label>YouTube <input name="youtube" onChange={handleChange} /></label>
//         </div>

//         <div className="section">
//           <h4>Email Settings</h4>
//           <label>Mailer <input name="mailer" onChange={handleChange} /></label>
//           <label>SMTP Server <input name="smtpServer" onChange={handleChange} /></label>
//           <label>Port <input name="port" onChange={handleChange} /></label>
//           <label>From Email <input name="fromEmail" onChange={handleChange} /></label>
//           <label>Email ID <input name="emailId" onChange={handleChange} /></label>
//           <label>Password <input name="emailPassword" onChange={handleChange} /></label>
//           <label>CC <input name="cc" onChange={handleChange} /></label>
//           <label>BCC <input name="bcc" onChange={handleChange} /></label>
//         </div>

//         <button type="submit">Save Settings</button>
//       </form>
//     </div>
//   );
// }

// export default CompanySetting;
import React from 'react';
import './Setting.css';

function CompanySetting() {
  return (
    <div className="dng-container">
      <div className="dng-header">
        <h2>Company Settings</h2>
        <p>Manage your company's basic information and contact details.</p>
      </div>

      <div className="dng-card">
        <h3>Basic Information</h3>
        <div className="dng-grid">
          <div className="dng-form-group">
            <label>Company Name</label>
            <input type="text" value="Bird My Trip Pvt Ltd" readOnly />
          </div>
          <div className="dng-form-group">
            <label>GST Number</label>
            <input type="text" value="27AAACI1234A1Z5" readOnly />
          </div>
          <div className="dng-form-group">
            <label>Support Email</label>
            <input type="text" value="support@birdmytrip.com" readOnly />
          </div>
        </div>
      </div>

      <div className="dng-card">
        <h3>Address</h3>
        <div className="dng-grid">
          <div className="dng-form-group">
            <label>Street</label>
            <input type="text" value="4th Floor, Alpha Tower" readOnly />
          </div>
          <div className="dng-form-group">
            <label>City</label>
            <input type="text" value="Bangalore" readOnly />
          </div>
          <div className="dng-form-group">
            <label>Zip Code</label>
            <input type="text" value="560001" readOnly />
          </div>
        </div>
      </div>

      <div className="dng-card">
        <h3>Contact</h3>
        <div className="dng-grid">
          <div className="dng-form-group">
            <label>Phone Number</label>
            <input type="text" value="+91 9876543210" readOnly />
          </div>
          <div className="dng-form-group">
            <label>WhatsApp</label>
            <input type="text" value="+91 9123456789" readOnly />
          </div>
          <div className="dng-form-group">
            <label>Toll-Free</label>
            <input type="text" value="1800-123-456" readOnly />
          </div>
        </div>
      </div>

      <div className="dng-card">
        <h3>Social Media</h3>
        <div className="dng-grid">
          <div className="dng-form-group">
            <label>Facebook</label>
            <input type="text" value="https://facebook.com/birdmytrip" readOnly />
          </div>
          <div className="dng-form-group">
            <label>Twitter</label>
            <input type="text" value="https://twitter.com/birdmytrip" readOnly />
          </div>
          <div className="dng-form-group">
            <label>LinkedIn</label>
            <input type="text" value="https://linkedin.com/company/birdmytrip" readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanySetting;
