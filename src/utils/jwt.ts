import jwt from "jsonwebtoken"

interface IUserDetailsJWT {
    userId: string,
    username: string
}

export const createToken = (payload:IUserDetailsJWT)=>{
    const token = jwt.sign(payload, String(process.env.JWT_SECRET))
    return token
}

export const isTokenValid=(token:string)=>{
    return jwt.verify(token, String(process.env.JWT_SECRET))
}