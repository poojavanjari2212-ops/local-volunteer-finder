const Registration = require("../models/Registration");
const Certificate = require("../models/Certificate");

// =====================================================
// JOIN EVENT
// =====================================================

const registerForEvent = async (req, res) => {
  try {
    const {
      volunteerId,
      volunteerName,
      eventId,
      eventTitle,
    } = req.body;

    if (!volunteerId || !eventId || !eventTitle) {
      return res.status(400).json({
        success: false,
        message: "Volunteer and event information is required.",
      });
    }

    // Check duplicate registration
    const existingRegistration =
      await Registration.findOne({
        volunteerId: volunteerId.trim().toLowerCase(),
        eventId,
      });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this event.",
      });
    }

    // Create registration
    const registration =
      await Registration.create({
        volunteerId:
          volunteerId.trim().toLowerCase(),

        volunteerName,

        eventId,

        eventTitle,

        status: "Joined",
      });

    return res.status(201).json({
      success: true,
      message: "Event joined successfully.",
      registration,
    });

  } catch (error) {
    console.log(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL REGISTRATIONS
// =====================================================

const getRegistrations = async (req, res) => {
  try {

    const registrations =
      await Registration.find()
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      registrations,
    });

  } catch (error) {

    console.log(
      "GET REGISTRATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// COMPLETE ONE VOLUNTEER
// =====================================================

const completeRegistration = async (
  req,
  res
) => {

  try {

    // -----------------------------------------
    // Find registration
    // -----------------------------------------

    const registration =
      await Registration.findById(
        req.params.id
      );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found.",
      });
    }


    // -----------------------------------------
    // Already completed?
    // -----------------------------------------

    if (
      registration.status ===
      "Completed"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Volunteer has already completed this event.",
      });

    }


    // -----------------------------------------
    // Complete THIS volunteer only
    // -----------------------------------------

    registration.status =
      "Completed";

    await registration.save();


    // -----------------------------------------
    // Check certificate for THIS volunteer
    // -----------------------------------------

    const existingCertificate =
      await Certificate.findOne({
        volunteerId:
          registration.volunteerId,

        eventId:
          registration.eventId,
      });


    // -----------------------------------------
    // Create certificate for THIS volunteer
    // -----------------------------------------

    if (!existingCertificate) {

      await Certificate.create({

        volunteerId:
          registration.volunteerId,

        eventId:
          registration.eventId,

        certificateNo:
          "CERT-" +
          Date.now() +
          "-" +
          Math.floor(
            Math.random() * 10000
          ),
      });

      console.log(
        "CERTIFICATE CREATED FOR:",
        registration.volunteerId
      );

    } else {

      console.log(
        "CERTIFICATE ALREADY EXISTS FOR:",
        registration.volunteerId
      );

    }


    // -----------------------------------------
    // Check event completion status
    // -----------------------------------------

    const eventRegistrations =
      await Registration.find({
        eventId:
          registration.eventId,
      });

    const totalVolunteers =
      eventRegistrations.length;

    const completedVolunteers =
      eventRegistrations.filter(
        (item) =>
          item.status ===
          "Completed"
      ).length;


    const eventCompleted =
      totalVolunteers > 0 &&
      completedVolunteers ===
        totalVolunteers;


    // -----------------------------------------
    // Response
    // -----------------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Volunteer completed successfully.",

      registration,

      eventStatus:
        eventCompleted
          ? "Completed"
          : "Joined",

      totalVolunteers,

      completedVolunteers,
    });

  } catch (error) {

    console.log(
      "COMPLETE REGISTRATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerForEvent,
  getRegistrations,
  completeRegistration,
};