import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHandsHelping, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <header className="navbar">


      <div className="logo">

        <FaHandsHelping className="logo-icon" />

        <div>
          <h2>Volunteer Finder</h2>
          <span>Helping Communities Together</span>
        </div>

      </div>



      <ul className={menuOpen ? "nav-links active" : "nav-links"}>


        <li>
          <Link to="/">
            Home
          </Link>
        </li>


        <li>
          <Link to="/events">
            Events
          </Link>
        </li>


        <li>
          <Link to="/about">
            About
          </Link>
        </li>


        <li>
          <Link to="/contact">
            Contact
          </Link>
        </li>


        <li>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </li>


      </ul>




      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >

        {
          menuOpen
          ?
          <FaTimes />
          :
          <FaBars />
        }

      </div>


    </header>

  );

}


export default Navbar;