import React from "react";
import "./About.css";
import heroImage from "../assets/hero1.jpg";
import {
  FaBullseye,
  FaEye,
  FaHandsHelping,
  FaUsers,
  FaBuilding,
  FaCalendarCheck
} from "react-icons/fa";

function About() {
  return (
    <div className="about-page">

      {/* About Section */}
      <section className="about-container">

        <div className="about-content">

          <h1>
            About <span>Us</span>
          </h1>

          <p className="intro">
            Local Volunteer Finder is a platform that connects passionate
            volunteers with NGOs and social organizations to create meaningful
            change in society.
          </p>

          


          <div className="about-card">

            <div className="icon">
              <FaBullseye />
            </div>

            <div>
              <h3>Our Mission</h3>
              <p>
                To make volunteering simple by connecting people with
                opportunities where they can contribute their skills and time.
              </p>
            </div>

          </div>



          <div className="about-card">

            <div className="icon">
              <FaEye />
            </div>

            <div>
              <h3>Our Vision</h3>
              <p>
                Building a connected community where every person can
                participate in creating a better tomorrow.
              </p>
            </div>

          </div>



          <div className="about-card">

            <div className="icon">
              <FaHandsHelping />
            </div>

            <div>
              <h3>Our Impact</h3>
              <p>
                Helping volunteers and NGOs work together for social
                development and community growth.
              </p>
            </div>

          </div>


        </div>



        <div className="about-image">

<img
  src={heroImage}
  alt="Volunteer"
/>

        </div>


      </section>






    </div>
  );
}


export default About;