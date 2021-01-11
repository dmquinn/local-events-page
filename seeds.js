// const mongoose = require("mongoose");
// const Event = require("./models/event");

// mongoose.connect("mongodb://localhost:27017/streetMusic", {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
// 	console.log("Database connected");
// });

// const seedDB = async () => {
// 	await Event.deleteMany({});
// 	for (let i = 0; i < 7; i++) {
// 		const event = new Event({
// 			author: "5ff9f10b4ef1081f0c9a709b",
// 			location: ``,
// 			title: ``,
// 			image: "https://source.unsplash.com/collection/357786/160x90",
// 			description: "A big gig",
// 			price: 0.1,
// 		});
// 		await events.save();
// 	}
// };
// seedDB().then(() => {
// 	mongoose.connection.close();
// });
