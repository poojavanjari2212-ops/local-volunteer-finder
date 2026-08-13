const express = require("express");
const router = express.Router();

const {
  registerForEvent,
  getRegistrations,
  completeRegistration,
} = require("../controllers/registrationController");

// Join Event
router.post("/", registerForEvent);

// Get All Registrations
router.get("/", getRegistrations);

// Complete ONE volunteer
router.put("/:id/complete", completeRegistration);

module.exports = router;