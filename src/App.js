

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import AdminSettingsLayout from './pages/AdminSettingsLayout';
import Dashboard from './pages/Dashboard';
import SocialLogin from './pages/SocialLogin';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import AdminPayments from "./pages/AdminPayments";
import ProtectedRoute from "./components/ProtectedRoute";


// Settings dropdown imports
import Setting from './pages/Setting';
import UserManagement from './pages/UserManagement';
import OfflineSupplier from './pages/OfflineSupplier';
import FlightAirportList from './pages/FlightAirportList';
import FlightAirline from './pages/FlightAirline';
import FlightFare from './pages/FlightFare';
import Convenience from './pages/Convenience';
import BankAccount from './pages/BankAccount';
import AgentNotification from './pages/AgentNotification';
import EmailTemplates from './pages/EmailTemplates';
import AgentPaymentHistory from './pages/AgentPaymentHistory';
import OnlineTransaction from './pages/OnlineTransaction';

// Flight Management
import FlightMarkup from './pages/FlightMarkup';
import FlightDiscount from './pages/FlightDiscount';
import FlightBookingList from './pages/FlightBookingList';
import FlightBookingCalender from './pages/FlightBookingCalender';
import AmendmentList from './pages/AmendmentList';
import FlightUploadTicket from './pages/FlightUploadTicket';
import FlightCouponList from './pages/FlightCouponList';
import FlightTopDestination from './pages/FlightTopDestination';
import FlightTopRoute from './pages/FlightTopRoute';
import WebCheck from './pages/WebCheck';
import AirlineReplace from './pages/AirlineReplace';
import OfflineFlight from './pages/OfflineFlight';
import ImportTickets from './pages/ImportTickets';
import FlightLogTracker from './pages/FlightLogTracker';
import FlightQueryList from './pages/FlightQueryList';
import AddInventory from './pages/AddInventory';
import PrivateFareList from './pages/PrivateFareList';
import RuleListManage from './pages/RuleListManage';
import AddFareRule from './pages/AddFareRule';
import SupplierManagement from "./pages/SupplierManagement";

// Hotel Management imports
import HotelMarkup from './pages/HotelMarkup';
import HotelDiscount from './pages/HotelDiscount';
import HolidayBookingList from './pages/HolidayBookingList';
import HotelBookingList from './pages/HotelBookingList';
import HotelAmendment from './pages/HotelAmendment';
import HotelUploads from './pages/HotelUploads';
import HotelCoupon from './pages/HotelCoupon';
import AddHotel from './pages/AddHotel';  
import HotelList from './pages/HotelList';
import HotelSettings from './pages/HotelSettings';

// Holiday Management imports
import HolidayList from './pages/HolidayList';
import AddHolidayPackage from './pages/AddHolidayPackage';
import HolidayAmendment from './pages/HolidayAmendment';
import HolidayQueryList from './pages/HolidayQueryList';
import HolidayMarkup from './pages/HolidayMarkup';
import HolidayDiscount from './pages/HolidayDiscount';
import HolidayCouponList from './pages/HolidayCouponList';
import HolidayThemeList from './pages/HolidayThemeList';

// Car Management imports
import CarInfo from './pages/CarInfo';
import CarBooking from './pages/CarBooking';
import CarAmendment from './pages/CarAmendment';
import CarEnquire from './pages/CarEnquire';
import CarMarkup from './pages/CarMarkup';
import CarDiscount from './pages/CarDiscount';
import CarCoupon from './pages/CarCoupon';
import CarSetting from './pages/CarSetting';

// Bus Management imports - NEW
import BusRouteList from './pages/BusRouteList';
import BusBookingList from './pages/BusBookingList';
import BusAmendmentList from './pages/BusAmendmentList';
import BusQueryList from './pages/BusQueryList';
import BusMarkup from './pages/BusMarkup';
import BusDiscount from './pages/BusDiscount';
import BusCouponList from './pages/BusCouponList';
import BusSettings from './pages/BusSettings';

