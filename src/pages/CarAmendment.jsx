import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./CarAmendment.css";

function CarAmendment() {
  const [amendments, setAmendments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    amendmentId: '',
    amendmentType: '',
    status: '',
    destination: '',
    car: '',
    type: '',
    travelDate: '',
    companyName: '',
    bookingSource: '',
    bookingStatus: '',
    remark: '',
    createdBy: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchAmendments = async () => {
    const res = await axios.get("/api/car-amendments");
    setAmendments(res.data);
  };

  useEffect(() => {
    fetchAmendments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/car-amendments/${editingId}`, formData);
    } else {
      await axios.post("/api/car-amendments", formData);
    }
    fetchAmendments();
    setFormOpen(false);
    setFormData({
      amendmentId: '', amendmentType: '', status: '', destination: '', car: '', type: '',
      travelDate: '', companyName: '', bookingSource: '', bookingStatus: '', remark: '', createdBy: ''
    });
    setEditingId(null);
  };

  const handleEdit = (amendment) => {
    setFormData(amendment);
    setEditingId(amendment._id);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/car-amendments/${id}`);
    fetchAmendments();
  };

  return (
    <div className="car-amendment-container">
      <div className="header">
        <h2>Car Amendments List</h2>
        <button onClick={() => setFormOpen(true)}>+ Add Amendment</button>
      </div>

      {formOpen && (
        <form className="amendment-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="amendmentId" placeholder="Amendment ID" value={formData.amendmentId} onChange={handleInputChange} required />
            <input name="amendmentType" placeholder="Type" value={formData.amendmentType} onChange={handleInputChange} required />
            <input name="status" placeholder="Status" value={formData.status} onChange={handleInputChange} required />
            <input name="destination" placeholder="Destination" value={formData.destination} onChange={handleInputChange} />
          </div>
          <div className="form-row">
            <input name="car" placeholder="Car" value={formData.car} onChange={handleInputChange} />
            <input name="type" placeholder="Type" value={formData.type} onChange={handleInputChange} />
            <input name="travelDate" type="date" value={formData.travelDate} onChange={handleInputChange} />
          </div>
          <div className="form-row">
            <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleInputChange} />
            <input name="bookingSource" placeholder="Booking Source" value={formData.bookingSource} onChange={handleInputChange} />
            <input name="bookingStatus" placeholder="Booking Status" value={formData.bookingStatus} onChange={handleInputChange} />
          </div>
          <div className="form-row">
            <input name="remark" placeholder="Remark" value={formData.remark} onChange={handleInputChange} />
            <input name="createdBy" placeholder="Created By" value={formData.createdBy} onChange={handleInputChange} />
          </div>
          <button type="submit">{editingId ? 'Update' : 'Save'}</button>
        </form>
      )}

      <table className="amendment-table">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Type</th>
            <th>Status</th>
            <th>Destination</th>
            <th>Car</th>
            <th>Date</th>
            <th>Company</th>
            <th>Source</th>
            <th>Booking</th>
            <th>Remark</th>
            <th>By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {amendments.map((item, i) => (
            <tr key={i}>
              <td>{item.amendmentId}</td>
              <td>{item.amendmentType}</td>
              <td>{item.status}</td>
              <td>{item.destination}</td>
              <td>{item.car}</td>
              <td>{item.travelDate}</td>
              <td>{item.companyName}</td>
              <td>{item.bookingSource}</td>
              <td>{item.bookingStatus}</td>
              <td>{item.remark}</td>
              <td>{item.createdBy}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CarAmendment;