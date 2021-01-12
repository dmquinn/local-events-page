const express = require("express");
const router = express.Router({ mergeParams: true });
const {
	// validateComment,
	isLoggedIn,
	isCommentAuthor,
} = require("../middleware");
const Event = require("../models/event");
const Comment = require("../models/comments");
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");

router.post(
	"/",
	isLoggedIn,
	// validateComment,
	catchAsync(async (req, res) => {
		const event = await Event.findById(req.params.id);
		const comment = new Comment(req.body.comment);
		console.log("req.body.comment", req.body.comment);
		comment.author = req.user._id;
		event.comments.push(comment);
		await comment.save();
		await event.save();
		res.redirect(`/events/${event._id}`);
	})
);

router.delete(
	"/:commentId",
	isLoggedIn,
	isCommentAuthor,
	catchAsync(async (req, res) => {
		const { id, commentId } = req.params;
		await Event.findByIdAndUpdate(id, {
			$pull: { comments: commentId },
		});
		await Comment.findByIdAndDelete(commentId);

		res.redirect(`/events/${id}`);
	})
);

module.exports = router;
