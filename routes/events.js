const express = require("express");
const router = express.Router();
const { storage } = require("../cloudinary");
const catchAsync = require("../utilities/catchAsync");
const { eventSchema } = require("../schemas.js");
const ExpressError = require("../utilities/expressError");
const Event = require("../models/event");
const { isLoggedIn, isAuthor, validateEvent } = require("../middleware");
const multer = require("multer");

const upload = multer({ storage });

router.get(
	"/",
	catchAsync(async (req, res) => {
		const events = await Event.find({});
		res.render("events/allEvents", { events });
	})
);

router.get("/new", isLoggedIn, (req, res) => {
	res.render("events/new");
});
router.post(
	"/",
	isLoggedIn,
	upload.array("image"),

	// validateEvent,
	catchAsync(async (req, res, next) => {
		const event = new Event(req.body.event);
		event.images = req.files.map((f) => ({
			url: f.path,
			filename: f.filename,
		}));
		event.author = req.user._id;
		console.log("eventWhat?", event);
		await event.save();
		// req.flash("success", "Successfully made a new campground!");
		res.redirect(`/events/${event._id}`);
	})
);

router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const event = await Event.findById(req.params.id)
			.populate({
				path: "comments",
				populate: {
					path: "author",
				},
			})
			.populate("author");
		console.log("event", event);
		if (!event) {
			// req.flash("error", "Cannot find that event!");
			return res.redirect("/events");
		}
		res.render("events/show", { event });
	})
);
router.delete(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Event.findByIdAndDelete(id);
		res.redirect("/events");
	})
);

module.exports = router;
