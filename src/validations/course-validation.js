import Joi from "joi";

export const courseValidation = Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
        "string.base": "Title should be a string",
        "string.min": "Title should have at least 3 characters",
        "string.max": "Title should not exceed 255 characters",
        "any.required": "Title is required"
    }),
    description: Joi.string().min(5).max(1000).optional().messages({
        "string.base": "Description should be a string",
        "string.min": "Description should have at least 5 characters",
        "string.max": "Description should not exceed 1000 characters"
    }),
});
