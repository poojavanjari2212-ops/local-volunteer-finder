import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./Events.css";




import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";



const Events = () => {

const [category, setCategory] = useState("All Categories");
const [search, setSearch] = useState("");
const [location, setLocation] = useState("All Locations");

const [events, setEvents] = useState([]);


useEffect(() => {

  const fetchEvents = async () => {

    try {

const response = await axios.get(
  "https://local-volunteer-finder.onrender.com/api/events"
);
      console.log("API DATA:", response.data);

const formattedEvents = response.data.map((event) => ({
  id: event._id,
  title: event.title,
  category: event.category,
  location: event.location,
  volunteers: event.volunteers + " Volunteers",
  image: event.image
}));
setEvents(formattedEvents);
    } catch (error) {

      console.log("API ERROR:", error);

    }

  };

  fetchEvents();

}, []);

const filteredEvents = events.filter((event) => {
  const matchCategory =
    category === "All Categories" || event.category === category;

  const matchSearch =
    event.title.toLowerCase().includes(search.toLowerCase());

  const matchLocation =
    location === "All Locations" || event.location === location;

  return matchCategory && matchSearch && matchLocation;
});

  return (
  <div className="events-container">

    <div className="events-header">
      <h1>All Events</h1>
      <p>Find events that need your support</p>
    </div>

    <div className="filter-bar">

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All Categories">All Categories</option>
        <option value="Environment">Environment</option>
        <option value="Health">Health</option>
        <option value="Education">Education</option>
      </select>

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="All Locations">All Locations</option>

        {[...new Set(events.map((e) => e.location))].map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

    </div>

    <div className="event-grid">

      {filteredEvents.map((event) => (

        <div className="event-card" key={event.id}>

          <img
            src={event.image}
            alt={event.title}
            className="event-image"
          />

          <div className="event-content">

            <h3>{event.title}</h3>

            <p>
              <FaMapMarkerAlt /> {event.location}
            </p>

            <p>
              <FaUsers /> {event.volunteers}
            </p>

            <Link to={`/event/${event.id}`} className="view-btn">
              View Details
            </Link>

          </div>

        </div>

      ))}

    </div>

  </div>
);
};

export default Events;