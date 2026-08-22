import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerHistory.css";

const API =
  "https://local-volunteer-finder.onrender.com/api";

const VolunteerHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user =
          JSON.parse(localStorage.getItem("user"));

        if (!user) {
          setHistory([]);
          setLoading(false);
          return;
        }

        // ================= GET REGISTRATIONS =================

        const registrationResponse = await axios.get(
          `${API}/registrations`
        );

        const allRegistrations =
          registrationResponse.data?.registrations ||
          registrationResponse.data ||
          [];

        console.log(
          "ALL REGISTRATIONS:",
          allRegistrations
        );

        // ================= LOGGED USER =================

        const loggedInEmail = String(
          user.email || ""
        )
          .trim()
          .toLowerCase();

        // ================= ONLY COMPLETED EVENTS =================

        const completedRegistrations =
          allRegistrations.filter((registration) => {

            let volunteerId =
              registration.volunteerId;

            // If volunteerId is object
            if (
              typeof volunteerId === "object" &&
              volunteerId !== null
            ) {
              volunteerId =
                volunteerId.email ||
                volunteerId._id ||
                volunteerId.username;
            }

            const registrationEmail =
              String(volunteerId || "")
                .trim()
                .toLowerCase();

            const status = String(
              registration.status || ""
            )
              .trim()
              .toLowerCase();

            // IMPORTANT:
            // Only logged-in volunteer
            // AND status must be completed

            return (
              registrationEmail === loggedInEmail &&
              status === "completed"
            );
          });

        console.log(
          "MY COMPLETED EVENTS:",
          completedRegistrations
        );

        setHistory(completedRegistrations);

      } catch (error) {
        console.log(
          "HISTORY ERROR:",
          error.response?.data ||
            error.message
        );

        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-page">

      <h2>Volunteer History</h2>

      <p>
        Your completed volunteer activities.
      </p>

      {/* ================= LOADING ================= */}

      {loading ? (

        <div className="empty-box">

          <h3>
            Loading history...
          </h3>

        </div>

      ) : history.length === 0 ? (

        /* ================= NO COMPLETED EVENTS ================= */

        <div className="empty-box">

          <h3>
            No completed events yet
          </h3>

          <p>
            Complete an event to see your
            history here.
          </p>

        </div>

      ) : (

        /* ================= COMPLETED EVENTS ================= */

        <div className="history-container">

          {history.map((registration) => (

            <div
              className="history-card"
              key={registration._id}
            >

              <h3>
                {registration.eventTitle ||
                  "Volunteer Event"}
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