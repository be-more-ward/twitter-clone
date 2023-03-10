import { NextFunction, Request, Response } from "express";;
import { isTokenValid, IUserDetailsJWT } from "../utils/jwt";

const auth = (req:Request, res:Response, next:NextFunction)=>{
    const authHeaders = req.headers.authorization
    
    if (!authHeaders || !authHeaders.startsWith("Bearer ")){
        throw new Error("Invalid Authentication - auth mdw")
    }
    
    const token = authHeaders!.split(" ")[1]

    try {
        const {userId, username} = <IUserDetailsJWT>isTokenValid(token)
        req.user = {userId, username}
        next()

    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }
    }
}

export default auth