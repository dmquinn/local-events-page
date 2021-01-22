const express = require("express");
const router = express.Router();
const { storage } = require("../cloudinary");
const catchAsync = require("../utilities/catchAsync");
const { eventSchema } = require("../schemas.js");
const ExpressError = require("../utilities/expressError");
const Event = require("../models/event");
const { isLoggedIn, isAuthor, validateEvent } = require("../middleware");
const multer = require("multer");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
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
	upload.single("image"),
	// validateEvent,
	catchAsync(async (req, res, next) => {
		const geoData = await geoCoder
			.forwardGeocode({
				query: req.body.event.location,
				limit: 1,
			})
			.send();
		const event = new Event(req.body.event);
		event.geometry = geoData.body.features[0].geometry;
		event.images.url = req.file.path;
		event.author = req.user._id;
		await event.save();
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
