import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";
import { FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSending(true);

      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );

      alert(
        response.data.message ||
          "Message sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log("CONTACT FRONTEND ERROR:", error);
      console.log("RESPONSE:", error.response?.data);

      alert(
        error.response?.data?.error ||
          "Failed to send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">

      <div className="contact-header">
        <h1>Get In Touch</h1>

        <p>
          We'd love to hear from you. Feel free to contact the
          Information Technology Department.
        </p>
      </div>

      <div className="contact-container">

        <div className="contact-form-card">

          <h2>Send Message</h2>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <textarea
                rows="6"
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="send-btn"
              disabled={sending}
            >
              <FaPaperPlane />

              {sending
                ? "Sending..."
                : "Send Message"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Contact;