import { NextFunction, Request, Response } from "express";;
import { isTokenValid, IUserDetailsJWT } from "../utils/jwt";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../error/AppError";

const auth = (req:Request, res:Response, next:NextFunction)=>{
    const authHeaders = req.headers.authorization
    
    if (!authHeaders || !authHeaders.startsWith("Bearer ")){
        throw new AppError({message:"Invalid Authentication", httpCode: StatusCodes.UNAUTHORIZED})
    }
    
    const token = authHeaders!.split(" ")[1]

    try {
        const {userId, username} = <IUserDetailsJWT>isTokenValid(token)
        req.user = {userId, username}
        next()

    } catch (error) {
        if(error instanceof Error){
            throw new AppError({message: error.message, httpCode: StatusCodes.UNAUTHORIZED})
        //     throw new Error(error.message)
        }
    }
}

export default auth