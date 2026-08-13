import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyRegistrations.css";

const MyRegistrations = () => {

  const [registrations, setRegistrations] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchRegistrations = async () => {

      try {

        const user =
          JSON.parse(localStorage.getItem("user"));

        if (!user || !user.email) {

          setRegistrations([]);
          setLoading(false);

          return;
        }


        // Get all registrations
        const response = await axios.get(
          "http://localhost:5000/api/registrations"
        );

        const allRegistrations =
          response.data.registrations || [];


        console.log(
          "ALL REGISTRATIONS:",
          allRegistrations
        );

        console.log(
          "LOGGED IN USER:",
          user
        );


        // Current logged-in volunteer registrations
// Current logged-in volunteer registrations
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

console.log("LOGGED IN EMAIL:", loggedInEmail);
console.log("MY REGISTRATIONS:", myRegistrations);


        console.log(
          "MY REGISTRATIONS:",
          myRegistrations
        );


        // Get event details
        const details = {};


        await Promise.all(

          myRegistrations.map(
            async (registration) => {

              try {

                const eventId =
                  typeof registration.eventId === "object"
                    ? registration.eventId?._id
                    : registration.eventId;


                if (!eventId) {
                  return;
                }


                const eventResponse =
                  await axios.get(
                    `http://localhost:5000/api/events/${eventId}`
                  );


                details[eventId] =
                  eventResponse.data;


                console.log(
                  "EVENT IMAGE:",
                  eventResponse.data.image
                );


              } catch (error) {

                console.log(
                  "EVENT FETCH ERROR:",
                  error.response?.data ||
                  error.message
                );

              }

            }
          )

        );


        setRegistrations(
          myRegistrations
        );

        setEventDetails(
          details
        );


      } catch (error) {

        console.log(
          "REGISTRATION FETCH ERROR:",
          error.response?.data ||
          error.message
        );

      } finally {

        setLoading(false);

      }

    };


    fetchRegistrations();

  }, []);


  return (

   <div className="registrations-page">

      <h1>My Registrations</h1>

      <p>
        Your registered volunteer events.
      </p>


      {loading ? (

        <div className="empty-box">

          <p>
            Loading registrations...
          </p>

        </div>

      ) : registrations.length === 0 ? (

        <div className="empty-box">

          <h3>
            No registrations yet
          </h3>

          <p>
            Join an event to see it here.
          </p>

        </div>

      ) : (

        <div className="registration-container">

          {registrations.map(
            (registration) => {

              const eventId =
                typeof registration.eventId === "object"
                  ? registration.eventId?._id
                  : registration.eventId;


              const event =
                eventDetails[eventId];


              return (

                <div
                  className="registration-card"
                  key={registration._id}
                >

                  {event?.image && (

                    <img
                      src={event.image}
                      alt={
                        registration.eventTitle ||
                        event.title ||
                        "Volunteer Event"
                      }
                    />

                  )}


                  <div className="registration-content">

                    <h3>
                      {registration.eventTitle ||
                        event?.title ||
                        "Volunteer Event"}
                    </h3>

                    <span>
                      Registered ✅
                    </span>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );

};

export default MyRegistrations;