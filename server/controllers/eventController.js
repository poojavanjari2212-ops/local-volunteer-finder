const Event = require("../models/Event");

const Registration = require("../models/Registration");
const Certificate = require("../models/Certificate");

// Create Event
const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get All Events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Single Event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    res.status(200).json(event);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // If event is completed, generate certificates
    if (event.status === "Completed") {

      const registrations = await Registration.find({
        eventId: event._id,
      });

      for (const registration of registrations) {

        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
          volunteerId: registration.volunteerId,
          eventId: event._id,
        });

        if (!existingCertificate) {

          await Certificate.create({
            volunteerId: registration.volunteerId,
            eventId: event._id,
            certificateNo:
              "CERT-" + Date.now() + "-" +
              Math.floor(Math.random() * 1000),
          });

        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Event Updated Successfully",
      event,
    });

  } catch (error) {

    console.log("UPDATE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Event Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// =====================================================
// HOME PAGE STATS
// =====================================================

const getHomeStats = async (req, res) => {
  try {
    // Total Events
    const totalEvents = await Event.countDocuments();

// Total Registered Volunteers
const volunteerIds = await Registration.distinct("volunteerId");

const totalVolunteers = volunteerIds.filter(
  (id) => id !== null && id !== undefined && id !== ""
).length;

    // Get all events for cities
    const events = await Event.find({}, "location");

    // Unique Cities
    const uniqueCities = new Set(
      events
        .map((event) => event.location?.trim())
        .filter(Boolean)
    );

    const totalCities = uniqueCities.size;

    res.status(200).json({
      success: true,
      totalEvents,
      totalVolunteers,
      totalCities,
    });

  } catch (error) {
    console.log("HOME STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getHomeStats,
};