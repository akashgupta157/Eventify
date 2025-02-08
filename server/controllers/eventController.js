const Event = require("../models/event");

const createEvent = async (req, res) => {
  try {
    const { name, category, description, date, time, location, image } =
      req.body;
    const event = new Event({
      name,
      category,
      description,
      date,
      time,
      location,
      image,
      createdBy: req.user,
    });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getAllEvents = async (req, res) => {
  try {
    const { category, date } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    } else {
      filter.date = { $gte: new Date() };
    }

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .populate("createdBy", "name email");

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");
    if (!event) throw new Error("Event not found");
    res.json(event);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
const addAttendee = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "attendees",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.attendees.some(
        (attendee) => attendee._id.toString() === req.user.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event" });
    }

    event.attendees.push(req.user);
    await event.save();

    const updatedEvent = await Event.findById(req.params.id).populate(
      "attendees",
      "name email"
    );

    req.io.emit("attendeeUpdated", {
      eventId: updatedEvent._id,
      attendees: updatedEvent.attendees,
    });

    res
      .status(200)
      .json({ message: "Attendee added successfully", event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createEvent, getAllEvents, getEventById, addAttendee };
