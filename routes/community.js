const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const { eventSchema } = require("../schemas.js");
const ExpressError = require("../utilities/expressError");
const Event = require("../models/event");
const { isLoggedIn, isAuthor, validateEvent } = require("../middleware");
const multer = require("multer");

router.route("/community").get(
	catchAsync(async (req, res) => {
		// const id = req.user._id;
		const users = await User.find({});
		res.render("community", { users });
	})
);
router.route("/:id").get(
	catchAsync(async (req, res) => {
		const user = await User.findById(req.params.id);
		const events = await Event.find({});
		res.render("userpage", { user, events });
	})
);

module.exports = router;
