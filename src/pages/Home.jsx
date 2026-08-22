import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";

import heroImage from "../assets/hero.jpg";

import event1 from "../assets/event1.jpg";
import event2 from "../assets/event2.jpg";
import event3 from "../assets/event3.jpg";

import {
  FaCalendarAlt,
  FaBuilding,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Home = () => {
  // ================= STATES =================

  const [stats, setStats] = useState({
    events: 0,
    ngos: 0,
    volunteers: 0,
    cities: 0,
  });

  const [events, setEvents] = useState([]);

  // ================= GET HOME DATA =================

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // ================= EVENTS =================

        const eventResponse = await axios.get(
          "https://local-volunteer-finder.onrender.com/api/events"
        );

        const eventData = Array.isArray(eventResponse.data)
          ? eventResponse.data
          : [];

        console.log("HOME EVENTS:", eventData);

        // ================= REGISTRATIONS =================

        let registrationData = [];

        try {
          const registrationResponse = await axios.get(
            "https://local-volunteer-finder.onrender.com/api/registrations"
          );

          registrationData =
            registrationResponse.data?.registrations ||
            registrationResponse.data ||
            [];

          if (!Array.isArray(registrationData)) {
            registrationData = [];
          }

console.log(
  "FIRST REGISTRATION:",
  registrationData[0]
);

console.log(
  "REGISTRATION KEYS:",
  Object.keys(registrationData[0] || {})
);

console.log(
  "FULL REGISTRATION DATA:",
  JSON.stringify(registrationData[0], null, 2)
);

        } catch (registrationError) {
          console.log(
            "REGISTRATION ERROR:",
            registrationError.response?.data ||
              registrationError.message
          );
        }

        // ================= NGO COUNT =================

        const organizers = eventData
          .map((event) => {
            const creator = event.createdBy;

            if (!creator) return null;

            if (typeof creator === "object") {
              return (
                creator._id ||
                creator.email ||
                creator.name ||
                creator.username ||
                null
              );
            }

            return String(creator).trim();
          })
          .filter(Boolean);

        const uniqueNGOs = new Set(
          organizers.map((ngo) =>
            String(ngo).toLowerCase()
          )
        );

        // ================= CURRENT EVENT VOLUNTEERS =================

        const currentEventIds = new Set(
          eventData.map((event) =>
            String(event._id)
          )
        );

        const joinedRegistrations =
          registrationData.filter((registration) => {
            const status = String(
              registration.status || "Joined"
            )
              .trim()
              .toLowerCase();

            let registrationEventId =
              registration.eventId ||
              registration.event ||
              registration.event_id;

            // If event is an object
            if (
              typeof registrationEventId === "object" &&
              registrationEventId !== null
            ) {
              registrationEventId =
                registrationEventId._id;
            }

            return (
              currentEventIds.has(
                String(registrationEventId)
              ) &&
              (status === "joined" ||
                status === "completed")
            );
          });

        console.log(
          "CURRENT EVENT REGISTRATIONS:",
          joinedRegistrations
        );

        // ================= UNIQUE VOLUNTEERS =================

        const uniqueVolunteers = new Set();

        joinedRegistrations.forEach(
          (registration) => {
            let volunteer =
              registration.volunteerId ||
              registration.volunteer ||
              registration.userId;

            // If volunteer is an object
            if (
              typeof volunteer === "object" &&
              volunteer !== null
            ) {
              volunteer =
                volunteer._id ||
                volunteer.email ||
                volunteer.username ||
                volunteer.name;
            }

            if (volunteer) {
              uniqueVolunteers.add(
                String(volunteer)
                  .trim()
                  .toLowerCase()
              );
            }
          }
        );

        const totalVolunteers =
          uniqueVolunteers.size;

        console.log(
          "TOTAL CURRENT VOLUNTEERS:",
          totalVolunteers
        );

        // ================= CITY COUNT =================

        const locations = eventData
          .map((event) =>
            String(event.location || "")
              .trim()
              .toLowerCase()
          )
          .filter(Boolean);

        const uniqueCities =
          new Set(locations);

        // ================= SET HOME STATS =================

        setStats({
          events: eventData.length,
          ngos: uniqueNGOs.size,
          volunteers: totalVolunteers,
          cities: uniqueCities.size,
        });

        console.log(
          "FINAL HOME STATS:",
          {
            events: eventData.length,
            ngos: uniqueNGOs.size,
            volunteers: totalVolunteers,
            cities: uniqueCities.size,
          }
        );

        // ================= LATEST 3 EVENTS =================

        setEvents(
          [...eventData]
            .reverse()
            .slice(0, 3)
        );

      } catch (error) {
        console.log(
          "HOME DATA ERROR:",
          error.response?.data ||
            error.message
        );
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      {/* ================= HERO SECTION ================= */}

      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">
            🌍 Together We Can Make a Difference
          </span>

          <h1>
            Together We Can <br />
            <span>Make a Difference</span>
          </h1>

          <p>
            Join hands with NGOs and volunteers
            to build stronger communities through
            meaningful events and social impact.
          </p>
        </div>

        <div className="hero-image">
          <img
            src={heroImage}
            alt="Volunteer Finder"
          />
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="stats-section">

        {/* EVENTS */}
        <div className="stat-box">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>

          <div>
            <h2>{stats.events}</h2>
            <p>Events</p>
          </div>
        </div>

        {/* NGOs */}
        <div className="stat-box">
          <div className="stat-icon">
            <FaBuilding />
          </div>

          <div>
            <h2>{stats.ngos}</h2>
            <p>NGOs</p>
          </div>
        </div>

        {/* VOLUNTEERS */}
        <div className="stat-box">
          <div className="stat-icon">
            <FaUsers />
          </div>

          <div>
            <h2>{stats.volunteers}</h2>
            <p>Volunteers</p>
          </div>
        </div>

        {/* CITIES */}
        <div className="stat-box">
          <div className="stat-icon">
            <FaMapMarkerAlt />
          </div>

          <div>
            <h2>{stats.cities}</h2>
            <p>Cities</p>
          </div>
        </div>

      </section>

      {/* ================= FEATURED EVENTS ================= */}

      <section className="home-events">

        <div className="home-event-header">
          <div>
            <h2>Featured Events</h2>

            <p>
              Discover meaningful opportunities
              and make a difference.
            </p>
          </div>
        </div>

        <div className="home-event-container">

          {events.length === 0 ? (

            <div className="no-events">
              <p>No events available.</p>
            </div>

          ) : (

            events.map((event, index) => (

              <div
                className="home-event-card"
                key={event._id}
              >

                {/* IMAGE */}

                <img
                  src={
                    event.image ||
                    [event1, event2, event3][index]
                  }
                  alt={event.title}
                />

                {/* EVENT INFO */}

                <div className="home-event-info">

                  <h3>
                    {event.title}
                  </h3>

                  <p>
                    {event.description
                      ? event.description.length > 100
                        ? event.description.substring(
                            0,
                            100
                          ) + "..."
                        : event.description
                      : "Join us and make a difference in the community."
                    }
                  </p>

                  <div className="event-location">

                    <div className="event-meta">

                      {event.location && (
                        <div className="event-location">
                          📍 {event.location}
                        </div>
                      )}

                      {event.date && (
                        <div className="event-date">
                          📅 {event.date}
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>

            ))
          )}

        </div>

      </section>
    </>
  );
};

export default Home;