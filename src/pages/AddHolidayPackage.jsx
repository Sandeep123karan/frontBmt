import React, { useState } from 'react';
import './AddHolidayPackage.css';

function AddHolidayPackage() {
  const [form, setForm] = useState({
    packageName: '',
    slug: '',
    nights: '',
    departureDate: '',
    standardPrice: '',
    deluxePrice: '',
    luxuryPrice: '',
    tcsRate: '',
    packageImage: null,
    packageIncludes: '',
    showOnHome: false,
    priceOnRequest: false,
    halal: false,
    bookOnline: false,
    passportAdult: false,
    passportChild: false,
    domestic: false,
    panRequiredAdult: false,
    panRequiredChild: false,
    metaRobots: 'INDEX, FOLLOW',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: ''
  });

  const [selectedThemes, setSelectedThemes] = useState([]);
  const [savedPackages, setSavedPackages] = useState([]);

  const themes = [
    "California", "Indonesia", "Belgium",
    "New York City", "Romania", "India",
    "New Jersey", "Denmark"
  ];

  const handleThemeChange = (theme) => {
    setSelectedThemes(prev =>
      prev.includes(theme)
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const saved = {
      ...form,
      themes: selectedThemes,
      packageImage: form.packageImage?.name || 'N/A'
    };

    setSavedPackages([...savedPackages, saved]);
    setForm({
      packageName: '',
      slug: '',
      nights: '',
      departureDate: '',
      standardPrice: '',
      deluxePrice: '',
      luxuryPrice: '',
      tcsRate: '',
      packageImage: null,
      packageIncludes: '',
      showOnHome: false,
      priceOnRequest: false,
      halal: false,
      bookOnline: false,
      passportAdult: false,
      passportChild: false,
      domestic: false,
      panRequiredAdult: false,
      panRequiredChild: false,
      metaRobots: 'INDEX, FOLLOW',
      metaTitle: '',
      metaKeyword: '',
      metaDescription: ''
    });
    setSelectedThemes([]);
  };

  return (
    <div className="holiday-container">
      <form className="holiday-form-wrapper" onSubmit={handleSubmit}>
        <h2>Add Holiday Package</h2>

        <div className="grid-container">
          <input name="packageName" placeholder="Package Name" value={form.packageName} onChange={handleChange} />
          <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} />
          <input type="file" name="packageImage" onChange={handleChange} />
          <input type="date" name="departureDate" value={form.departureDate} onChange={handleChange} />
          <input name="nights" placeholder="No of Nights" value={form.nights} onChange={handleChange} />
          <input name="standardPrice" placeholder="Standard Price" value={form.standardPrice} onChange={handleChange} />
          <input name="deluxePrice" placeholder="Deluxe Price" value={form.deluxePrice} onChange={handleChange} />
          <input name="luxuryPrice" placeholder="Luxury Price" value={form.luxuryPrice} onChange={handleChange} />
          <input name="tcsRate" placeholder="TCS Rate" value={form.tcsRate} onChange={handleChange} />
          <input name="packageIncludes" placeholder="Package Includes" value={form.packageIncludes} onChange={handleChange} />
        </div>

        <div className="checkboxes">
          {['priceOnRequest', 'halal', 'bookOnline', 'passportAdult', 'passportChild', 'domestic', 'panRequiredAdult', 'panRequiredChild', 'showOnHome'].map((field) => (
            <label key={field}>
              <input type="checkbox" name={field} checked={form[field]} onChange={handleChange} />
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
          ))}
        </div>

        <h3>Themes</h3>
        <div className="theme-grid">
          {themes.map((theme) => (
            <label key={theme}>
              <input type="checkbox" checked={selectedThemes.includes(theme)} onChange={() => handleThemeChange(theme)} />
              {theme}
            </label>
          ))}
        </div>

        <h3>SEO Info</h3>
        <div className="seo-box">
          <select name="metaRobots" onChange={handleChange} value={form.metaRobots}>
            <option value="INDEX, FOLLOW">INDEX, FOLLOW</option>
            <option value="NOINDEX, NOFOLLOW">NOINDEX, NOFOLLOW</option>
          </select>
          <input name="metaTitle" placeholder="Meta Title" value={form.metaTitle} onChange={handleChange} />
          <input name="metaKeyword" placeholder="Meta Keyword" value={form.metaKeyword} onChange={handleChange} />
          <textarea name="metaDescription" placeholder="Meta Description" value={form.metaDescription} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button">Save & Continue</button>
        </div>
      </form>

      {savedPackages.length > 0 && (
        <div className="table-wrapper">
          <h3>Saved Holiday Packages</h3>
          <table>
            <thead>
              <tr>
                <th>Package</th>
                <th>Slug</th>
                <th>Nights</th>
                <th>Departure</th>
                <th>Price</th>
                <th>Themes</th>
              </tr>
            </thead>
            <tbody>
              {savedPackages.map((pkg, index) => (
                <tr key={index}>
                  <td>{pkg.packageName}</td>
                  <td>{pkg.slug}</td>
                  <td>{pkg.nights}</td>
                  <td>{pkg.departureDate}</td>
                  <td>₹{pkg.standardPrice}</td>
                  <td>{pkg.themes.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AddHolidayPackage;
