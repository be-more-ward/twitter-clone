import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { comparePasswords, hashPassword } from '../utils/bcrypt'
import { createToken } from '../utils/jwt'

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
    
    // create jwt
    const token = createToken({ userId:user.id, username:user.username })
    
    // response with username  and token
    res.status(200).json({user:user.username, token})
        
    }