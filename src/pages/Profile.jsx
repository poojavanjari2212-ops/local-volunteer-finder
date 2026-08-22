import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit
} from "react-icons/fa";

function Profile() {

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  // प्रत्येक logged-in volunteer साठी वेगळी profile key
  const profileKey = `profile_${user.email || "guest"}`;

  const [isEdit, setIsEdit] = useState(false);

  const [profile, setProfile] = useState(() => {

    const savedProfile =
      JSON.parse(localStorage.getItem(profileKey));

    if (savedProfile) {
      return savedProfile;
    }

    return {
      name: user.name || "Volunteer",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "Maharashtra, India"
    };

  });

  const [joinedCount, setJoinedCount] = useState(0);


  // ================= GET LOGGED-IN VOLUNTEER EVENTS =================

  useEffect(() => {

    const fetchJoinedCount = async () => {

      try {

        if (!user.email) {
          setJoinedCount(0);
          return;
        }

        const response = await axios.get(
          "https://local-volunteer-finder.onrender.com/api/registrations"
        );

        const allRegistrations =
          response.data?.registrations ||
          response.data ||
          [];

        console.log(
          "ALL REGISTRATIONS:",
          allRegistrations
        );

        const loggedInEmail =
          String(user.email)
            .trim()
            .toLowerCase();

        // Only current volunteer registrations
        const myRegistrations =
          allRegistrations.filter(
            (registration) => {

              let volunteerId =
                registration.volunteerId;

              // volunteerId object असल्यास
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

              return (
                registrationEmail ===
                loggedInEmail
              );

            }
          );

        console.log(
          "MY REGISTRATIONS:",
          myRegistrations
        );

        // Joined + Completed दोन्ही count होतील
        setJoinedCount(
          myRegistrations.length
        );

        console.log(
          "MY JOINED COUNT:",
          myRegistrations.length
        );

      } catch (error) {

        console.log(
          "PROFILE REGISTRATION ERROR:",
          error.response?.data ||
          error.message
        );

        setJoinedCount(0);
      }

    };

    fetchJoinedCount();

  }, [user.email]);


  // ================= SAVE PROFILE =================

  const saveProfile = () => {

    localStorage.setItem(
      profileKey,
      JSON.stringify(profile)
    );

    setIsEdit(false);

  };


  return (

    <div className="profile-container">

      {/* ================= PROFILE HEADER ================= */}

      <div className="profile-header">

        <div className="profile-image">
          <FaUser />
        </div>

        <div>

          <h2>{profile.name}</h2>

          <p>Volunteer</p>

        </div>

        <button
          className="edit-btn"
          onClick={() =>
            setIsEdit(!isEdit)
          }
        >

          <FaEdit />

          {isEdit
            ? "Cancel"
            : "Edit Profile"}

        </button>

      </div>


      {/* ================= EDIT PROFILE ================= */}

      {isEdit && (

        <div className="profile-edit">

          <input
            type="text"
            placeholder="Name"
            value={profile.name}
            onChange={(e) =>
              setProfile({
                ...profile,
                name: e.target.value
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={profile.email}
            onChange={(e) =>
              setProfile({
                ...profile,
                email: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            value={profile.phone}
            onChange={(e) =>
              setProfile({
                ...profile,
                phone: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Location"
            value={profile.location}
            onChange={(e) =>
              setProfile({
                ...profile,
                location: e.target.value
              })
            }
          />

          <button
            className="save-btn"
            onClick={saveProfile}
          >
            Save Changes
          </button>

        </div>

      )}


      {/* ================= PROFILE DETAILS ================= */}

      <div className="profile-details">

        {/* EMAIL */}

        <div className="detail-card">

          <FaEnvelope />

          <div>

            <span>Email</span>

            <p>
              {profile.email}
            </p>

          </div>

        </div>


        {/* PHONE */}

        <div className="detail-card">

          <FaPhone />

          <div>

            <span>Phone</span>

            <p>
              {profile.phone ||
                "Not provided"}
            </p>

          </div>

        </div>


        {/* LOCATION */}

        <div className="detail-card">

          <FaMapMarkerAlt />

          <div>

            <span>Location</span>

            <p>
              {profile.location}
            </p>

          </div>

        </div>


        {/* EVENTS JOINED */}

        <div className="detail-card">

          <FaUser />

          <div>

            <span>Events Joined</span>

            <p>
              {joinedCount} Events
            </p>

          </div>

        </div>

      </div>


      {/* ================= ABOUT ================= */}

      <div className="about-card">

        <h3>About Me</h3>

        <p>
          Passionate volunteer who loves
          participating in community service
          activities and social initiatives.
        </p>

      </div>

    </div>

  );

}

export default Profile;