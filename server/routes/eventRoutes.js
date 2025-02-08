const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventById,
  addAttendee,
} = require("../controllers/eventController");
const router = express.Router();
router.post("/", authMiddleware, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/:id/register", authMiddleware, addAttendee);
module.exports = router;