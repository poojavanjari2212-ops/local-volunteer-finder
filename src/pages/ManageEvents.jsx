import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaCheck } from "react-icons/fa";
import "./ManageEvents.css";

const API = "https://local-volunteer-finder.onrender.com/api";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  // ================= EVENTS =================

  const fetchEvents = async () => {
    try {
const response = await axios.get(
  `${API}/events`
);

      setEvents(response.data);
    } catch (error) {
      console.log("EVENTS ERROR:", error);
    }
  };

  // ================= REGISTRATIONS =================

  const fetchRegistrations = async () => {
    try {
const response = await axios.get(
  `${API}/registrations`
);

      setRegistrations(response.data.registrations || []);
    } catch (error) {
      console.log(
        "REGISTRATIONS ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ================= ADD EVENT =================

const handleAddEvent = () => {
  localStorage.removeItem("editEvent");
  window.location.href = "/add-event";
};

  // ================= EDIT =================

  const handleEdit = (event) => {
    localStorage.setItem(
      "editEvent",
      JSON.stringify(event)
    );

    window.location.href = "/add-event";
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
await axios.delete(
  `${API}/events/${id}`
);

      alert("Event Deleted Successfully");

      fetchEvents();
      fetchRegistrations();
    } catch (error) {
      console.log("DELETE ERROR:", error);
      alert("Delete failed");
    }
  };

  // ================= COMPLETE VOLUNTEER =================

  const handleCompleteVolunteer = async (registration) => {
    const volunteerName =
      registration.volunteerName ||
      registration.volunteerId;

    const confirmComplete = window.confirm(
      `Complete ${volunteerName}'s participation?`
    );

    if (!confirmComplete) return;

    try {
    await axios.put(
  `${API}/registrations/${registration._id}/complete`
);
      

      alert(
        `${volunteerName} completed successfully. Certificate generated.`
      );

      fetchRegistrations();
    } catch (error) {
      console.log(
        "COMPLETE ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to complete volunteer."
      );
    }
  };

  return (
    <div className="manage-events-page">

      {/* HEADER */}

      <div className="manage-header">
        <h2>Manage Events</h2>

        <p>
          View and manage your events and registered volunteers.
        </p>
      </div>

      {/* TABLE */}

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Location</th>
              <th>Volunteer</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {events.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="no-data"
                >
                  No Events Found
                </td>
              </tr>

            ) : (

              events.map((event) => {

                const eventRegistrations =
                  registrations.filter(
                    (registration) =>
                      registration.eventId === event._id ||
                      registration.eventId?._id === event._id
                  );

                // जर event ला volunteer नसतील
                if (eventRegistrations.length === 0) {
                  return (
                    <tr key={event._id}>
                      <td>
                        <strong>{event.title}</strong>
                      </td>

                      <td>{event.date}</td>

                      <td>{event.location}</td>

                      <td className="no-volunteer">
                        No volunteers
                      </td>

                      <td>
                        <span className="active-status">
                          Active
                        </span>
                      </td>

                      <td className="actions">

                        <button
                          className="icon-btn edit-btn"
                          onClick={() =>
                            handleEdit(event)
                          }
                          title="Edit Event"
                        >
                          ✎
                        </button>

                        <button
                          className="icon-btn delete-btn"
                          onClick={() =>
                            handleDelete(event._id)
                          }
                          title="Delete Event"
                        >
                          <FaTrash />
                        </button>

                      </td>
                    </tr>
                  );
                }

                return eventRegistrations.map(
                  (registration, index) => (

                    <tr
                      key={registration._id}
                    >

                      {/* EVENT */}

                      <td>
                        <strong>
                          {event.title}
                        </strong>
                      </td>

                      {/* DATE */}

                      <td>
                        {event.date}
                      </td>

                      {/* LOCATION */}

                      <td>
                        {event.location}
                      </td>

                      {/* VOLUNTEER */}

                      <td>
                        <strong>
                          {registration.volunteerName ||
                            registration.volunteerId}
                        </strong>
                      </td>

                      {/* STATUS */}

                      <td>

                        {registration.status ===
                        "Completed" ? (

                          <span className="completed-badge">
                            Completed ✓
                          </span>

                        ) : (

                          <span className="joined-badge">
                            Joined
                          </span>

                        )}

                      </td>

                      {/* ACTION */}

                      <td className="actions">

                        {/* EDIT */}

                        <button
                          className="icon-btn edit-btn"
                          onClick={() =>
                            handleEdit(event)
                          }
                          title="Edit Event"
                        >
                          ✎
                        </button>

                        {/* DELETE */}

                        <button
                          className="icon-btn delete-btn"
                          onClick={() =>
                            handleDelete(event._id)
                          }
                          title="Delete Event"
                        >
                          <FaTrash />
                        </button>

                        {/* COMPLETE */}

                        {registration.status !==
                        "Completed" ? (
<button
  className="complete-btn"
  onClick={() =>
    handleCompleteVolunteer(registration)
  }
  title="Complete Volunteer"
>
  <FaCheck />
  Complete
</button>

                        ) : (

                          <span className="certificate-text">
                            Certificate ✓
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                );
              })
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ManageEvents;