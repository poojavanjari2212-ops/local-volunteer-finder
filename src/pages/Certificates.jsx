import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Certificates.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Certificates = () => {

  const certificateRef = useRef();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch certificates from backend
useEffect(() => {

  const fetchCertificates = async () => {

    try {

const response = await axios.get(
  "https://local-volunteer-finder.onrender.com/api/certificates"
);

      console.log("CERTIFICATES API:", response.data);

      // Backend मधून certificates घेणे
      const allCertificates =
        response.data.certificates || [];

      console.log(
        "ALL CERTIFICATES:",
        allCertificates
      );

      console.log(
        "USER:",
        user
      );

      // Current logged-in volunteer चे certificates
// Current logged-in volunteer चे certificates
// Current logged-in volunteer चे certificates
const myCertificates = allCertificates.filter(
  (certificate) =>
    (
     certificate.volunteerId?.trim().toLowerCase() ===
user.email?.trim().toLowerCase() ||
      certificate.volunteerId?._id === user._id
    ) &&
    certificate.eventId !== null
);

// सर्व registrations घेणे
const registrationResponse = await axios.get(
  "https://local-volunteer-finder.onrender.com/api/registrations"
);

const allRegistrations =
  registrationResponse.data.registrations || [];

// फक्त current logged-in volunteer च्या registrations
const myRegistrations = allRegistrations.filter(
  (registration) =>
    registration.volunteerId === user.email
);

// Current volunteer ने join केलेले event IDs
const joinedEventIds = myRegistrations.map(
  (registration) => registration.eventId
);

// फक्त Joined + Completed certificates
const completedCertificates = myCertificates;

// Same event चे duplicate certificates काढणे
const uniqueCertificates =
  completedCertificates.filter(
    (certificate, index, self) =>
      index ===
      self.findIndex(
        (item) =>
          item.eventId?._id ===
          certificate.eventId?._id
      )
  );

console.log(
  "FINAL MY CERTIFICATES:",
  uniqueCertificates
);

setCertificates(uniqueCertificates);

    } catch (error) {

      console.error(
        "Error fetching certificates:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  fetchCertificates();

}, [user.email, user._id]);


  // Download Certificate
  const downloadCertificate = (certificate) => {

    const certificateElement = certificateRef.current;

    html2canvas(certificateElement, {
      scale: 2
    }).then((canvas) => {

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF(
        "landscape",
        "mm",
        "a4"
      );

      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        277,
        190
      );

      pdf.save(
        `${certificate.certificateNo || "Volunteer_Certificate"}.pdf`
      );

    });

  };


  // Loading
  if (loading) {

    return (
      <div className="certificates-page">

        <h2>Certificates</h2>

        <p>Loading certificates...</p>

      </div>
    );

  }


  // No certificates
  if (certificates.length === 0) {

    return (
      <div className="certificates-page">

        <h2>Certificates</h2>

        <div className="no-certificate">

          <h3>No Certificates Yet</h3>

          <p>
            Complete a volunteer event to receive your certificate.
          </p>

        </div>

      </div>
    );

  }


  return (

    <div className="certificates-page">

      <h2>My Certificates</h2>

      {certificates.map((certificate, index) => (

        <div
          key={certificate._id || index}
          className="certificate-card"
        >

          {/* Certificate Preview */}

          <div
            className="certificate-preview"
            ref={index === 0 ? certificateRef : null}
          >

            <div className="certificate-border">

              <h1>Certificate of Appreciation</h1>

              <p className="certificate-text">
                This certificate is proudly presented to
              </p>

              <h2>
                {user.name || "Volunteer"}
              </h2>

              <p className="certificate-text">
                for successfully participating as a volunteer
              </p>

              <h3>
                {certificate.eventId?.title || "Volunteer Event"}
              </h3>

              <p>
                Certificate No:
                <strong>
                  {" "}
                  {certificate.certificateNo}
                </strong>
              </p>

              <p>
                Date:{" "}
                {new Date(
                  certificate.issueDate
                ).toLocaleDateString("en-IN")}
              </p>

              <div className="certificate-footer">

                <span>
                  Volunteer Finder
                </span>

                <span>
                  Authorized Certificate
                </span>

              </div>

            </div>

          </div>


          {/* Download Button */}

          <button
            className="download-btn"
            onClick={() =>
              downloadCertificate(certificate)
            }
          >
            Download Certificate
          </button>

        </div>

      ))}

    </div>

  );

};

export default Certificates;