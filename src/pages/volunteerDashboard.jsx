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
  FaSignOutAlt
} from "react-icons/fa";

const VolunteerDashboard = () => {
  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) || null;

  const [joinedEvents, setJoinedEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [certificateCount, setCertificateCount] = useState(0);

  // ================= FETCH DATA =================

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        if (!user) {
          setJoinedEvents([]);
          setLoadingEvents(false);
          return;
        }

        // ================= REGISTRATIONS =================

        const registrationResponse = await axios.get(
          "http://localhost:5000/api/registrations"
        );

        const allRegistrations =
          registrationResponse.data.registrations || [];

        console.log(
          "ALL REGISTRATIONS:",
          allRegistrations
        );

        console.log(
          "LOGGED USER:",
          user
        );

        console.log(
          "LOGGED USER EMAIL:",
          user?.email
        );

        // ================= MY REGISTRATIONS =================

const myRegistrations = allRegistrations.filter(
  (registration) => {
    const registrationEmail = String(
      registration.volunteerId || ""
    ).trim().toLowerCase();

    const loggedInEmail = String(
      user.email || ""
    ).trim().toLowerCase();

    return registrationEmail === loggedInEmail;
  }
);

console.log("LOGGED IN EMAIL:", user.email);
console.log("ALL REGISTRATIONS:", allRegistrations);
console.log("MY REGISTRATIONS:", myRegistrations);

        console.log(
          "MY REGISTRATIONS:",
          myRegistrations
        );

        setJoinedEvents(myRegistrations);

        // ================= EVENT DETAILS =================

        const details = {};

        for (const registration of myRegistrations) {
          try {
            // eventId string किंवा object दोन्ही handle करा
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
              `http://localhost:5000/api/events/${eventId}`
            );

            console.log(
              "EVENT DETAILS:",
              eventResponse.data
            );

            details[eventId] =
              eventResponse.data;

          } catch (error) {
            console.log(
              "EVENT DETAILS ERROR:",
              error.response?.data ||
                error.message
            );
          }
        }

        setEventDetails(details);

        // ================= CERTIFICATES =================

        const certificateResponse = await axios.get(
          "http://localhost:5000/api/certificates"
        );

        const allCertificates =
          certificateResponse.data.certificates || [];

        const myCertificates =
          allCertificates.filter(
            (certificate) =>
              String(certificate.volunteerId || "")
                .trim()
                .toLowerCase() ===
              String(user?.email || "")
                .trim()
                .toLowerCase()
          );

        console.log(
          "MY CERTIFICATES:",
          myCertificates
        );

        setCertificateCount(
          myCertificates.length
        );

        setLoadingEvents(false);

      } catch (error) {
        console.log(
          "DASHBOARD ERROR:",
          error.response?.data ||
            error.message
        );

        setLoadingEvents(false);
      }
    };

    fetchRegistrations();

  }, [user?.email]);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ================= UI =================

  return (
    <div className="dashboard-container">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <h3>
          🤝 Volunteer
        </h3>

        <ul>

          <li>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </li>

          <li
            onClick={() =>
              navigate("/registrations")
            }
          >
            <FaClipboardList />
            <span>My Registrations</span>
          </li>

          <li
            onClick={() =>
              navigate("/history")
            }
          >
            <FaHistory />
            <span>Volunteer History</span>
          </li>

          <li
            onClick={() =>
              navigate("/certificates")
            }
          >
            <FaCertificate />
            <span>Certificates</span>
          </li>

          <li
            onClick={() =>
              navigate("/profile")
            }
          >
            <FaUser />
            <span>Profile</span>
          </li>

          <li onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </li>

        </ul>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-content">

        <h2>
          Welcome, {user?.name || "Volunteer"} 👋
        </h2>

        <p>
          Thank you for being a changemaker.
        </p>

        {/* ================= STATS ================= */}

        <div className="stats">

          {/* JOINED EVENTS */}

          <div className="stat-card">
            <h4>Joined Events</h4>

            <h2>
              {joinedEvents.length}
            </h2>
          </div>

          {/* CERTIFICATES */}

          <div className="stat-card">
            <h4>Certificates</h4>

            <h2>
              {certificateCount}
            </h2>
          </div>

          {/* BADGES */}

          <div className="stat-card">
            <h4>Badges</h4>

            <h2>
              5
            </h2>
          </div>

        </div>

        {/* ================= BOTTOM ================= */}

        <div className="dashboard-bottom">

          {/* ================= JOINED EVENTS ================= */}

          <div className="events-box">

            <h3>
              Joined Events
            </h3>

            {loadingEvents ? (

              <div className="empty-box">

                <h4>
                  Loading events...
                </h4>

              </div>

            ) : joinedEvents.length === 0 ? (

              <div className="empty-box">

                <h4>
                  No events joined yet
                </h4>

                <p>
                  Join an event to see it here.
                </p>

              </div>

            ) : (

              joinedEvents.map((registration) => {

                // eventId string/object दोन्ही handle
                const eventId =
                  typeof registration.eventId === "object"
                    ? registration.eventId?._id
                    : registration.eventId;

                const event =
                  eventDetails[eventId];

                return (

                  <div
                    className="dashboard-event-card"
                    key={registration._id}
                  >

                    {/* EVENT IMAGE */}

                    {event?.image && (

                      <img
                        className="volunteer-event-img"
                        src={event.image}
                        alt={
                          registration.eventTitle ||
                          "Event"
                        }
                      />

                    )}

                    {/* EVENT INFORMATION */}

                    <div className="event-info">

                      <h4>
                        {registration.eventTitle ||
                          event?.title ||
                          "Event"}
                      </h4>

                      <p>
                        {event?.date ||
                          "Registered Event"}
                      </p>

                      {event?.location && (

                        <p>
                          📍 {event.location}
                        </p>

                      )}

                    </div>

                    {/* EVENT STATUS */}

                    <div className="event-status-container">

                      <span
                        className={`event-status ${
                          registration.status ===
                          "Completed"
                            ? "completed"
                            : "joined"
                        }`}
                      >
                        {registration.status ===
                        "Completed"
                          ? "Completed"
                          : "Joined"}
                      </span>

                    </div>

                  </div>

                );

              })

            )}

          </div>

          {/* ================= BADGES ================= */}

          <div className="badges-box">

            <h3>
              Recent Badges
            </h3>

            <div className="badge">
              🟢 Eco Warrior
            </div>

            <div className="badge">
              🟠 Helper Star
            </div>

            <div className="badge">
              🔵 Community Star
            </div>

            <div className="badge">
              🟣 Event Enthusiast
            </div>

            <div className="badge">
              🔴 Social Impact Maker
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default VolunteerDashboard;