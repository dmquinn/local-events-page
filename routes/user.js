const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res, next) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			req.login(registeredUser, (err) => {
				if (err) return next(err);
			});
			res.redirect("/");
		} catch (e) {
			res.redirect("/register");
		}
	})
);
router.get("/login", (req, res) => {
	res.render("users/login");
});
router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/login",
	}),
	(req, res) => {
		const redirectUrl = req.session.returnTo || "/events";
		delete req.session.returnTo;
		res.redirect("/");
	}
);
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});
module.exports = router;
