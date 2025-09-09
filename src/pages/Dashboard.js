import React from 'react';
import './Dashboard.css';
import {
  Plane, Hotel, Users, CreditCard, CalendarDays
} from 'lucide-react';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to BirdMyTrip Admin Panel</h2>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <Plane className="card-icon" />
          <div>
            <h4>Flights</h4>
            <p>1,280</p>
          </div>
        </div>
        <div className="card">
          <Hotel className="card-icon" />
          <div>
            <h4>Hotels</h4>
            <p>965</p>
          </div>
        </div>
        <div className="card">
          <Users className="card-icon" />
          <div>
            <h4>Users</h4>
            <p>23,410</p>
          </div>
        </div>
        <div className="card">
          <CreditCard className="card-icon" />
          <div>
            <h4>Revenue</h4>
            <p>₹12.5 Cr</p>
          </div>
        </div>
        <div className="card">
          <CalendarDays className="card-icon" />
          <div>
            <h4>Bookings</h4>
            <p>7,120</p>
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="graph-section">
        <h3>Monthly Booking Trends</h3>
        <div className="graph-placeholder">
          {/* This is a dummy graph area. Replace with Recharts/Chart.js if needed */}
          <img src="https://www.chartjs.org/img/chartjs-logo.svg" alt="Dummy Graph" className="dummy-graph" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
