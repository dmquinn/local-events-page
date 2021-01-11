const joi = require("joi");

module.exportsschema = joi.object({
	event: joi
		.object({
			date: joi.string().required(),
			title: joi.string().required(),
			type: joi.string().required(),
			price: joi.number().required().min(0),
			// image: joi.string(),
			location: joi.string().required(),
			description: joi.string().required(),
		})
		.required(),
});
module.exports.commentsSchema = joi.object({
	comment: joi
		.object({
			body: joi.string().required(),
		})
		.required(),
});
