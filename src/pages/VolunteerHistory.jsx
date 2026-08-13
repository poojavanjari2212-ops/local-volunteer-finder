import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerHistory.css";

const VolunteerHistory = () => {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const user =
          JSON.parse(localStorage.getItem("user"));

        if (!user) {
          setHistory([]);
          return;
        }

        // Get registrations
        const registrationResponse = await axios.get(
          "http://localhost:5000/api/registrations"
        );

        const allRegistrations =
          registrationResponse.data.registrations || [];

        // Current volunteer registrations
        const myRegistrations =
          allRegistrations.filter(
            (registration) =>
              registration.volunteerId === user.email
          );

        // Get all events
// Show all joined events
setHistory(myRegistrations);

console.log(
  "MY VOLUNTEER HISTORY:",
  myRegistrations
);

      } catch (error) {

        console.log(
          "HISTORY ERROR:",
          error.response?.data ||
          error.message
        );

      }

    };

    fetchHistory();

  }, []);

return (
  <div className="history-page">

      <h2>Volunteer History</h2>

      <p>Your completed volunteer activities.</p>

      {history.length === 0 ? (

        <div className="empty-box">

          <h3>No completed events yet</h3>

          <p>
            Complete an event to see your history.
          </p>

        </div>

      ) : (

        <div className="history-container">

          {history.map((registration) => (

            <div
              className="history-card"
              key={registration._id}
            >

              <h3>
                {registration.eventTitle}
              </h3>

              <p>
                ⏱ Volunteer Hours
              </p>

              <span>
                Completed ✅
              </span>

            </div>

          ))}

        </div>

      )}

    </div>

  );
};

export default VolunteerHistory;