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
} from "react-icons/fa";

const API = "http://localhost:5000/api";

const NGODashboard = () => {
  const navigate = useNavigate();

  // ================= STATES =================

  const [totalEvents, setTotalEvents] = useState(0);
  const [activeEvents, setActiveEvents] = useState(0);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [completedVolunteers, setCompletedVolunteers] = useState(0);

  const [allEvents, setAllEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ================= GET EVENT ID =================

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

  // ================= FETCH DASHBOARD DATA =================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // =====================================================
        // 1. GET EVENTS
        // =====================================================

        const eventResponse = await axios.get(`${API}/events`);

        const events = Array.isArray(eventResponse.data)
          ? eventResponse.data
          : [];

        setAllEvents(events);
        setTotalEvents(events.length);

        console.log("EVENTS:", events);

        // =====================================================
        // 2. GET REGISTRATIONS
        // =====================================================

        const registrationResponse = await axios.get(
          `${API}/registrations`
        );

        const registrationsData = Array.isArray(
          registrationResponse.data?.registrations
        )
          ? registrationResponse.data.registrations
          : [];

        setRegistrations(registrationsData);

        console.log(
          "ALL REGISTRATIONS:",
          registrationsData
        );

        // =====================================================
        // 3. ONLY REGISTRATIONS BELONGING TO EXISTING EVENTS
        // =====================================================

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

        // =====================================================
        // 4. TOTAL VOLUNTEERS
        // =====================================================

        // Joined किंवा Completed असलेली प्रत्येक registration
        // = 1 volunteer
        //
        // Completed झाल्यावर तो Joined मध्ये पुन्हा count
        // होत नाही कारण status आता Completed आहे.

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

        const totalVolunteerCount =
          joinedOrCompleted.length;

        setTotalVolunteers(totalVolunteerCount);

        console.log(
          "TOTAL VOLUNTEERS:",
          totalVolunteerCount
        );

        // =====================================================
        // 5. TOTAL COMPLETED VOLUNTEERS
        // =====================================================

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

        // =====================================================
        // 6. FIND COMPLETED EVENTS
        // =====================================================

        let completedEventCount = 0;

        events.forEach((event) => {
          const eventId = String(event._id);

          // This event's registrations
          const eventRegistrations =
            validRegistrations.filter((registration) => {
              return getEventId(registration) === eventId;
            });

          // जर registration नाही तर event Completed नाही
          if (eventRegistrations.length === 0) {
            return;
          }

          const completedCount =
            eventRegistrations.filter((registration) => {
              return (
                String(
                  registration.status || ""
                ).toLowerCase() === "completed"
              );
            }).length;

          const totalCount =
            eventRegistrations.length;

          console.log(
            "EVENT CHECK:",
            event.title,
            {
              totalVolunteers: totalCount,
              completedVolunteers: completedCount,
            }
          );

          // ALL registered volunteers completed
          if (
            totalCount > 0 &&
            completedCount === totalCount
          ) {
            completedEventCount++;
          }
        });

        console.log(
          "COMPLETED EVENTS:",
          completedEventCount
        );

        // =====================================================
        // 7. ACTIVE EVENTS
        // =====================================================

        const activeEventCount =
          events.length - completedEventCount;

        setActiveEvents(
          activeEventCount < 0
            ? 0
            : activeEventCount
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

  // ================= UI =================

  return (
    <div className="dashboard-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <h3>🌿 NGO</h3>

        <ul>

          <li>
            <FaTachometerAlt />
            Dashboard
          </li>

          <li>
            <Link to="/add-event">
              <FaPlusCircle />
              Add Event
            </Link>
          </li>

          <li>
            <Link to="/manage-events">
              <FaTasks />
              Manage Events
            </Link>
          </li>

          <li>
            <Link to="/view-volunteers">
              <FaUsers />
              View Volunteers
            </Link>
          </li>

          <li>
            <Link to="/ngo-profile">
              <FaUser />
              Profile
            </Link>
          </li>

          <li onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </li>

        </ul>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="dashboard-content">

        <h1>
          Welcome, Green Earth NGO 🌱
        </h1>

        <p>
          Manage your events and volunteers
          efficiently.
        </p>

        {/* ================= STATS ================= */}

        <div className="stats">

          {/* TOTAL EVENTS */}

          <div className="stat-card">
            <h4>Total Events</h4>
            <h2>{totalEvents}</h2>
          </div>

          {/* ACTIVE EVENTS */}

          <div className="stat-card">
            <h4>Active Events</h4>
            <h2>{activeEvents}</h2>
          </div>

          {/* TOTAL VOLUNTEERS */}

          <div className="stat-card">
            <h4>Volunteers</h4>
            <h2>{totalVolunteers}</h2>
          </div>

          {/* COMPLETED VOLUNTEERS */}

          <div className="stat-card">
            <h4>Completed</h4>
            <h2>{completedVolunteers}</h2>
          </div>

        </div>

        {/* ================= BOTTOM ================= */}

        <div className="dashboard-bottom">

          {/* ================= RECENT EVENTS ================= */}

          <div className="events-box">

            <h3>Recent Events</h3>

            {allEvents.length === 0 ? (

              <p>No events added yet.</p>

            ) : (

              allEvents.map((event, index) => {

                const eventId =
                  String(event._id);

                // =================================================
                // GET THIS EVENT'S REGISTRATIONS
                // =================================================

                const eventRegistrations =
                  registrations.filter(
                    (registration) => {

                      return (
                        getEventId(
                          registration
                        ) === eventId
                      );
                    }
                  );

                // =================================================
                // TOTAL VOLUNTEERS FOR THIS EVENT
                // =================================================

const eventVolunteerCount =
  Number(event.volunteers) || 0;

                // =================================================
                // COMPLETED VOLUNTEERS
                // =================================================

                const eventCompletedCount =
                  eventRegistrations.filter(
                    (registration) => {

                      return (
                        String(
                          registration.status ||
                            ""
                        ).toLowerCase() ===
                        "completed"
                      );
                    }
                  ).length;

                // =================================================
                // JOINED VOLUNTEERS
                // =================================================

                const eventJoinedCount =
                  eventRegistrations.filter(
                    (registration) => {

                      return (
                        String(
                          registration.status ||
                            ""
                        ).toLowerCase() ===
                        "joined"
                      );
                    }
                  ).length;

                // =================================================
                // EVENT COMPLETED?
                // =================================================

                const isCompleted =
                  eventVolunteerCount > 0 &&
                  eventCompletedCount ===
                    eventVolunteerCount;

                // =================================================
                // STATUS TEXT
                // =================================================

                let statusText = "No Volunteers";

                if (eventVolunteerCount > 0) {
                  if (isCompleted) {
                    statusText = "Completed";
                  } else {
                    statusText = "Joined";
                  }
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
                        event.image
                          ? event.image
                          : "/default-event.jpg"
                      }
                      alt={event.title}
                    />

                    {/* EVENT INFO */}

                    <div>

                      <h4>
                        {event.title}
                      </h4>

                      <p>
                        {event.date}
                      </p>

                      {/* TOTAL VOLUNTEERS */}

                      <p>
                        👥{" "}
                        {eventVolunteerCount}{" "}
                        Volunteer
                        {eventVolunteerCount !== 1
                          ? "s"
                          : ""}
                      </p>

                      {/* JOINED */}

                      {!isCompleted &&
                        eventJoinedCount > 0 && (
                          <p>
                            🟢{" "}
                            {eventJoinedCount}{" "}
                            Joined
                          </p>
                        )}

                      {/* COMPLETED */}

                      {eventCompletedCount > 0 && (
                        <p>
                          ✅{" "}
                          {eventCompletedCount}{" "}
                          Completed
                        </p>
                      )}

                    </div>

                    {/* STATUS */}

                    <span>
                      {statusText}
                    </span>

                  </div>

                );
              })

            )}

          </div>

          {/* ================= QUICK ACTIONS ================= */}

          <div className="badges-box">

            <h3>
              Quick Actions
            </h3>

            <div className="badge">
              ➕ Create New Event
            </div>

            <div className="badge">
              👥 View Volunteers
            </div>

            <div className="badge">
              📊 Generate Report
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default NGODashboard;