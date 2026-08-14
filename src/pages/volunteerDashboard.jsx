import React, { useState, useEffect } from "react";
import axios from "axios";
import "./volunteerDashboard.css";
import { useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaClipboardList,
  FaHistory,
  FaCertificate,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const API = "https://local-volunteer-finder.onrender.com/api";

const VolunteerDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || null;

  // ================= MOBILE MENU =================

  const [menuOpen, setMenuOpen] = useState(false);

  // ================= STATES =================

  const [joinedEvents, setJoinedEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [certificateCount, setCertificateCount] = useState(0);

  // ================= FETCH DATA =================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) {
          setJoinedEvents([]);
          setLoadingEvents(false);
          return;
        }

        // ================= REGISTRATIONS =================

        const registrationResponse = await axios.get(
          `${API}/registrations`
        );

        const allRegistrations =
          registrationResponse.data?.registrations || [];

        console.log("ALL REGISTRATIONS:", allRegistrations);
        console.log("LOGGED USER:", user);
        console.log("LOGGED USER EMAIL:", user?.email);

        // ================= MY REGISTRATIONS =================

        const loggedInEmail = String(user.email || "")
          .trim()
          .toLowerCase();

        const myRegistrations = allRegistrations.filter(
          (registration) => {
            const registrationEmail = String(
              registration.volunteerId || ""
            )
              .trim()
              .toLowerCase();

            return registrationEmail === loggedInEmail;
          }
        );

        console.log("MY REGISTRATIONS:", myRegistrations);

        setJoinedEvents(myRegistrations);

        // ================= EVENT DETAILS =================

        const details = {};

        for (const registration of myRegistrations) {
          try {
            const eventId =
              typeof registration.eventId === "object"
                ? registration.eventId?._id
                : registration.eventId;

            if (!eventId) {
              console.log(
                "EVENT ID MISSING:",
                registration
              );
              continue;
            }

            const eventResponse = await axios.get(
              `${API}/events/${eventId}`
            );

            details[eventId] = eventResponse.data;

          } catch (error) {
            console.log(
              "EVENT DETAILS ERROR:",
              error.response?.data || error.message
            );
          }
        }

        setEventDetails(details);

        // ================= CERTIFICATES =================

        try {
          const certificateResponse = await axios.get(
            `${API}/certificates`
          );

          const allCertificates =
            certificateResponse.data?.certificates || [];

          const myCertificates = allCertificates.filter(
            (certificate) =>
              String(certificate.volunteerId || "")
                .trim()
                .toLowerCase() === loggedInEmail
          );

          console.log(
            "MY CERTIFICATES:",
            myCertificates
          );

          setCertificateCount(myCertificates.length);

        } catch (certificateError) {
          console.log(
            "CERTIFICATE ERROR:",
            certificateError.response?.data ||
              certificateError.message
          );

          setCertificateCount(0);
        }

        setLoadingEvents(false);

      } catch (error) {
        console.log(
          "DASHBOARD ERROR:",
          error.response?.data || error.message
        );

        setLoadingEvents(false);
      }
    };

    fetchDashboardData();
  }, [user?.email]);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  // ================= CLOSE MOBILE MENU =================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ================= NAVIGATION =================

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // ================= UI =================

  return (
    <div className="volunteer-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`volunteer-sidebar ${
          menuOpen ? "mobile-open" : ""
        }`}
      >

        {/* ================= SIDEBAR HEADER ================= */}

        <div className="volunteer-sidebar-header">

          <h3>
            🤝 Volunteer
          </h3>

          {/* MOBILE HAMBURGER */}

          <button
            type="button"
            className="volunteer-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <ul className="volunteer-sidebar-menu">

          {/* DASHBOARD */}

          <li
            className="active"
            onClick={() =>
              goTo("/volunteer-dashboard")
            }
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </li>

          {/* MY REGISTRATIONS */}

          <li
            onClick={() =>
              goTo("/registrations")
            }
          >
            <FaClipboardList />
            <span>My Registrations</span>
          </li>

          {/* HISTORY */}

          <li
            onClick={() =>
              goTo("/history")
            }
          >
            <FaHistory />
            <span>Volunteer History</span>
          </li>

          {/* CERTIFICATES */}

          <li
            onClick={() =>
              goTo("/certificates")
            }
          >
            <FaCertificate />
            <span>Certificates</span>
          </li>

          {/* PROFILE */}

          <li
            onClick={() =>
              goTo("/profile")
            }
          >
            <FaUser />
            <span>Profile</span>
          </li>

          {/* LOGOUT */}

          <li onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </li>

        </ul>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="volunteer-dashboard-content">

        {/* ================= WELCOME ================= */}

        <section className="volunteer-welcome">

          <h1>
            Welcome, {user?.name || "Volunteer"} 👋
          </h1>

          <p>
            Thank you for being a changemaker.
          </p>

        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="volunteer-stats">

          {/* JOINED EVENTS */}

          <div className="volunteer-stat-card">

            <div className="stat-icon joined-icon">
              📅
            </div>

            <div>
              <h4>Joined Events</h4>

              <h2>
                {joinedEvents.length}
              </h2>
            </div>

          </div>

          {/* CERTIFICATES */}

          <div className="volunteer-stat-card">

            <div className="stat-icon certificate-icon">
              🏆
            </div>

            <div>
              <h4>Certificates</h4>

              <h2>
                {certificateCount}
              </h2>
            </div>

          </div>

          {/* BADGES */}

          <div className="volunteer-stat-card">

            <div className="stat-icon badge-icon">
              ⭐
            </div>

            <div>
              <h4>Badges</h4>

              <h2>
                5
              </h2>
            </div>

          </div>

        </section>

        {/* =====================================================
            BOTTOM SECTION
        ===================================================== */}

        <section className="volunteer-dashboard-bottom">

          {/* =================================================
              JOINED EVENTS
          ================================================= */}

          <div className="volunteer-events-box">

            <div className="section-heading">

              <div>
                <h3>Joined Events</h3>

                <p>
                  Your recent volunteer activities
                </p>
              </div>

            </div>

            {loadingEvents ? (

              <div className="volunteer-empty-box">

                <div className="empty-icon">
                  ⏳
                </div>

                <h4>
                  Loading events...
                </h4>

              </div>

            ) : joinedEvents.length === 0 ? (

              <div className="volunteer-empty-box">

                <div className="empty-icon">
                  🌱
                </div>

                <h4>
                  No events joined yet
                </h4>

                <p>
                  Join an event to see it here.
                </p>

              </div>

            ) : (

              <div className="volunteer-event-list">

                {joinedEvents.map((registration) => {

                  const eventId =
                    typeof registration.eventId === "object"
                      ? registration.eventId?._id
                      : registration.eventId;

                  const event =
                    eventDetails[eventId];

                  const status =
                    String(
                      registration.status || "Joined"
                    ).toLowerCase();

                  const isCompleted =
                    status === "completed";

                  return (

                    <div
                      className="volunteer-event-card"
                      key={registration._id}
                    >

                      {/* IMAGE */}

                      <div className="volunteer-event-image-wrapper">

                        {event?.image ? (

                          <img
                            src={event.image}
                            alt={
                              registration.eventTitle ||
                              event?.title ||
                              "Event"
                            }
                            className="volunteer-event-img"
                          />

                        ) : (

                          <div className="event-image-placeholder">
                            🌱
                          </div>

                        )}

                      </div>

                      {/* INFORMATION */}

                      <div className="volunteer-event-info">

                        <h4>
                          {registration.eventTitle ||
                            event?.title ||
                            "Volunteer Event"}
                        </h4>

                        <p>
                          📅{" "}
                          {event?.date ||
                            "Date not available"}
                        </p>

                        {event?.location && (

                          <p>
                            📍 {event.location}
                          </p>

                        )}

                      </div>

                      {/* STATUS */}

                      <div className="volunteer-event-status">

                        <span
                          className={
                            isCompleted
                              ? "completed"
                              : "joined"
                          }
                        >
                          {isCompleted
                            ? "Completed"
                            : "Joined"}
                        </span>

                      </div>

                    </div>

                  );

                })}

              </div>

            )}

          </div>

          {/* =================================================
              BADGES
          ================================================= */}

          <div className="volunteer-badges-box">

            <div className="section-heading">

              <div>
                <h3>Recent Badges</h3>

                <p>
                  Your achievements
                </p>
              </div>

            </div>

            <div className="volunteer-badges-list">

              <div className="volunteer-badge">
                <span>🟢</span>
                <div>
                  <strong>Eco Warrior</strong>
                  <small>Environment</small>
                </div>
              </div>

              <div className="volunteer-badge">
                <span>🟠</span>
                <div>
                  <strong>Helper Star</strong>
                  <small>Community</small>
                </div>
              </div>

              <div className="volunteer-badge">
                <span>🔵</span>
                <div>
                  <strong>Community Star</strong>
                  <small>Social Work</small>
                </div>
              </div>

              <div className="volunteer-badge">
                <span>🟣</span>
                <div>
                  <strong>Event Enthusiast</strong>
                  <small>Participation</small>
                </div>
              </div>

              <div className="volunteer-badge">
                <span>🔴</span>
                <div>
                  <strong>Social Impact Maker</strong>
                  <small>Volunteering</small>
                </div>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default VolunteerDashboard;