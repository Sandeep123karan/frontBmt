// import React, { useEffect, useState } from 'react';
// import "./VisaApplications.css";

// function VisaApplications() {
//     const [applications, setApplications] = useState([]);
//     const [form, setForm] = useState({
//         fullName: '',
//         passportNumber: '',
//         nationality: '',
//         visaType: '',
//         stayDuration: '',
//     });

//     const fetchApplications = async () => {
//         const res = await fetch('http://localhost:9000/api/visaApplications');
//         const data = await res.json();
//         setApplications(data);
//     };

//     useEffect(() => {
//         fetchApplications();
//     }, []);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await fetch('http://localhost:9000/api/visaApplications', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(form),
//         });
//         setForm({
//             fullName: '',
//             passportNumber: '',
//             nationality: '',
//             visaType: '',
//             stayDuration: '',
//         });
//         fetchApplications();
//     };

//     const handleDelete = async (id) => {
//         await fetch(`http://localhost:9000/api/visaApplications/${id}`, { method: 'DELETE' });
//         fetchApplications();
//     };

//     return (
//         <div>
//             <h1>Visa Applications</h1>
//             <form onSubmit={handleSubmit}>
//                 <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required/>
//                 <input name="passportNumber" placeholder="Passport Number" value={form.passportNumber} onChange={handleChange} required/>
//                 <input name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} required/>
//                 <input name="visaType" placeholder="Visa Type" value={form.visaType} onChange={handleChange} required/>
//                 <input name="stayDuration" placeholder="Stay Duration" value={form.stayDuration} onChange={handleChange}/>
//                 <button type="submit">Add Application</button>
//             </form>

//             <ul>
//                 {applications.map(app => (
//                     <li key={app._id}>
//                         {app.fullName} - {app.passportNumber} - {app.visaType} 
//                         <button onClick={() => handleDelete(app._id)}>Delete</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default VisaApplications;
import React, { useEffect, useState } from 'react';
import "./VisaApplications.css";

function VisaApplications() {
    const [applications, setApplications] = useState([]);
    const [form, setForm] = useState({
        fullName: '',
        passportNumber: '',
        nationality: '',
        visaType: '',
        stayDuration: '',
    });

    const fetchApplications = async () => {
        const res = await fetch('http://localhost:9000/api/visaApplications');
        const data = await res.json();
        setApplications(data);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:9000/api/visaApplications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        // Reset form after saving
        setForm({
            fullName: '',
            passportNumber: '',
            nationality: '',
            visaType: '',
            stayDuration: '',
        });

        fetchApplications();
    };

    const handleDelete = async (id) => {
        await fetch(`http://localhost:9000/api/visaApplications/${id}`, {
            method: 'DELETE'
        });
        fetchApplications();
    };

    return (
        <div className="visa-container">

            <h1>Visa Applications</h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="visa-form">
                <input
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                />
                <input
                    name="passportNumber"
                    placeholder="Passport Number"
                    value={form.passportNumber}
                    onChange={handleChange}
                    required
                />
                <input
                    name="nationality"
                    placeholder="Nationality"
                    value={form.nationality}
                    onChange={handleChange}
                    required
                />
                <input
                    name="visaType"
                    placeholder="Visa Type"
                    value={form.visaType}
                    onChange={handleChange}
                    required
                />
                <input
                    name="stayDuration"
                    placeholder="Stay Duration"
                    value={form.stayDuration}
                    onChange={handleChange}
                />

                <button type="submit" className="submit-btn">
                    Add Application
                </button>
            </form>

            {/* DATA LIST */}
            <div className="visa-data-wrapper">
                <h2 className="visa-data-title">Saved Applications</h2>

                <ul className="visa-list">
                    {applications.map((app) => (
                        <li key={app._id} className="visa-item">

                            {/* Card heading */}
                            <div className="visa-item-header">
                                {app.fullName}
                            </div>

                            {/* Card Inner Grid */}
                            <div className="visa-item-grid">
                                <div>
                                    <span className="visa-item-label">Passport:</span> {app.passportNumber}
                                </div>
                                <div>
                                    <span className="visa-item-label">Nationality:</span> {app.nationality}
                                </div>
                                <div>
                                    <span className="visa-item-label">Visa Type:</span> {app.visaType}
                                </div>
                                <div>
                                    <span className="visa-item-label">Stay Duration:</span> {app.stayDuration || "N/A"}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(app._id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
}

export default VisaApplications;
