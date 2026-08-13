import React, { useState } from "react";
import "./NGOProfile.css";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit
} from "react-icons/fa";

const NGOProfile = () => {

  const [isEdit, setIsEdit] = useState(false);

  const [profile, setProfile] = useState({
    name: "Green Earth NGO",
    email: "greenearth@gmail.com",
    phone: "+91 9876543210",
    location: "Pune, Maharashtra",
    about:
      "Green Earth NGO works for environmental protection, tree plantation, blood donation camps, food distribution and community welfare."
  });

  const handleSave = () => {
    localStorage.setItem(
      "ngoProfile",
      JSON.stringify(profile)
    );

    alert("Profile Updated Successfully!");

    setIsEdit(false);
  };

  return (
    <div className="ngo-profile-page">

      <div className="ngo-profile-card">

        <div className="ngo-header">

          <div className="ngo-avatar">
            <FaBuilding />
          </div>

          <div>
            <h2>{profile.name}</h2>
            <p>NGO Organization</p>
          </div>

          <button
            className="edit-btn"
            onClick={() => setIsEdit(!isEdit)}
          >
            <FaEdit /> {isEdit ? "Cancel" : "Edit Profile"}
          </button>

        </div>

        {isEdit ? (

          <div className="edit-form">

            <input
              type="text"
              value={profile.name}
              placeholder="NGO Name"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
            />

            <input
              type="email"
              value={profile.email}
              placeholder="Email"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
            />

            <input
              type="text"
              value={profile.phone}
              placeholder="Phone"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone: e.target.value,
                })
              }
            />

            <input
              type="text"
              value={profile.location}
              placeholder="Location"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  location: e.target.value,
                })
              }
            />

            <textarea
              rows="5"
              value={profile.about}
              placeholder="About NGO"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  about: e.target.value,
                })
              }
            />

            <button
              className="save-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>

          </div>

        ) : (

          <div className="profile-details">

            <div className="detail">
              <FaEnvelope />
              <span>{profile.email}</span>
            </div>

            <div className="detail">
              <FaPhone />
              <span>{profile.phone}</span>
            </div>

            <div className="detail">
              <FaMapMarkerAlt />
              <span>{profile.location}</span>
            </div>

            <div className="about-box">
              <h3>About NGO</h3>
              <p>{profile.about}</p>
            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default NGOProfile;