// Train Management imports - ENHANCED
import TrainRouteList from './pages/TrainRouteList';
import TrainBookingList from './pages/TrainBookingList';
import TrainAmendmentList from './pages/TrainAmendmentList';
import TrainQueryList from './pages/TrainQueryList';
import TrainMarkup from './pages/TrainMarkup';
import TrainDiscount from './pages/TrainDiscount';
import TrainCouponList from './pages/TrainCouponList';
import TrainSettings from './pages/TrainSettings';
import PNRStatusCheck from './pages/PNRStatusCheck';
import TrainList from './pages/TrainList'; // Existing component

// Currency & Forex Management imports - NEW
import ExchangeRates from './pages/ExchangeRates';
import CurrencyList from './pages/CurrencyList';
import ForexCards from './pages/ForexCards';
import MoneyTransfer from './pages/MoneyTransfer';
import ForexBookingList from './pages/ForexBookingList';
import ForexMarkup from './pages/ForexMarkup';
import ForexSettings from './pages/ForexSettings';

// Visa Management imports - NEW
import VisaCountryList from './pages/VisaCountryList';
import DocumentRequirements from './pages/DocumentRequirements';
import VisaApplications from './pages/VisaApplications';
import VisaBookingList from './pages/VisaBookingList';
import VisaStatusTracker from './pages/VisaStatusTracker';
import VisaMarkup from './pages/VisaMarkup';
import VisaDiscount from './pages/VisaDiscount';
import VisaSettings from './pages/VisaSettings';

// Travel Insurance Management imports - NEW
import InsurancePolicies from './pages/InsurancePolicies';
import ClaimsManagement from './pages/ClaimsManagement';
import InsuranceBookings from './pages/InsuranceBookings';
import PremiumCalculator from './pages/PremiumCalculator';
import InsuranceProviders from './pages/InsuranceProviders';
import InsuranceMarkup from './pages/InsuranceMarkup';
import InsuranceSettings from './pages/InsuranceSettings';

