import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../error/AppError";

export const validator = (schema: Joi.ObjectSchema) => async (req:Request, res:Response, next:NextFunction) => {
    try {
        
        await schema.validateAsync(req.body)
        next()

    } catch (error) {

        if (error instanceof Error){
            throw new AppError({message:error.message, httpCode: StatusCodes.BAD_REQUEST})
        }
    }    
}