const Certificate = require("../models/Certificate");
const Event = require("../models/Event");

// Create Certificate
exports.createCertificate = async (req, res) => {
  try {
    const {
      volunteerId,
      eventId,
      certificateNo
    } = req.body;

    // Find event
    const event = await Event.findById(eventId);

    // Event not found
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    // Certificate only after event is completed
    if (event.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message:
          "Certificate can be generated only after event is completed."
      });
    }

    // Create certificate
    const certificate = await Certificate.create({
      volunteerId,
      eventId,
      certificateNo
    });

    res.status(201).json({
      success: true,
      message: "Certificate created successfully.",
      certificate
    });

  } catch (err) {

    console.log("CERTIFICATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// Get All Certificates
// Get All Certificates
exports.getCertificates = async (req, res) => {
  try {

    const certificates = await Certificate.find()
      .populate("eventId");

    res.status(200).json({
      success: true,
      certificates
    });

  } catch (err) {

    console.log("GET CERTIFICATE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// Delete All Certificates
exports.deleteAllCertificates = async (req, res) => {
  try {
    await Certificate.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All certificates deleted successfully."
    });

  } catch (err) {
    console.log("DELETE CERTIFICATES ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};