// Other Management imports
import CouponManagement from './pages/CouponManagement';
import AgentList from './pages/AgentList';
import CustomerList from './pages/CustomerList';
import SliderList from './pages/SliderList';
import OfferManagement from './pages/OfferManagement';
import PageManagement from './pages/PageManagement';
import MenuManagement from './pages/MenuManagement';
import ContactUs from './pages/ContactUs';
import BlogCategory from './pages/BlogCategory';
import BlogList from './pages/BlogList';
import FeedbackManagement from './pages/FeedbackManagement';
import NewsLetter from './pages/NewsLetter';
import AddActivity from './pages/AddActivity';
import ActivityList from './pages/ActivityList';
import AddCruise from './pages/AddCruise';
import ManageCruise from './pages/ManageCruise';
import CruiseBooking from './pages/CruiseBooking';
import ClubMembers from './pages/ClubMembers';
import ClubBookings from './pages/ClubBookings';
import ClubPayments from './pages/ClubPayments';
import ClubEvents from './pages/ClubEvents';
import DarshanManagement from './pages/DarshanManagement';
import AdminDarshanBookings from './pages/AdminDarshanBookings';
import BusAdminPanel from "./pages/BusAdminPanel";
import ApartmentManagement from "./pages/ApartmentManagement";
import Resortmanagement from "./pages/Resortmanagement";
import Loungemanagement from "./pages/Loungemanagement";
import Guesthousemanagement from "./pages/Guesthousemanagement";
import Homestaymanagement from "./pages/Homestaymanagement";
import Placemanagement from './pages/Placemanagement';
import Houseboatmanagement from './pages/Houseboatmanagement';
import Motelmanagement from "./pages/Motelmanagement";
import Hostelmanagement from "./pages/Hostelmanagement";
import Campsitepage from './pages/Campsitepage';
import Lovehotelpanel from "./pages/Lovehotelpanel";
import Holidayparkpanel from "./pages/Holidayparkpanel";
import Farmstayadmin from "./pages/Farmstayadmin"; 
import Vacationhouseadmin from "./pages/Vacationhouseadmin";
import Campsitebooking from "./pages/Campsitebooking";
import Holidayparkapp from "./pages/Holidayparkapp";
import Motelbookingapp from "./pages/Motelbookingapp";
import Adminvactionbookings from "./pages/Adminvactionbookings";
import Adminfarmstaybookingdashboard from "./pages/Adminfarmstaybookingdashboard";
import Lovehoteladmindashboard from "./pages/Lovehoteladmindashboard";
import Adminmotelbookings from "./pages/Adminmotelbookings";
import Hostelbookingapp from "./pages/Hostelbookingapp";
import Adminplacebookings from "./pages/Adminplacebookings";
import Homestaybookingslist from './pages/Homestaybookingslist';
import Houseboatbookings from './pages/Houseboatbookings';
import Adminbookings from './pages/Adminbookings';
import Adminguesthousebookings from './pages/Adminguesthousebookings';
import Adminloungebookings from './pages/Adminloungebookings';
import Adminresortbookings from './pages/Adminresortbookings';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        {isLoggedIn ? (
          <Route path="/admin" element={<AdminSettingsLayout />}>
            <Route element={<ProtectedRoute />}></Route>
      <Route path="payments" element={<AdminPayments />} />
            <Route path="dashboard" element={<Dashboard />} />
              <Route path="vacation-bookings" element={<Adminvactionbookings />} />
            
            {/* Settings Routes */}
            <Route path="setting" element={<Setting />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="offline-supplier" element={<OfflineSupplier />} />
            <Route path="flight-airport-list" element={<FlightAirportList />} />
            <Route path="flight-airline-list" element={<FlightAirline />} />
            <Route path="flight-fare-type" element={<FlightFare />} />
            <Route path="convience-fee" element={<Convenience />} />
            <Route path="bank-account" element={<BankAccount />} />
            <Route path="agent-notification" element={<AgentNotification />} />
            <Route path="email-templates" element={<EmailTemplates />} />
            <Route path="lovehotel-bookings" element={<Lovehoteladmindashboard />} />
            <Route path="motel-bookings" element={<Adminmotelbookings />} />

            {/* Account Management Routes */}
            <Route path="AgentPaymentHistory" element={<AgentPaymentHistory />} />
            <Route path="online-transaction" element={<OnlineTransaction />} />
            <Route path="payments" element={<AdminPayments />} />

            {/* Flight Management Routes */}
            <Route path="flights/markup" element={<FlightMarkup />} />
            <Route path="flights/discount" element={<FlightDiscount />} />
            <Route path="flights/booking-list" element={<FlightBookingList />} />
            <Route path="flights/booking-calendar" element={<FlightBookingCalender />} />
            <Route path="flights/amendment-list" element={<AmendmentList />} />
            <Route path="flights/upload-ticket" element={<FlightUploadTicket />} />
            <Route path="flights/coupon-list" element={<FlightCouponList />} />
            <Route path="flights/top-destination" element={<FlightTopDestination />} />
            <Route path="flights/top-route" element={<FlightTopRoute />} />
            <Route path="flights/web-checkin" element={<WebCheck />} />
            <Route path="flights/airline-replace" element={<AirlineReplace />} />
            <Route path="flights/offline" element={<OfflineFlight />} />
            <Route path="flights/supplier-management" element={<SupplierManagement />} />
            <Route path="flights/import-tickets" element={<ImportTickets />} />
            <Route path="flights/flight-log-tracker" element={<FlightLogTracker />} />
            <Route path="flights/flight-query-list" element={<FlightQueryList />} />
            <Route path="hostel-booking" element={<Hostelbookingapp />} />
            
                
            {/* Flight Extranet Management Routes */}
            <Route path="Extranet/add-inventory" element={<AddInventory />} />
            <Route path="Extranet/private-fare-list" element={<PrivateFareList />} />
            <Route path="Extranet/rule-list-manage" element={<RuleListManage />} />
            <Route path="Extranet/add-fare-rule" element={<AddFareRule />} />

            {/* Hotel Management Routes */}
            <Route path="hotels/markup" element={<HotelMarkup />} />
            <Route path="hotels/discount" element={<HotelDiscount />} />
            <Route path="hotels/booking-list" element={<HotelBookingList />} />
            <Route path="hotels/amendment-list" element={<HotelAmendment />} />
            <Route path="hotels/uploads" element={<HotelUploads />} />
            <Route path="hotels/coupon-list" element={<HotelCoupon />} />

            {/* Hotel Extranet Management Routes */}
            <Route path="hotel-extranet/add-hotel" element={<AddHotel />} />
            <Route path="hotel-extranet/hotel-list" element={<HotelList />} />
            <Route path="hotel-extranet/hotel-settings" element={<HotelSettings />} />
            <Route path="houseboat-bookings" element={<Houseboatbookings />} />

            {/* Holiday Management Routes */}
            <Route path="holidays/holiday-list" element={<HolidayList />} />
            <Route path="holidays/add-holiday-package" element={<AddHolidayPackage />} />
            <Route path="holidays/booking-list" element={<HolidayBookingList />} />
            <Route path="holidays/amendment-list" element={<HolidayAmendment />} />
            <Route path="holidays/query-list" element={<HolidayQueryList />} />
            <Route path="holidays/markup" element={<HolidayMarkup />} />
            <Route path="holidays/discount" element={<HolidayDiscount />} />
            <Route path="holidays/coupon-list" element={<HolidayCouponList />} />
            <Route path="holidays/themes-list" element={<HolidayThemeList />} />
            <Route path="resort-bookings" element={<Adminresortbookings />} />

            {/* Car Management Routes */}
            <Route path="car/info-list" element={<CarInfo />} />
            <Route path="car/booking-list" element={<CarBooking />} />
            <Route path="car/amendment-list" element={<CarAmendment />} />
            <Route path="car/enquire-list" element={<CarEnquire />} />
            <Route path="car/markup" element={<CarMarkup />} />
            <Route path="car/discount" element={<CarDiscount />} />
            <Route path="car/coupon-list" element={<CarCoupon />} />
            <Route path="car/settings" element={<CarSetting />} />

            {/* Bus Management Routes - NEW */}
            <Route path="bus/route-list" element={<BusRouteList />} />
            <Route path="bus/booking-list" element={<BusBookingList />} />
            <Route path="bus/amendment-list" element={<BusAmendmentList />} />
            <Route path="bus/query-list" element={<BusQueryList />} />
            <Route path="bus/markup" element={<BusMarkup />} />
            <Route path="bus/discount" element={<BusDiscount />} />
            <Route path="bus/coupon-list" element={<BusCouponList />} />
            <Route path="bus/settings" element={<BusSettings />} />

            {/* Train Management Routes - ENHANCED */}
            <Route path="train/route-list" element={<TrainRouteList />} />
            <Route path="train/booking-list" element={<TrainBookingList />} />
            <Route path="train/amendment-list" element={<TrainAmendmentList />} />
            <Route path="train/query-list" element={<TrainQueryList />} />
            <Route path="train/markup" element={<TrainMarkup />} />
            <Route path="train/discount" element={<TrainDiscount />} />
            <Route path="train/coupon-list" element={<TrainCouponList />} />
            <Route path="train/settings" element={<TrainSettings />} />
            <Route path="train/pnr-status" element={<PNRStatusCheck />} />
            <Route path="train-list-management" element={<TrainList />} /> {/* Keep existing route */}
            <Route path="guesthouse-bookings" element={<Adminguesthousebookings />} />

            {/* Currency & Forex Management Routes - NEW */}
            <Route path="forex/exchange-rates" element={<ExchangeRates />} />
            <Route path="forex/currency-list" element={<CurrencyList />} />
            <Route path="forex/forex-cards" element={<ForexCards />} />
            <Route path="forex/money-transfer" element={<MoneyTransfer />} />
            <Route path="forex/booking-list" element={<ForexBookingList />} />
            <Route path="forex/markup" element={<ForexMarkup />} />
            <Route path="forex/settings" element={<ForexSettings />} />
            <Route path="place-bookings" element={<Adminplacebookings />} />

            {/* Visa Management Routes - NEW */}
            <Route path="visa/country-list" element={<VisaCountryList />} />
            <Route path="visa/document-list" element={<DocumentRequirements />} />
            <Route path="visa/application-list" element={<VisaApplications />} />
            <Route path="visa/booking-list" element={<VisaBookingList />} />
            <Route path="visa/status-tracker" element={<VisaStatusTracker />} />
            <Route path="visa/markup" element={<VisaMarkup />} />
            <Route path="visa/discount" element={<VisaDiscount />} />
            <Route path="visa/settings" element={<VisaSettings />} />

            {/* Travel Insurance Management Routes - NEW */}
            <Route path="insurance/policy-list" element={<InsurancePolicies />} />
            <Route path="insurance/claim-list" element={<ClaimsManagement />} />
            <Route path="insurance/booking-list" element={<InsuranceBookings />} />
            <Route path="insurance/premium-calculator" element={<PremiumCalculator />} />
            <Route path="insurance/providers" element={<InsuranceProviders />} />
            <Route path="insurance/markup" element={<InsuranceMarkup />} />
            <Route path="insurance/settings" element={<InsuranceSettings />} />
            <Route path="admin-bookings" element={<Adminbookings />} />

            {/* Coupon Management Routes */}
            <Route path="coupon/log" element={<CouponManagement />} />

            {/* Agent Management Routes */}
            <Route path="agent-management" element={<AgentList />} />

            {/* Customer Management Routes */}
            <Route path="customer-management" element={<CustomerList />} />

            {/* Slider Management Routes */}
            <Route path="slider-management" element={<SliderList />} />

            {/* Offer Management Routes */}
            <Route path="offer-list" element={<OfferManagement />} />

            {/* Page Management Routes */}
            <Route path="page/page-list" element={<PageManagement />} />
            <Route path="page/menu-management" element={<MenuManagement />} />
            <Route path="bus/admin-panel" element={<BusAdminPanel />} />
            {/* Apartment Management */}
<Route path="apartment-management" element={<ApartmentManagement />} />
{/* Resort Management */}
<Route path="resort-management" element={<Resortmanagement />} />
<Route path="lounge-management" element={<Loungemanagement />} />
<Route path="guesthouse-management" element={<Guesthousemanagement />} />
<Route path="homestay-management" element={<Homestaymanagement />} />
{/* Place Management */}
<Route path="place-management" element={<Placemanagement />} />
<Route path="guesthouse-management" element={<Guesthousemanagement />} />
<Route path="houseboat-management" element={<Houseboatmanagement />} />
<Route path="motel-management" element={<Motelmanagement />} />
<Route path="hostel-management" element={<Hostelmanagement />} />
<Route path="campsite-management" element={<Campsitepage />} />
<Route path="campsite-booking" element={<Campsitebooking />} />
<Route path="lovehotel-management" element={<Lovehotelpanel />} />
<Route path="holidaypark-management" element={<Holidayparkpanel />} />
<Route path="holidaypark-app" element={<Holidayparkapp />} />
<Route path="farmstay-management" element={<Farmstayadmin />} />
<Route path="farmstay-bookings" element={<Adminfarmstaybookingdashboard />} />
<Route path="vacationhouse-management" element={<Vacationhouseadmin />} />
<Route path="vacationhouse-management" element={<Vacationhouseadmin />} />
<Route path="motel-booking" element={<Motelbookingapp />} />
<Route path="homestay-bookings" element={<Homestaybookingslist />} />
<Route path="lounge-bookings" element={<Adminloungebookings />} />


{/* <Route path="darshan">
  <Route path="darshan-list" element={<DarshanManagement />} />
</Route> */}
<Route path="darshan">
  <Route path="darshan-list" element={<DarshanManagement />} />
  <Route path="darshan-bookings" element={<AdminDarshanBookings />} />
</Route>





{/* Club Management Routes */}
<Route path="club/members" element={<ClubMembers />} />
<Route path="club/bookings" element={<ClubBookings />} />
<Route path="club/payments" element={<ClubPayments />} />
<Route path="club/events" element={<ClubEvents />} />






            {/* Query Management Routes */}
            <Route path="query/contact-us" element={<ContactUs />} />
            <Route path="query/flight-management" element={<FlightQueryList />} />

            {/* Blog Management Routes */}
            <Route path="blog/category-list" element={<BlogCategory />} />
            <Route path="blog/blog-list" element={<BlogList />} />
            
              <Route path="activity/add" element={<AddActivity />} />
              <Route path="activity/list" element={<ActivityList />} />



              <Route path="cruise/add-cruise" element={<AddCruise />} />
              <Route path="cruise/manage-cruise" element={<ManageCruise />} />
              <Route path="cruise/booking" element={<CruiseBooking />} />




            {/* Newsletter and Feedback Routes */}
            <Route path="newsletter" element={<NewsLetter />} />
            <Route path="feedback-management" element={<FeedbackManagement />} />
            

            {/* Other Routes */}
            <Route path="hotels" element={<Hotels />} />

            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
