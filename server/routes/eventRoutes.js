const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getHomeStats,
} = require("../controllers/eventController");


// Create Event
router.post("/", createEvent);

// Get All Events
router.get("/", getEvents);

router.get("/home-stats", getHomeStats);

// Get Single Event
router.get("/:id", getEventById);

router.delete("/:id", deleteEvent);

router.put("/:id", updateEvent);


module.exports = router;