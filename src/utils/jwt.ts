import jwt from "jsonwebtoken"
import { Response } from "express"

export interface IUserDetailsJWT {
    userId: string,
    username: string
}

export const createToken = (payload:IUserDetailsJWT, expireTime:string)=>{
    const token = jwt.sign(payload, String(process.env.JWT_SECRET), {expiresIn:expireTime})
    return token
}

export const isTokenValid=(token:string)=>{
    return jwt.verify(token, String(process.env.JWT_SECRET))
}

export const attachCookiesToResponse = (res:Response, refreshToken:string)=> {
    // max age 24hs - maxAge:24 * 60 * 60 * 1000
    res.cookie("refreshToken", refreshToken, {httpOnly:true, maxAge:60* 1000}) //dont include 'secure' for testing
}