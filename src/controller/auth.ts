import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { comparePasswords, hashPassword } from '../utils/bcrypt'
import { createToken } from '../utils/jwt'

const prisma = new PrismaClient()

interface IUserData {
    email:string,
    username:string,
    password:string
}

export const register =async(req: Request, res:Response)=>{
    const {email, username, password} = req.body

    const userAlreadyExist = await prisma.user.findFirst({where:{OR:{email, username}}})
    if (userAlreadyExist){
        throw new Error("Username or Email already in use.")
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
        throw new Error("Please provide username or email")
    }
    
    if (!password) throw new Error("Password is required")

    //Login with username or email
    const user = await prisma.user.findFirst({
        where:{
            OR:[ {email},{username} ]
        }
    })
    // if no user found, throw error
    if (!user)  throw new Error("credentials are invalid")
    
    const isPasswordCorrect = await comparePasswords(password, user.password)
    if (!isPasswordCorrect) {
        throw new Error("credentials are invalid")
    }
    
    // create jwt
    const token = createToken({ userId:user.id, username:user.username })
    
    // response with username  and token
    res.status(200).json({user:user.username, token})
        
    }