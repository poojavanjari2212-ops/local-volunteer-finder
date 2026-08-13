import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Volunteer");
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="login-container">

      {/* Left Section */}
      <div className="login-image-section">

        <div className="login-text">
          <h1>
            Make a Difference
            <br />
            Together
          </h1>

          <p>
            Join our community and connect with
            people who want to create a better world.
          </p>
        </div>

        <img
          src="https://img.freepik.com/free-vector/volunteering-concept-illustration_114360-1233.jpg"
          alt="Volunteer"
        />

      </div>


      {/* Right Section */}
      <div className="login-form-section">

        <div className="login-card">

          <h2>Welcome Back!</h2>

          <p className="subtitle">
            Login to continue your journey
          </p>


          {/* Role Selection */}
          <div className="role-box">

            <button
              type="button"
              className={
                role === "Volunteer"
                  ? "role active"
                  : "role"
              }
              onClick={() => {
                setRole("Volunteer");
                setShowPassword(false);
                setFullName("");
                setEmail("");
                setPassword("");
                setPhone("");
                setLocation("");
              }}
            >
              <FaUser />
              Volunteer
            </button>


            <button
              type="button"
              className={
                role === "NGO"
                  ? "role active"
                  : "role"
              }
              onClick={() => {
                setRole("NGO");
                setShowPassword(false);
                setFullName("");
                setEmail("");
                setPassword("");
                setPhone("");
                setLocation("");
              }}
            >
              <FaBuilding />
              NGO
            </button>

          </div>


          {/* Volunteer Fields */}
          {role === "Volunteer" && (
            <>

              {/* Full Name */}
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="off"
                />
              </div>


              {/* Phone */}
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="off"
                />
              </div>


              {/* Location */}
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  autoComplete="off"
                />
              </div>

            </>
          )}


          {/* Email */}
          <div className="input-box">
            <input
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="new-password"
            />
          </div>


          {/* Password */}
          <div className="input-box password">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <span
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>

          </div>


          {/* Forgot Password */}
          <div className="forgot">
            Forgot Password?
          </div>


          {/* Login Button */}
          <button
            type="button"
            className="login-btn"
            onClick={() => {

              {/* NGO Login */}
              if (role === "NGO") {

                if (
                  email === "ngo@gmail.com" &&
                  password === "ngo123"
                ) {

localStorage.setItem(
  "user",
  JSON.stringify({
    name: "Green Earth NGO",
    email: "ngo@gmail.com",
    role: "NGO",
  })
);

                  navigate("/ngo-dashboard");

                } else {

                  alert("Invalid NGO Email or Password");

                }

                return;
              }


              {/* Volunteer Login */}
              if (role === "Volunteer") {

                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    _id: email,
                    name: fullName,
                    email: email,
                    volunteerId: email,
                    volunteerName: fullName,
                    phone: phone,
                    location: location,
                    role: "Volunteer",
                  })
                );

                navigate("/volunteer-dashboard");
              }

            }}
          >
            Login
          </button>


          {/* Register */}
          <p className="register-link">
            Don't have an account?

            <Link to="/register">
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;