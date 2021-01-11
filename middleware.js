const { eventSchema, commentSchema } = require("./schemas.js");
const ExpressError = require("./utilities/ExpressError");
const Event = require("./models/event");
const Comment = require("./models/comments");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		return res.redirect("/login");
	}
	next();
};

module.exports.validateEvent = (req, res, next) => {
	const { error } = eventSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const event = await Event.findById(id);
	if (!event.author.equals(req.user._id)) {
		// req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/events/${id}`);
	}
	next();
};

module.exports.isCurrentUser = async (req, res, next) => {
	const { id } = req.params;
	const event = await Event.findById(id);
	if (!event.author.equals(req.user._id)) {
		// req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/events/${id}`);
	}
	next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
	const { id, commentId } = req.params;
	const comment = await Comment.findById(commentId);
	if (!comment.author.equals(req.user._id)) {
		// req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/events/${id}`);
	}
	next();
};

module.exports.validateComment = (req, res, next) => {
	const { error } = commentSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
