import React, { useEffect, useState } from 'react';

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
        const res = await fetch('https://bmt-backend-1-vq3f.onrender.com/api/visaApplications');
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
        await fetch('https://bmt-backend-1-vq3f.onrender.com/api/visaApplications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
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
        await fetch(`https://bmt-backend-1-vq3f.onrender.com/api/visaApplications/${id}`, { method: 'DELETE' });
        fetchApplications();
    };

    return (
        <div>
            <h1>Visa Applications</h1>
            <form onSubmit={handleSubmit}>
                <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required/>
                <input name="passportNumber" placeholder="Passport Number" value={form.passportNumber} onChange={handleChange} required/>
                <input name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} required/>
                <input name="visaType" placeholder="Visa Type" value={form.visaType} onChange={handleChange} required/>
                <input name="stayDuration" placeholder="Stay Duration" value={form.stayDuration} onChange={handleChange}/>
                <button type="submit">Add Application</button>
            </form>

            <ul>
                {applications.map(app => (
                    <li key={app._id}>
                        {app.fullName} - {app.passportNumber} - {app.visaType} 
                        <button onClick={() => handleDelete(app._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VisaApplications;
