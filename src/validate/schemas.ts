import Joi from "joi"

export const registerSchema = Joi.object({
    username: Joi.string().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(50).required()
})

export const loginSchema = Joi.object({
    username: Joi.string().min(4).max(20).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(5).max(50).required()
})

export const tweetSchema = Joi.object({
    content: Joi.string().min(1).max(240).required(),
    parentId: Joi.string().guid().optional().length(36)
})