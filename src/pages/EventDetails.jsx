import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

import "./EventDetails.css";

import tree from "../assets/hero1.jpg";
import blood from "../assets/blood.jpg";
import beach from "../assets/beach.jpg";
import food from "../assets/food.jpg";
import book from "../assets/book.jpg";
import health from "../assets/health.jpg";

const events = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    image: tree,
    date: "May 15, 2026 (Saturday)",
    time: "09:00 AM - 12:00 PM",
    location: "Pune, Maharashtra",
    volunteers: "60 / 100 Volunteers",
    organizer: "Green Earth NGO",
    about:
      "Join us in planting 1000 trees in our city to make our environment greener and healthier. Let's work together to protect nature and create a better future.",
  },
  {
    id: 2,
    title: "Blood Donation Camp",
    image: blood,
    date: "June 20, 2026",
    time: "09:00 AM - 02:00 PM",
    location: "Pune",
    volunteers: "80 / 150 Volunteers",
    organizer: "Life Saver NGO",
    about:
      "Donate blood and save lives by participating in our community blood donation camp.",
  },
  {
    id: 3,
    title: "Beach Cleanup",
    image: beach,
    date: "July 10, 2026",
    time: "08:00 AM - 12:00 PM",
    location: "Mumbai",
    volunteers: "120 / 200 Volunteers",
    organizer: "Clean Beach NGO",
    about:
      "Help us clean beaches and protect marine life.",
  },
  {
    id: 4,
    title: "Food Distribution",
    image: food,
    date: "August 5, 2026",
    time: "11:00 AM - 02:00 PM",
    location: "Nashik",
    volunteers: "65 / 120 Volunteers",
    organizer: "Helping Hands NGO",
    about:
      "Distribute food to needy families.",
  },
  {
    id: 5,
    title: "Book Donation",
    image: book,
    date: "September 12, 2026",
    time: "10:00 AM - 01:00 PM",
    location: "Aurangabad",
    volunteers: "25 / 60 Volunteers",
    organizer: "Education NGO",
    about:
      "Donate books to help children continue their education.",
  },
  {
    id: 6,
    title: "Health Camp",
    image: health,
    date: "October 18, 2026",
    time: "09:30 AM - 03:00 PM",
    location: "Kolhapur",
    volunteers: "95 / 150 Volunteers",
    organizer: "Health Care NGO",
    about:
      "Free medical checkup and health awareness camp.",
  },
];

function EventDetails() {
  const { id } = useParams();
const navigate = useNavigate();
const [message, setMessage] = useState("");

const [event, setEvent] = useState(null);

useEffect(() => {

const fetchEvent = async () => {

try {

const response = await axios.get(
  `https://local-volunteer-finder.onrender.com/api/events/${id}`
);
console.log("SINGLE EVENT:", response.data);

setEvent(response.data);

} catch(error) {

console.log("API ERROR:", error);

}

};

fetchEvent();

}, [id]);


const handleJoin = async () => {
  if (!event) {
    console.log("Event not loaded yet");
    return;
  }

  const storedUser = localStorage.getItem("user");

  // Login नाही
  if (!storedUser) {
    alert("Please login first to join this event.");
    navigate("/login");
    return;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("user");
    alert("Please login first to join this event.");
    navigate("/login");
    return;
  }

  // Email नाही
  if (!user || !user.email) {
    localStorage.removeItem("user");
    alert("Please login first to join this event.");
    navigate("/login");
    return;
  }

  // फक्त Volunteer ला Join करता येईल
  if (user.role !== "Volunteer") {
    alert("Only volunteers can join events.");
    return;
  }

  try {
    // Registration
const registrationResponse = await axios.post(
  "https://local-volunteer-finder.onrender.com/api/registrations",
      {
        volunteerId: user.email.trim().toLowerCase(),
        volunteerName: user.name || user.email,
        eventId: event._id,
        eventTitle: event.title,
      }
    );

    console.log(
      "REGISTRATION RESPONSE:",
      registrationResponse.data
    );

    // Volunteer count +1
await axios.put(
  `https://local-volunteer-finder.onrender.com/api/events/${event._id}`,
      {
        volunteers: Number(event.volunteers || 0) + 1,
      }
    );

    // Screen वर count update
    setEvent({
      ...event,
      volunteers: Number(event.volunteers || 0) + 1,
    });

    setMessage("Event Registered Successfully!");

  } catch (error) {
    console.log(
      "JOIN ERROR:",
      error.response?.data || error.message
    );

    setMessage(
      error.response?.data?.message ||
      "Registration Failed"
    );
  }
};
  if (!event) {
    return <h2>Event Not Found</h2>;
  }

  return (
    <div className="details-page">

<button
  className="back-link"
  onClick={() => navigate("/events")}
>
  <FaArrowLeft /> Back to Events
</button>

  <div className="details-container">

    <div className="left-panel">

         <img
  src={event.image || tree}
  alt={event.title}
/>

         <div className="details-info">

            <h2>{event.title}</h2>

            <p><FaCalendarAlt /> {event.date}</p>

            <p><FaClock /> {event.time}</p>

            <p><FaMapMarkerAlt /> {event.location}</p>

            <p><FaUsers /> {event.volunteers}</p>

            {message && (
  <div className="success-message">
    {message}
  </div>
)}

<button
className="join-btn"
onClick={handleJoin}
disabled={!event}
>
Join Event
</button>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="right-panel">

          <h3>About This Event</h3>

         <p>{event.description}</p>

          <h3>Organized By</h3>

          <div className="organizer-card">

            <FaUserTie className="user-icon"/>

            <div>
              <h4>{event.organizer}</h4>
              <span>Verified NGO</span>
            </div>

          </div>

          <div className="map-box">

    <iframe
  title="Google Map"
  src={`https://maps.google.com/maps?q=${encodeURIComponent(
    event.location
  )}&z=13&output=embed`}
  width="100%"
  height="220"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
></iframe>

</div>

</div>

</div>

</div>
);
}

export default EventDetails;