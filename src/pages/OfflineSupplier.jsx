// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './OfflineSupplier.css';

// const OfflineSupplier = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [services, setServices] = useState([]); // <-- Service list for dropdown

//   useEffect(() => {
//     axios.get('http://localhost:9000/api/suppliers')
//       .then(res => {
//         setSuppliers(res.data);

//         // Create unique list of services for filter dropdown
//         const uniqueServices = [
//           ...new Set(res.data.map(s => s.service.split(',').map(val => val.trim())).flat())
//         ];
//         setServices(uniqueServices);
//       })
//       .catch(err => console.error('Error fetching suppliers:', err));
//   }, []);

//   return (
//     <div className="offline-supplier-container">
//       <div className="header-bar">
//         <div className="filters">
//           <select>
//             <option value="">All Services</option>
//             {services.map((srv, i) => (
//               <option key={i} value={srv}>{srv}</option>
//             ))}
//           </select>
//           <input type="text" placeholder="Search by value" />
//           <input type="date" />
//           <input type="date" />
//           <button className="search-btn">🔍</button>
//         </div>
//         <div className="actions">
//           <button className="btn purple">+ Add Offline Supplier</button>
//           <button className="btn blue">Change Status</button>
//         </div>
//       </div>

//       <div className="supplier-table">
//         <table>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Service</th>
//               <th>Supplier Name</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>Status</th>
//               <th>Created</th>
//               <th>Modified</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {suppliers.map((item, i) => (
//               <tr key={item._id}>
//                 <td>{i + 1}</td>
//                 <td>{item.service || '-'}</td>
//                 <td>{item.supplierName || '-'}</td>
//                 <td>{item.email || '-'}</td>
//                 <td>{item.mobile || '-'}</td>
//                 <td>
//                   <span className={`status ${item.status?.toLowerCase()}`}>
//                     {item.status}
//                   </span>
//                 </td>
//                 <td>{new Date(item.createdAt).toLocaleString()}</td>
//                 <td>{item.modifiedAt ? new Date(item.modifiedAt).toLocaleString() : '-'}</td>
//                 <td><button className="edit-btn">✏️</button></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="pagination">Total {suppliers.length} records found</div>
//       </div>
//     </div>
//   );
// };

// export default OfflineSupplier;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OfflineSupplier.css';

const initialForm = {
  supplierName: '',
  email: '',
  mobile: '',
  service: '',
  status: 'Active',
};

const OfflineSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:9000/api/suppliers/${editingId}`, form);
      } else {
        await axios.post('http://localhost:9000/api/suppliers', form);
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (supplier) => {
    setForm(supplier);
    setEditingId(supplier._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await axios.delete(`http://localhost:9000/api/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (supplier) => {
    const newStatus = supplier.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`http://localhost:9000/api/suppliers/status/${supplier._id}`, {
        status: newStatus,
      });
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="offline-supplier-container">
      <div className="header-bar">
        <h2>Offline Supplier Management</h2>
        <button
          className="btn purple"
          onClick={() => {
            setForm(initialForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          + Add Offline Supplier
        </button>
      </div>

      {showForm && (
        <div className="form-box">
          <input name="supplierName" value={form.supplierName} onChange={handleChange} placeholder="Supplier Name" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile" />
          <input name="service" value={form.service} onChange={handleChange} placeholder="Service" />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button onClick={handleSubmit}>{editingId ? 'Update' : 'Add'}</button>
        </div>
      )}

      <div className="supplier-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Service</th>
              <th>Supplier</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Created</th>
              <th>Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.service}</td>
                <td>{item.supplierName}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>
                  <span
                    className={`status ${item.status.toLowerCase()}`}
                    onClick={() => toggleStatus(item)}
                  >
                    {item.status}
                  </span>
                </td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
                <td>{new Date(item.modifiedAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>✏️</button>
                  <button onClick={() => handleDelete(item._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">Total: {suppliers.length}</div>
      </div>
    </div>
  );
};

export default OfflineSupplier;
