import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NGODashboard.css";
import { Link, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaPlusCircle,
  FaTasks,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const API = "http://localhost:5000/api";

const NGODashboard = () => {
  const navigate = useNavigate();

  // ================= MOBILE MENU =================
  const [menuOpen, setMenuOpen] = useState(false);

  // ================= DASHBOARD STATES =================
  const [totalEvents, setTotalEvents] = useState(0);
  const [activeEvents, setActiveEvents] = useState(0);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [completedVolunteers, setCompletedVolunteers] = useState(0);

  const [allEvents, setAllEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // GET EVENT ID FROM REGISTRATION
  // =====================================================

  const getEventId = (registration) => {
    if (!registration) return "";

    if (registration.eventId?._id) {
      return String(registration.eventId._id);
    }

    if (registration.eventId) {
      return String(registration.eventId);
    }

    if (registration.event?._id) {
      return String(registration.event._id);
    }

    if (registration.event) {
      return String(registration.event);
    }

    return "";
  };

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // =================================================
        // GET EVENTS
        // =================================================

        const eventResponse = await axios.get(`${API}/events`);

        const events = Array.isArray(eventResponse.data)
          ? eventResponse.data
          : [];

        setAllEvents(events);
        setTotalEvents(events.length);

        console.log("EVENTS:", events);

        // =================================================
        // GET REGISTRATIONS
        // =================================================

        let registrationsData = [];

        try {
          const registrationResponse = await axios.get(
            `${API}/registrations`
          );

          if (
            Array.isArray(
              registrationResponse.data?.registrations
            )
          ) {
            registrationsData =
              registrationResponse.data.registrations;
          } else if (Array.isArray(registrationResponse.data)) {
            registrationsData = registrationResponse.data;
          }
        } catch (registrationError) {
          console.log(
            "REGISTRATION API ERROR:",
            registrationError.response?.data ||
              registrationError.message
          );

          registrationsData = [];
        }

        setRegistrations(registrationsData);

        console.log(
          "ALL REGISTRATIONS:",
          registrationsData
        );

        // =================================================
        // VALID REGISTRATIONS
        // =================================================

        const existingEventIds = new Set(
          events.map((event) => String(event._id))
        );

        const validRegistrations =
          registrationsData.filter((registration) => {
            const eventId = getEventId(registration);

            return existingEventIds.has(eventId);
          });

        console.log(
          "VALID REGISTRATIONS:",
          validRegistrations
        );

        // =================================================
        // TOTAL VOLUNTEERS
        // =================================================

        const joinedOrCompleted =
          validRegistrations.filter((registration) => {
            const status = String(
              registration.status || ""
            ).toLowerCase();

            return (
              status === "joined" ||
              status === "completed"
            );
          });

        setTotalVolunteers(
          joinedOrCompleted.length
        );

        console.log(
          "TOTAL VOLUNTEERS:",
          joinedOrCompleted.length
        );

        // =================================================
        // COMPLETED VOLUNTEERS
        // =================================================

        const completedVolunteerCount =
          validRegistrations.filter((registration) => {
            const status = String(
              registration.status || ""
            ).toLowerCase();

            return status === "completed";
          }).length;

        setCompletedVolunteers(
          completedVolunteerCount
        );

        console.log(
          "COMPLETED VOLUNTEERS:",
          completedVolunteerCount
        );

        // =================================================
        // ACTIVE / COMPLETED EVENTS
        // =================================================

        let completedEventCount = 0;

        events.forEach((event) => {
          const eventId = String(event._id);

          const eventRegistrations =
            validRegistrations.filter((registration) => {
              return (
                getEventId(registration) === eventId
              );
            });

          const completedCount =
            eventRegistrations.filter((registration) => {
              return (
                String(
                  registration.status || ""
                ).toLowerCase() === "completed"
              );
            }).length;

          const totalRegistered =
            eventRegistrations.length;

          /*
            Event completed when all registered volunteers
            are completed.

            If backend already has status = Completed,
            that is also considered completed.
          */

          const backendCompleted =
            String(event.status || "").toLowerCase() ===
            "completed";

          const allVolunteersCompleted =
            totalRegistered > 0 &&
            completedCount === totalRegistered;

          if (
            backendCompleted ||
            allVolunteersCompleted
          ) {
            completedEventCount++;
          }
        });

        const activeEventCount =
          events.length - completedEventCount;

        setActiveEvents(
          activeEventCount > 0
            ? activeEventCount
            : 0
        );

        console.log(
          "COMPLETED EVENTS:",
          completedEventCount
        );

        console.log(
          "ACTIVE EVENTS:",
          activeEventCount
        );
      } catch (error) {
        console.log(
          "NGO DASHBOARD ERROR:",
          error.response?.data ||
            error.message
        );
      }
    };

    fetchDashboardData();
  }, []);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="dashboard-container">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside
        className={`sidebar ${
          menuOpen ? "menu-open" : ""
        }`}
      >

        {/* ================= HEADER ================= */}

        <div className="sidebar-header">

          <h3>
            🌿 NGO
          </h3>

          {/* MOBILE BUTTON ONLY */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>

        {/* ================= NAVIGATION ================= */}

        <ul className="sidebar-menu">

          {/* DASHBOARD */}

          <li
            className="active-menu"
            onClick={closeMenu}
          >
            <FaTachometerAlt />

            <span>
              Dashboard
            </span>
          </li>

          {/* ADD EVENT */}

          <li onClick={closeMenu}>
            <Link to="/add-event">

              <FaPlusCircle />

              <span>
                Add Event
              </span>

            </Link>
          </li>

          {/* MANAGE EVENTS */}

          <li onClick={closeMenu}>
            <Link to="/manage-events">

              <FaTasks />

              <span>
                Manage Events
              </span>

            </Link>
          </li>

          {/* VIEW VOLUNTEERS */}

          <li onClick={closeMenu}>
            <Link to="/view-volunteers">

              <FaUsers />

              <span>
                View Volunteers
              </span>

            </Link>
          </li>

          {/* PROFILE */}

          <li onClick={closeMenu}>
            <Link to="/ngo-profile">

              <FaUser />

              <span>
                Profile
              </span>

            </Link>
          </li>

          {/* LOGOUT */}

          <li onClick={handleLogout}>

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </li>

        </ul>

      </aside>

      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="dashboard-content">

        {/* ================= WELCOME ================= */}

        <div className="welcome-section">

          <h1>
            Welcome, Green Earth NGO 🌱
          </h1>

          <p>
            Manage your events and volunteers
            efficiently.
          </p>

        </div>

        {/* =================================================
            STATISTICS
            ================================================= */}

        <div className="stats">

          {/* TOTAL EVENTS */}

          <div className="stat-card">

            <h4>
              Total Events
            </h4>

            <h2>
              {totalEvents}
            </h2>

          </div>

          {/* ACTIVE EVENTS */}

          <div className="stat-card">

            <h4>
              Active Events
            </h4>

            <h2>
              {activeEvents}
            </h2>

          </div>

          {/* VOLUNTEERS */}

          <div className="stat-card">

            <h4>
              Volunteers
            </h4>

            <h2>
              {totalVolunteers}
            </h2>

          </div>

          {/* COMPLETED */}

          <div className="stat-card">

            <h4>
              Completed
            </h4>

            <h2>
              {completedVolunteers}
            </h2>

          </div>

        </div>

        {/* =================================================
            BOTTOM SECTION
            ================================================= */}

        <div className="dashboard-bottom">

          {/* =================================================
              RECENT EVENTS
              ================================================= */}

          <section className="events-box">

            <h3>
              Recent Events
            </h3>

            {allEvents.length === 0 ? (

              <div className="empty-events">
                No events added yet.
              </div>

            ) : (

              allEvents
                .slice()
                .reverse()
                .slice(0, 5)
                .map((event, index) => {

                  const eventId =
                    String(event._id);

                  const eventRegistrations =
                    registrations.filter(
                      (registration) =>
                        getEventId(
                          registration
                        ) === eventId
                    );

                  const eventVolunteerCount =
                    Number(event.volunteers) || 0;

                  const eventCompletedCount =
                    eventRegistrations.filter(
                      (registration) =>
                        String(
                          registration.status || ""
                        ).toLowerCase() ===
                        "completed"
                    ).length;

                  const eventJoinedCount =
                    eventRegistrations.filter(
                      (registration) =>
                        String(
                          registration.status || ""
                        ).toLowerCase() ===
                        "joined"
                    ).length;

                  const backendCompleted =
                    String(
                      event.status || ""
                    ).toLowerCase() ===
                    "completed";

                  const isCompleted =
                    backendCompleted ||
                    (
                      eventVolunteerCount > 0 &&
                      eventCompletedCount >=
                        eventVolunteerCount
                    );

                  let statusText =
                    "Active";

                  if (isCompleted) {
                    statusText = "Completed";
                  }

                  return (
                    <div
                      className="dashboard-event-card"
                      key={
                        event._id || index
                      }
                    >

                      {/* IMAGE */}

                      <img
                        src={
                          event.image ||
                          "/default-event.jpg"
                        }
                        alt={
                          event.title ||
                          "Event"
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            "/default-event.jpg";
                        }}
                      />

                      {/* INFO */}

                      <div className="event-info">

                        <h4>
                          {event.title ||
                            "Untitled Event"}
                        </h4>

                        <p>
                          📅{" "}
                          {event.date ||
                            "Date not available"}
                        </p>

                        <p>
                          📍{" "}
                          {event.location ||
                            "Location not available"}
                        </p>

                        <p>
                          👥{" "}
                          {eventVolunteerCount}{" "}
                          Volunteer
                          {eventVolunteerCount !== 1
                            ? "s"
                            : ""}
                        </p>

                        {eventJoinedCount >
                          0 && (
                          <p className="joined-text">
                            🟢{" "}
                            {eventJoinedCount}{" "}
                            Joined
                          </p>
                        )}

                        {eventCompletedCount >
                          0 && (
                          <p className="completed-text">
                            ✅{" "}
                            {eventCompletedCount}{" "}
                            Completed
                          </p>
                        )}

                      </div>

                      {/* STATUS */}

                      <span
                        className={
                          isCompleted
                            ? "event-status completed"
                            : "event-status active"
                        }
                      >
                        {statusText}
                      </span>

                    </div>
                  );
                })

            )}

          </section>

          {/* =================================================
              QUICK ACTIONS
              ================================================= */}

          <section className="badges-box">

            <h3>
              Quick Actions
            </h3>

            <button
              className="badge"
              onClick={() =>
                navigate("/add-event")
              }
            >
              ➕ Create New Event
            </button>

            <button
              className="badge"
              onClick={() =>
                navigate("/view-volunteers")
              }
            >
              👥 View Volunteers
            </button>

            <button
              className="badge"
              onClick={() =>
                navigate("/manage-events")
              }
            >
              📋 Manage Events
            </button>

          </section>

        </div>

      </main>

    </div>
  );
};

export default NGODashboard;