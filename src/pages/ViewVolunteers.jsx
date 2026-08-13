import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewVolunteers.css";

const ViewVolunteers = () => {

  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        // Get Events
        const eventResponse = await axios.get(
          "http://localhost:5000/api/events"
        );

        const allEvents = eventResponse.data || [];

        setEvents(allEvents);

        console.log(
          "NGO EVENTS:",
          allEvents
        );


        // Get Registrations
        const registrationResponse = await axios.get(
          "http://localhost:5000/api/registrations"
        );

        const registrations =
          registrationResponse.data.registrations || [];

        console.log(
          "ALL REGISTRATIONS:",
          registrations
        );


        // Get event IDs
        const eventIds = allEvents.map(
          (event) => String(event._id)
        );


        // Only registrations belonging to NGO events
        const ngoRegistrations =
          registrations.filter(
            (registration) => {

              const registrationEventId =
                typeof registration.eventId === "object"
                  ? registration.eventId?._id
                  : registration.eventId;

              return eventIds.includes(
                String(registrationEventId)
              );

            }
          );


        console.log(
          "NGO VOLUNTEERS:",
          ngoRegistrations
        );


        setVolunteers(
          ngoRegistrations
        );

      } catch (error) {

        console.log(
          "VOLUNTEERS FETCH ERROR:",
          error.response?.data ||
          error.message
        );

      }

    };


    fetchData();

  }, []);


  return (

    <div className="view-volunteers-page">

      <h2>View Volunteers</h2>

      <p>
        Registered volunteers for your events.
      </p>


      <table>

        <thead>

          <tr>

            <th>Volunteer</th>

            <th>Event</th>

            <th>Status</th>

          </tr>

        </thead>


        <tbody>

          {volunteers.length === 0 ? (

            <tr>

              <td colSpan="3">
                No Volunteers Registered
              </td>

            </tr>

          ) : (

            volunteers.map((item) => (

              <tr key={item._id}>

                <td>

                  {item.volunteerName ||
                    item.volunteerId}

                </td>


                <td>

                  {item.eventTitle}

                </td>


                <td>

                  {item.status || "Joined"}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

};

export default ViewVolunteers;