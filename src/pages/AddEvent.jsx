import React, { useState, useEffect } from "react";
import "./AddEvent.css";
import axios from "axios";

const AddEvent = () => {
const [editData, setEditData] = useState(null);

  const [event, setEvent] = useState({
    name: "",
    category: "",
    location: "",
    date: "",
    time: "",
    volunteers: "",
    description: "",
  });

  const [image, setImage] = useState("");

useEffect(() => {
  const data = JSON.parse(localStorage.getItem("editEvent"));

  if (data) {
    setEditData(data);

    setEvent({
      name: data.title || "",
      category: data.category || "",
      location: data.location || "",
      date: data.date || "",
      time: data.time || "",
      volunteers: data.volunteers || "",
      description: data.description || "",
    });

    setImage(data.image || "");
  }
}, []);

  // Compress Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const maxWidth = 800;
        const maxHeight = 600;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        const compressedImage =
          canvas.toDataURL("image/jpeg", 0.7);

        setImage(compressedImage);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!event.name || !event.category || !event.location) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (editData) {
        await axios.put(
          `http://localhost:5000/api/events/${editData._id}`,
          {
            title: event.name,
            description: event.description,
            date: event.date,
            location: event.location,
            category: event.category,
            volunteers: Number(event.volunteers),
            image: image || editData.image,
          }
        );

        alert("Event Updated Successfully!");

        localStorage.removeItem("editEvent");

        window.location.href = "/manage-events";

      } else {

        console.log("IMAGE LENGTH:", image?.length);
console.log("IMAGE START:", image?.substring(0, 50));
        const response = await axios.post(
          "http://localhost:5000/api/events",

          
          {
            title: event.name,
            description: event.description,
            date: event.date,
            location: event.location,
            category: event.category,
            volunteers: Number(event.volunteers),
           createdBy: JSON.parse(localStorage.getItem("user"))?.name || "NGO",
            image: image,
          }
        );

        console.log("EVENT CREATED:", response.data);

        alert("Event Created Successfully!");

        setEvent({
          name: "",
          category: "",
          location: "",
          date: "",
          time: "",
          volunteers: "",
          description: "",
        });

        setImage("");
      }

    } catch (error) {
      console.log("CREATE/UPDATE ERROR:", error);

      console.log(
        "ERROR DATA:",
        error.response?.data
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      alert(
        error.response?.data?.message ||
        error.message
      );
    }
  };

 return (
  <div className="add-event-page">

    <h2>Add New Event</h2>

      <p>
        Create a new event for volunteers.
      </p>

      <form
        className="event-form"
        onSubmit={handleSubmit}
      >

        <div className="form-row">

          <div className="form-group">
            <label>Event Name</label>

            <input
              type="text"
              placeholder="Enter Event Name"
              value={event.name}
              onChange={(e) =>
                setEvent({
                  ...event,
                  name: e.target.value,
                })
              }
              required
            />
          </div>


          <div className="form-group">
            <label>Category</label>

            <select
              value={event.category}
              onChange={(e) =>
                setEvent({
                  ...event,
                  category: e.target.value,
                })
              }
              required
            >

              <option value="">
                Select Category
              </option>

              <option value="Environment">
                Environment
              </option>

              <option value="Health">
                Health
              </option>

              <option value="Education">
                Education
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Community">
                Community
              </option>

            </select>
          </div>

        </div>


        <div className="form-row">

          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              placeholder="Enter Location"
              value={event.location}
              onChange={(e) =>
                setEvent({
                  ...event,
                  location: e.target.value,
                })
              }
              required
            />
          </div>


          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={event.date}
              onChange={(e) =>
                setEvent({
                  ...event,
                  date: e.target.value,
                })
              }
              required
            />
          </div>

        </div>


        <div className="form-row">

          <div className="form-group">
            <label>Time</label>

            <input
              type="time"
              value={event.time}
              onChange={(e) =>
                setEvent({
                  ...event,
                  time: e.target.value,
                })
              }
            />
          </div>


          <div className="form-group">
            <label>Volunteers Needed</label>

            <input
              type="number"
              placeholder="50"
              value={event.volunteers}
              onChange={(e) =>
                setEvent({
                  ...event,
                  volunteers: e.target.value,
                })
              }
              required
            />
          </div>

        </div>


        <div className="form-group">

          <label>Description</label>

          <textarea
            rows="5"
            placeholder="Write event description..."
            value={event.description}
            onChange={(e) =>
              setEvent({
                ...event,
                description: e.target.value,
              })
            }
            required
          />

        </div>


        <div className="form-group">

          <label>Event Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

        </div>


        {image && (
          <div className="image-preview">

            <img
              src={image}
              alt="Event Preview"
              style={{
                width: "200px",
                height: "130px",
                objectFit: "cover",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />

          </div>
        )}


        <div className="button-group">

          <button
            type="submit"
            className="create-btn"
          >
            {editData
              ? "Update Event"
              : "Create Event"}
          </button>


          <button
            type="reset"
            className="reset-btn"
onClick={() => {
  localStorage.removeItem("editEvent");
  setEditData(null);

  setEvent({
    name: "",
    category: "",
    location: "",
    date: "",
    time: "",
    volunteers: "",
    description: "",
  });

  setImage("");
}}
          >
            Reset
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddEvent;