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


  // Logged-in volunteer चे registrations
  useEffect(() => {

    const fetchJoinedCount = async () => {

      try {

        const response = await axios.get(
          "http://localhost:5000/api/registrations"
        );

        const allRegistrations =
          response.data.registrations || [];

        const myRegistrations =
          allRegistrations.filter(
            (registration) =>
              registration.volunteerId === user.email
          );

        setJoinedCount(myRegistrations.length);

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

      }

    };

    fetchJoinedCount();

  }, [user.email]);


  // Save Profile
  const saveProfile = () => {

    localStorage.setItem(
      profileKey,
      JSON.stringify(profile)
    );

    setIsEdit(false);

  };


  return (

    <div className="profile-container">

      {/* Profile Header */}

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
  onClick={() => setIsEdit(!isEdit)}
>
  <FaEdit />
  {isEdit ? "Cancel" : "Edit Profile"}
</button>

      </div>


      {/* Edit Profile */}

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


      {/* Profile Details */}

      <div className="profile-details">

        {/* Email */}

        <div className="detail-card">

          <FaEnvelope />

          <div>

            <span>Email</span>

            <p>{profile.email}</p>

          </div>

        </div>


        {/* Phone */}

        <div className="detail-card">

          <FaPhone />

          <div>

            <span>Phone</span>

            <p>
              {profile.phone || "Not provided"}
            </p>

          </div>

        </div>


        {/* Location */}

        <div className="detail-card">

          <FaMapMarkerAlt />

          <div>

            <span>Location</span>

            <p>{profile.location}</p>

          </div>

        </div>


        {/* Events Joined */}

        <div className="detail-card">

          <FaUser />

          <div>

            <span>Events Joined</span>

            <p>{joinedCount} Events</p>

          </div>

        </div>

      </div>


      {/* About */}

      <div className="about-card">

        <h3>About Me</h3>

        <p>
          Passionate volunteer who loves participating in
          community service activities and social initiatives.
        </p>

      </div>

    </div>

  );

}

export default Profile;