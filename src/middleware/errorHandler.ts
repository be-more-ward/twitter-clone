import { NextFunction, Request, Response } from "express";
import { AppError } from "../error/AppError";

export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction)=>{

    if (err instanceof AppError){
        console.log(err.stack);
        
        return res.status(err.httpCode).json({msg:err.message})
    }

    console.log(err);
    return res.status(500).json({msg:`Internal server error`})
}