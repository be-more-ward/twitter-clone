import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { comparePasswords, hashPassword } from '../utils/bcrypt'
import { createToken, attachCookiesToResponse } from '../utils/jwt'

import { AppError } from '../error/AppError'
import { StatusCodes } from 'http-status-codes'

const prisma = new PrismaClient()

interface IUserData {
    email:string,
    username:string,
    password:string
}

export const register =async(req: Request, res:Response)=>{
    const {email, username, password} = req.body
    
    const userAlreadyExist = await prisma.user.findFirst({
        where:{
            OR:[{email}, {username}]
        }
    })
    
    if (userAlreadyExist){
        throw new AppError({message:"Username or Email already in use", httpCode: StatusCodes.BAD_REQUEST})
    }

    const hashedPassword = await hashPassword(password)
    const userData:IUserData = {email, username, password: hashedPassword}

    const user = await prisma.user.create({
        data:userData
    })

    res.status(201).json(user)
}

export const login = async (req: Request, res:Response)=>{
    const {username, email, password} = req.body
    
    if (!username && !email){
        throw new AppError({message: "Please provide username or email", httpCode: StatusCodes.BAD_REQUEST})
    }
    
    if (!password) throw new AppError({message:"Password is required", httpCode: StatusCodes.BAD_REQUEST})

    //Login with username or email
    const user = await prisma.user.findFirst({
        where:{
            OR:[ {email},{username} ]
        }
    })
    // if no user found, throw error
    // if (!user)  throw new Error("credentials are invalid")
    if (!user)  throw new AppError({message:"credentials are invalid", httpCode: StatusCodes.NOT_FOUND})
    
    const isPasswordCorrect = await comparePasswords(password, user.password)
    if (!isPasswordCorrect) {
        throw new AppError({message:"credentials are invalid", httpCode: StatusCodes.UNAUTHORIZED })
    }
    
    // create jwts
    const accessToken = createToken({ userId:user.id, username:user.username },"30s")
    const refreshToken = createToken({ userId:user.id, username:user.username }, "60s")

    //attach refresh token to cookies
    attachCookiesToResponse(res, refreshToken)

    // save refreshToken with user
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken: refreshToken
        }
    })
    
    // response with username  and access token
    res.status(200).json({user:user.username, accessToken})  
}

export const logout = async (req:Request, res:Response) =>{
    const cookies = req.cookies

    if (!cookies?.refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT)
    
    const refreshToken = cookies.refreshToken
    
    const user = await prisma.user.findFirst({
        where:{
            refreshToken: refreshToken
        }
    })

    // cookies went send but no match with refreshToken in db
    if (!user){
        res.clearCookie("refreshToken", {httpOnly:true, maxAge:60* 1000})
        return res.sendStatus(StatusCodes.NO_CONTENT)
    }

    // delete refreshToken from user in db
    await prisma.user.update({
        where:{
            id: req.user.userId
        },
        data:{
            refreshToken: ""
        }
    })
    
    res.clearCookie("refreshToken", {httpOnly:true, maxAge: 60*1000 })
    res.sendStatus(StatusCodes.NO_CONTENT)
}