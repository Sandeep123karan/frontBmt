import React, { useState, useEffect } from 'react';
import "./Admin.css";
import "./SettingsContent.css";
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu,
  User,
  Plane,
  Hotel,
  Share2,
  Building,
  ShieldCheck,
  Mail,
  Globe,
  Users,
  FileText,
  Gift,
  CreditCard,
  Ticket,
  BarChart3,
  ClipboardList,
  CalendarCheck,
  UploadCloud,
  Replace,
  Power,
  ListChecks,
  Car,
  MapPin,
  Phone,
  Package,
  Calendar,
  Search,
  Edit,
  LogOut,
  PlusCircle,
  List,
  MessageCircle,
  PenTool,
  Megaphone,
  Image,
  UserCheck,
  Star
} from "lucide-react";

export default function AdminSettingsLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  const handleDropdownToggle = (key) => {
    setDropdownOpen(dropdownOpen === key ? '' : key);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen('');
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarVisible(true);
        setMobileMenuOpen(false);
      } else {
        setSidebarVisible(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.admin-sidebar') && !event.target.closest('.mobile-hamburger')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const renderDropdownItem = (path, label, Icon) => (
    <NavLink 
      to={path} 
      className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
      onClick={isMobile ? closeMobileMenu : undefined}
    >
      <Icon className="icon" /> {label}
    </NavLink>
  );

  const renderSidebarItem = (path, label, Icon) => (
    <NavLink 
      to={path} 
      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
      onClick={isMobile ? closeMobileMenu : undefined}
    >
      <Icon className="icon" /> {!isCollapsed && label}
    </NavLink>
  );

  return (
    <div className="admin-settings-container">
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="mobile-overlay active" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && mobileMenuOpen ? 'mobile-visible' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">{!isCollapsed && 'Admin Panel'}</h2>
          {isMobile ? (
            <div className="hamburger" onClick={closeMobileMenu} />
          ) : (
            <Menu className="hamburger" onClick={toggleCollapse} />
          )}
        </div>

        <nav className="sidebar-scrollable">
          {renderSidebarItem("/admin/dashboard", "Dashboard", LayoutDashboard)}

          {/* Settings */}
          {/* <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('settings')}>
            <Settings className="icon" /> 
            {!isCollapsed && 'Settings'} 
            {!isCollapsed && (dropdownOpen === 'settings' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'settings' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/setting", "Company Settings", Building)}
              {renderDropdownItem("/admin/user-management", "User Management", Users)}
              {renderDropdownItem("/admin/offline-supplier", "Offline Supplier", Globe)}
              {renderDropdownItem("/admin/flight-airport-list", "Flight Airport List", Plane)}
              {renderDropdownItem("/admin/flight-airline-list", "Flight Airline List", Plane)}
              {renderDropdownItem("/admin/flight-fare-type", "Flight Fare Type", CreditCard)}
              {renderDropdownItem("/admin/convience-fee", "Convenience Fee", Ticket)}
            </div>
          )} */}

          {/* Account Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('account')}>
            <User className="icon" /> 
            {!isCollapsed && 'Account Management'} 
            {!isCollapsed && (dropdownOpen === 'account' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'account' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/AgentPaymentHistory", "Agent Payment History", ShieldCheck)}
              {renderDropdownItem("/admin/online-transaction", "Online Transaction", CreditCard)}
              {renderDropdownItem("/admin/payments", "Admin Payments", CreditCard)}

            </div>
          )}
          {/* Campsite Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("campsite")}
>
  <Star className="icon" />
  {!isCollapsed && "Campsite Management"}
  {!isCollapsed &&
    (dropdownOpen === "campsite" ? <ChevronUp /> : <ChevronDown />)}
</div>
{dropdownOpen === "campsite" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/campsite-management", "Campsite List", List)}
    {renderDropdownItem("/admin/campsite-booking", "Campsite Booking", Calendar)}
  </div>
)}

{/* {dropdownOpen === "campsite" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/campsite-management", "Campsite List", List)}
  </div>
)} */}
{/* Holiday Park Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("holidaypark")}
>
  <Star className="icon" />
  {!isCollapsed && "Holiday Park Management"}
  {!isCollapsed &&
    (dropdownOpen === "holidaypark" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "holidaypark" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/holidaypark-management", "Holiday Park List", List)}
      {renderDropdownItem("/admin/holidaypark-app", "Holiday Park App", PlusCircle)}
  </div>
)}
{/* Vacation House Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("vacationhouse")}
>
  <Building className="icon" />
  {!isCollapsed && "Vacation House Management"}
  {!isCollapsed &&
    (dropdownOpen === "vacationhouse" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "vacationhouse" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/vacationhouse-management", "Vacation House List", List)}
    {renderDropdownItem("/admin/vacation-bookings", "Vacation Bookings", Calendar)}
  </div>
)}
{/* Farmstay Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("farmstay")}
>
  <Star className="icon" />
  {!isCollapsed && "Farmstay Management"}
  {!isCollapsed &&
    (dropdownOpen === "farmstay" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "farmstay" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/farmstay-management", "Farmstay List", List)}
    {renderDropdownItem("/admin/farmstay-bookings", "Farmstay Bookings", Calendar)}
  </div>
)}
{/* Love Hotel Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("lovehotel")}
>
  <Star className="icon" />
  {!isCollapsed && "Love Hotel Management"}
  {!isCollapsed &&
    (dropdownOpen === "lovehotel" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "lovehotel" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/lovehotel-management", "Love Hotel List", List)}
     {renderDropdownItem("/admin/lovehotel-bookings", "Love Hotel Bookings", Calendar)}
  </div>
)}
          {/* Motel Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("motel")}
>
  <Building className="icon" />
  {!isCollapsed && "Motel Management"}
  {!isCollapsed &&
    (dropdownOpen === "motel" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "motel" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/motel-management", "Motel List", List)}
      {renderDropdownItem("/admin/motel-bookings", "Motel Bookings", Calendar)}
  </div>
)}
{/* Hostel Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("hostel")}
>
  <Building className="icon" />
  {!isCollapsed && "Hostel Management"}
  {!isCollapsed &&
    (dropdownOpen === "hostel" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "hostel" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/hostel-management", "Hostel List", List)}
      {renderDropdownItem("/admin/hostel-booking", "Hostel Booking", Calendar)}
  </div>
)}

          {/* Flight Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('flight')}>
            <Plane className="icon" /> 
            {!isCollapsed && 'Flight Management'} 
            {!isCollapsed && (dropdownOpen === 'flight' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'flight' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/flights/markup", "Flight MarkUp", BarChart3)}
              {renderDropdownItem("/admin/flights/discount", "Flight Discount", Gift)}
              {renderDropdownItem("/admin/flights/booking-list", "Flight Booking List", ClipboardList)}
              {renderDropdownItem("/admin/flights/booking-calendar", "Flight Booking Calendar", CalendarCheck)}
              {renderDropdownItem("/admin/flights/amendment-list", "Amendment List", FileText)}
              {renderDropdownItem("/admin/flights/upload-ticket", "Flight Upload Ticket", UploadCloud)}
              {renderDropdownItem("/admin/flights/coupon-list", "Flight Coupon List", Ticket)}
              {renderDropdownItem("/admin/flights/top-destination", "Flight Top Destination", Globe)}
              {renderDropdownItem("/admin/flights/top-route", "Flight Top Routes", Plane)}
              {renderDropdownItem("/admin/flights/web-checkin", "Web Check In", Share2)}
              {renderDropdownItem("/admin/flights/airline-replace", "Airline Replace", Replace)}
              {renderDropdownItem("/admin/flights/offline", "Offline Flight", Power)}
              {renderDropdownItem("/admin/flights/supplier-management", "Supplier Management", Building)}
              {renderDropdownItem("/admin/flights/import-tickets", "Import Tickets", UploadCloud)}
              {renderDropdownItem("/admin/flights/flight-log-tracker", "Flight Log Tracker", ListChecks)}
              {renderDropdownItem("/admin/flights/flight-query-list", "Flight Query List", FileText)}
            </div>
          )}
          {/* Place Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("place")}
>
  <MapPin className="icon" />
  {!isCollapsed && "Place Management"}
  {!isCollapsed &&
    (dropdownOpen === "place" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "place" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/place-management", "Place List", List)}
     {renderDropdownItem("/admin/place-bookings", "Place Bookings", Calendar)}
  </div>
)}


          {/* Flight Extranet Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('flight-extranet')}>
            <Share2 className="icon" /> 
            {!isCollapsed && 'Flight Extranet Management'} 
            {!isCollapsed && (dropdownOpen === 'flight-extranet' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'flight-extranet' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/Extranet/add-inventory", "Add Inventory", UploadCloud)}
              {renderDropdownItem("/admin/Extranet/private-fare-list", "Private Fare List", Ticket)}
              {renderDropdownItem("/admin/Extranet/rule-list-manage", "Rule List Manage", FileText)}
              {renderDropdownItem("/admin/Extranet/add-fare-rule", "Add Fare Rule", FileText)}
            </div>
          )}
          

          {/* Hotel Management */}
          {/* <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('hotel')}>
            <Hotel className="icon" /> 
            {!isCollapsed && 'Hotel Management'} 
            {!isCollapsed && (dropdownOpen === 'hotel' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'hotel' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/hotels/markup", "Hotel Markup", BarChart3)}
              {renderDropdownItem("/admin/hotels/discount", "Hotel Discount", Gift)}
              {renderDropdownItem("/admin/hotels/booking-list", "Hotel Booking List", ClipboardList)}
              {renderDropdownItem("/admin/hotels/amendment-list", "Hotel Amendment List", FileText)}
              {renderDropdownItem("/admin/hotels/uploads", "Hotel Uploads", UploadCloud)}
              {renderDropdownItem("/admin/hotels/coupon-list", "Hotel Coupon List", Ticket)}
            </div>
          )} */}
          
          {/* Homestay Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("homestay")}
>
  <Building className="icon" />
  {!isCollapsed && "Homestay Management"}
  {!isCollapsed &&
    (dropdownOpen === "homestay" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "homestay" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/homestay-management", "Homestay List", List)}
     {renderDropdownItem("/admin/homestay-bookings", "Homestay Bookings", Calendar)}

  </div>
)}
{/* Houseboat Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("houseboat")}
>
  <Building className="icon" />
  {!isCollapsed && "Houseboat Management"}
  {!isCollapsed &&
    (dropdownOpen === "houseboat" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "houseboat" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/houseboat-management", "Houseboat List", List)}
     {renderDropdownItem("/admin/houseboat-bookings", "Houseboat Bookings", Calendar)}
     
  </div>
)}
          {/* Apartment Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("apartment")}
>
  <Building className="icon" />
  {!isCollapsed && "Apartment Management"}
  {!isCollapsed &&
    (dropdownOpen === "apartment" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "apartment" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/apartment-management", "Apartment List", List)}
    {renderDropdownItem("/admin/admin-bookings", "All Bookings List", Calendar)}
  </div>
)}
{/* Guesthouse Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("guesthouse")}
>
  <Building className="icon" />
  {!isCollapsed && "Guest House Management"}
  {!isCollapsed &&
    (dropdownOpen === "guesthouse" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "guesthouse" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/guesthouse-management", "Guest House List", List)}
    {renderDropdownItem("/admin/guesthouse-bookings", "Guest House Bookings", Calendar)}
  </div>
)}
{/* Lounge Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("lounge")}
>
  <Building className="icon" />
  {!isCollapsed && "Lounge Management"}
  {!isCollapsed &&
    (dropdownOpen === "lounge" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "lounge" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/lounge-management", "Lounge List", List)}
     {renderDropdownItem("/admin/lounge-bookings", "Lounge Bookings", Calendar)}
  </div>
)}

{/* Resort Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("resort")}
>
  <Building className="icon" />
  {!isCollapsed && "Resort Management"}
  {!isCollapsed &&
    (dropdownOpen === "resort" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "resort" && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/resort-management", "Resort List", List)}
     {renderDropdownItem("/admin/resort-bookings", "Resort Bookings", Calendar)}
  </div>
)}

          {/* Hotel Extranet Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('hotel-extranet')}>
            <Share2 className="icon" /> 
            {!isCollapsed && 'Hotel Extranet Management'} 
            {!isCollapsed && (dropdownOpen === 'hotel-extranet' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'hotel-extranet' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/hotel-extranet/add-hotel", "Add Hotel", Hotel)}
              {renderDropdownItem("/admin/hotel-extranet/hotel-list", "Hotel List", ClipboardList)}
              {renderDropdownItem("/admin/hotel-extranet/hotel-settings", "Hotel Settings", Settings)}
            </div>
          )}

          {/* Holiday Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('holiday')}>
            <Package className="icon" /> 
            {!isCollapsed && 'Holiday Management'} 
            {!isCollapsed && (dropdownOpen === 'holiday' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'holiday' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/holidays/holiday-list", "Holiday List", ClipboardList)}
              {renderDropdownItem("/admin/holidays/add-holiday-package", "Add Holiday Package", Package)}
              {renderDropdownItem("/admin/holidays/booking-list", "Holiday Booking List", CalendarCheck)}
              {renderDropdownItem("/admin/holidays/amendment-list", "Holiday Amendment List", FileText)}
              {renderDropdownItem("/admin/holidays/query-list", "Holiday Query List", Search)}
              {renderDropdownItem("/admin/holidays/markup", "Holiday Markup", BarChart3)}
              {renderDropdownItem("/admin/holidays/discount", "Holiday Discount", Gift)}
              {renderDropdownItem("/admin/holidays/coupon-list", "Holiday Coupon List", Ticket)}
              {renderDropdownItem("/admin/holidays/themes-list", "Holiday Themes List", Star)}
            </div>
          )}

          {/* Car Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('car')}>
            <Car className="icon" /> 
            {!isCollapsed && 'Car Management'} 
            {!isCollapsed && (dropdownOpen === 'car' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'car' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/car/info-list", "Car Info List", ClipboardList)}
              {renderDropdownItem("/admin/car/booking-list", "Car Booking List", Calendar)}
              {renderDropdownItem("/admin/car/amendment-list", "Amendment List", FileText)}
              {renderDropdownItem("/admin/car/enquire-list", "Car Enquire List", Search)}
              {renderDropdownItem("/admin/car/markup", "Car Markup", BarChart3)}
              {renderDropdownItem("/admin/car/discount", "Car Discount", Gift)}
              {renderDropdownItem("/admin/car/coupon-list", "Car Coupon List", Ticket)}
              {renderDropdownItem("/admin/car/settings", "Car Settings", Settings)}
            </div>
          )}

          {/* Bus Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('bus')}>
            <Car className="icon" /> 
            {!isCollapsed && 'Bus Management'} 
            {!isCollapsed && (dropdownOpen === 'bus' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'bus' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/bus/admin-panel", "Bus Admin Panel", List)}

              {renderDropdownItem("/admin/bus/route-list", "Bus Route List", MapPin)}
              {renderDropdownItem("/admin/bus/booking-list", "Bus Booking List", ClipboardList)}
              {renderDropdownItem("/admin/bus/amendment-list", "Amendment List", FileText)}
              {renderDropdownItem("/admin/bus/query-list", "Bus Query List", Search)}
              {renderDropdownItem("/admin/bus/markup", "Bus Markup", BarChart3)}
              {renderDropdownItem("/admin/bus/discount", "Bus Discount", Gift)}
              {renderDropdownItem("/admin/bus/coupon-list", "Bus Coupon List", Ticket)}
              {renderDropdownItem("/admin/bus/settings", "Bus Settings", Settings)}
            </div>
          )}

          {/* Train Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('train')}>
            <Gift className="icon" /> 
            {!isCollapsed && 'Train Management'} 
            {!isCollapsed && (dropdownOpen === 'train' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'train' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/train/route-list", "Train Route List", MapPin)}
              {renderDropdownItem("/admin/train/booking-list", "Train Booking List", ClipboardList)}
              {renderDropdownItem("/admin/train/amendment-list", "Amendment List", FileText)}
              {renderDropdownItem("/admin/train/query-list", "Train Query List", Search)} 
              {renderDropdownItem("/admin/train/markup", "Train Markup", BarChart3)}
              {renderDropdownItem("/admin/train/discount", "Train Discount", Gift)}
              {renderDropdownItem("/admin/train/coupon-list", "Train Coupon List", Ticket)}
              {renderDropdownItem("/admin/train/settings", "Train Settings", Settings)}
              {renderDropdownItem("/admin/train/pnr-status", "PNR Status Check", ListChecks)}
            </div>
          )}

          {/* Currency & Forex Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('forex')}>
            <CreditCard className="icon" /> 
            {!isCollapsed && 'Currency & Forex'} 
            {!isCollapsed && (dropdownOpen === 'forex' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'forex' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/forex/exchange-rates", "Exchange Rates", BarChart3)}
              {renderDropdownItem("/admin/forex/currency-list", "Currency List", ClipboardList)}
              {renderDropdownItem("/admin/forex/forex-cards", "Forex Cards", CreditCard)}
              {renderDropdownItem("/admin/forex/money-transfer", "Money Transfer", Share2)}
              {renderDropdownItem("/admin/forex/booking-list", "Forex Booking List", Calendar)}
              {renderDropdownItem("/admin/forex/markup", "Forex Markup", BarChart3)}
              {renderDropdownItem("/admin/forex/settings", "Forex Settings", Settings)}
            </div>
          )}

          {/* Visa Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('visa')}>
            <FileText className="icon" /> 
            {!isCollapsed && 'Visa Management'} 
            {!isCollapsed && (dropdownOpen === 'visa' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'visa' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/visa/country-list", "Visa Country List", Globe)}
              {renderDropdownItem("/admin/visa/document-list", "Document Requirements", FileText)}
              {renderDropdownItem("/admin/visa/application-list", "Visa Applications", ClipboardList)}
              {renderDropdownItem("/admin/visa/booking-list", "Visa Booking List", Calendar)}
              {renderDropdownItem("/admin/visa/status-tracker", "Status Tracker", ListChecks)}
              {renderDropdownItem("/admin/visa/markup", "Visa Markup", BarChart3)}
              {renderDropdownItem("/admin/visa/discount", "Visa Discount", Gift)}
              {renderDropdownItem("/admin/visa/settings", "Visa Settings", Settings)}
            </div>
          )}

          {/* Travel Insurance Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('insurance')}>
            <ShieldCheck className="icon" /> 
            {!isCollapsed && 'Travel Insurance'} 
            {!isCollapsed && (dropdownOpen === 'insurance' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'insurance' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/insurance/policy-list", "Insurance Policies", ClipboardList)}
              {renderDropdownItem("/admin/insurance/claim-list", "Claims Management", FileText)}
              {renderDropdownItem("/admin/insurance/booking-list", "Insurance Bookings", Calendar)}
              {renderDropdownItem("/admin/insurance/premium-calculator", "Premium Calculator", BarChart3)}
              {renderDropdownItem("/admin/insurance/providers", "Insurance Providers", Building)}
              {renderDropdownItem("/admin/insurance/markup", "Insurance Markup", BarChart3)}
              {renderDropdownItem("/admin/insurance/settings", "Insurance Settings", Settings)}
            </div>
          )}









          {/* Page Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('page')}>
            <FileText className="icon" /> 
            {!isCollapsed && 'Page Management'} 
            {!isCollapsed && (dropdownOpen === 'page' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'page' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/page/page-list", "Page List", ClipboardList)}
            </div>
          )}
{/* 
<div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('tour')}>
  <Car className="icon" /> 
  {!isCollapsed && 'Tour And Activities'} 
  {!isCollapsed && (dropdownOpen === 'tour' ? <ChevronUp /> : <ChevronDown />)}
</div>
{dropdownOpen === 'tour' && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/tour/info-list", "Tour Info List", ClipboardList)}
    {renderDropdownItem("/admin/tour/booking-list", "Tour Booking List", Calendar)}
    {renderDropdownItem("/admin/tour/amendment-list", "Amendment List", FileText)}
    {renderDropdownItem("/admin/tour/enquire-list", "Tour Enquire List", Search)}
    {renderDropdownItem("/admin/tour/markup", "Tour Markup", BarChart3)}
    {renderDropdownItem("/admin/tour/discount", "Tour Discount", Gift)}
    {renderDropdownItem("/admin/tour/coupon-list", "Tour Coupon List", Ticket)}
    {renderDropdownItem("/admin/tour/settings", "Tour Settings", Settings)}
  </div>
)} */}



{/* <div 
  className="sidebar-item dropdown-toggle" 
  onClick={() => setDropdownOpen('darshan')}
>
  <FileText className="icon" /> 
  {!isCollapsed && 'Darshan Management'} 
  {!isCollapsed && (dropdownOpen === 'darshan' ? <ChevronUp /> : <ChevronDown />)}
</div>
{dropdownOpen === 'darshan' && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/darshan/darshan-list", "Darshan List", ClipboardList)}
  </div> */}
{/* )} */}

<div 
  className="sidebar-item dropdown-toggle" 
  onClick={() => handleDropdownToggle('darshan')}
>
  <FileText className="icon" /> 
  {!isCollapsed && 'Darshan Management'} 
  {!isCollapsed && (dropdownOpen === 'darshan' ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === 'darshan' && !isCollapsed && (
  <div className="dropdown-menu">
    {renderDropdownItem("/admin/darshan/darshan-list", "Darshan List", ClipboardList)}
    {renderDropdownItem("/admin/darshan/darshan-bookings", "Darshan Bookings", Calendar)}
  </div>
)}







{/* Activity Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("activity")}
>
  <ListChecks className="icon" />
  {!isCollapsed && "Activity"}
  {!isCollapsed &&
    (dropdownOpen === "activity" ? <ChevronUp /> : <ChevronDown />)}
</div>
{dropdownOpen === "activity" && !isCollapsed && (
  <div className="dropdown-menu">
   {renderDropdownItem("/admin/activity/list", "Activity List", List)}
{renderDropdownItem("/admin/activity/add", "Add Activity", PlusCircle)}

  </div>
)}




 {/* Cruise Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('cruise')}>
            <MessageCircle className="icon" /> 
            {!isCollapsed && 'Cruise Management'} 
            {!isCollapsed && (dropdownOpen === 'query' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'cruise' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/cruise/add-cruise", "Add Cruise", PlusCircle)}
    {renderDropdownItem("/admin/cruise/manage-cruise", "Manage Cruise", List)}
    {renderDropdownItem("/admin/cruise/booking", "Cruise Booking", Calendar)}
            </div>
          )} 



{/* Club Management */}
<div
  className="sidebar-item dropdown-toggle"
  onClick={() => handleDropdownToggle("club")}
>
  <MessageCircle className="icon" />
  {!isCollapsed && "Club Management"}
  {!isCollapsed &&
    (dropdownOpen === "club" ? <ChevronUp /> : <ChevronDown />)}
</div>

{dropdownOpen === "club" && !isCollapsed && (
  <div className="dropdown-menu">
    {/* Members */}
    {renderDropdownItem("/admin/club/members", "Members", PlusCircle)}
   

    {/* Events */}
    {renderDropdownItem("/admin/club/events", "Events", Calendar)}
    

    {/* Bookings */}
    {renderDropdownItem("/admin/club/bookings", "Bookings", Calendar)}
    

    {/* Payments */}
    {renderDropdownItem("/admin/club/payments", "Payments", CreditCard)}

  </div>
)}






          {/* Query Management */}
          <div className="sidebar-item dropdown-toggle" onClick={() => handleDropdownToggle('query')}>
            <MessageCircle className="icon" /> 
            {!isCollapsed && 'Query Management'} 
            {!isCollapsed && (dropdownOpen === 'query' ? <ChevronUp /> : <ChevronDown />)}
          </div>
          {dropdownOpen === 'query' && !isCollapsed && (
            <div className="dropdown-menu">
              {renderDropdownItem("/admin/query/contact-us", "Contact Us", Phone)}
            </div>
          )}

          {/* <div className="sidebar-item logout-item" onClick={() => console.log('Logout')}>
            <LogOut className="icon" /> {!isCollapsed && 'Logout'}
          </div> */}
          <div
  className="sidebar-item logout-item"
  onClick={() => {
    localStorage.removeItem("adminToken"); // ✅ token delete
    window.location.href = "/"; // ✅ login page redirect
  }}
>
  <LogOut className="icon" /> {!isCollapsed && 'Logout'}
</div>

        </nav>
      </aside>

      <div className="admin-main-content">
        <div className="settings-header">
          {isMobile ? (
            <div className="mobile-header">
              <Menu className="mobile-hamburger" onClick={toggleMobileMenu} />
              <div className="profile-info">
                <div className="avatar">👔</div>
                <div>
                  <h3>Pranshu Singh</h3>
                  <p>at Bird My Trip</p>
                </div>
              </div>
              <div className="joined-text">Join Since<br />01 Mar 2025</div>
            </div>
          ) : (
            <>
              <div className="profile-info">
                <div className="avatar">👔</div>
                <div>
                  <h3>Pranshu Singh</h3>
                  <p>at Bird My Trip</p>
                </div>
              </div>
              <div className="joined-text">Join Since 01 Mar 2025</div>
            </>
          )}
        </div>

        <div className="tab-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}