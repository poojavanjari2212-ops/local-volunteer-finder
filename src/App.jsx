import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import VolunteerDashboard from "./pages/volunteerDashboard.jsx";
import NGODashboard from "./pages/NGODashboard";
import Certificates from "./pages/Certificates";
import MyRegistrations from "./pages/MyRegistrations";
import VolunteerHistory from "./pages/VolunteerHistory";
import Profile from "./pages/Profile";
import AddEvent from "./pages/AddEvent";
import ManageEvents from "./pages/ManageEvents";
import ViewVolunteers from "./pages/ViewVolunteers";
import NGOProfile from "./pages/NGOProfile";

function Layout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/volunteer-dashboard" &&
        location.pathname !== "/ngo-dashboard" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/volunteer-dashboard"
          element={<volunteerDashboard />}
        />

        <Route
          path="/ngo-dashboard"
          element={<NGODashboard />}
        />

        <Route
          path="/certificates"
          element={<Certificates />}
        />

        <Route
          path="/registrations"
          element={<MyRegistrations />}
        />

        <Route
          path="/history"
          element={<VolunteerHistory />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/add-event"
          element={<AddEvent />}
        />

        <Route
          path="/manage-events"
          element={<ManageEvents />}
        />

        <Route
          path="/view-volunteers"
          element={<ViewVolunteers />}
        />

        <Route
          path="/ngo-profile"
          element={<NGOProfile />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;