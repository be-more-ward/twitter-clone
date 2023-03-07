import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { hashPassword } from '../utils/bcrypt'

const prisma = new PrismaClient()

interface IUserData {
    email:string,
    username:string,
    password:string
}

export const register =async(req: Request, res:Response)=>{
    const {email, username, password} = req.body

    const duplicateUser = await prisma.user.findFirst({where:{OR:{email, username}}})
    if (duplicateUser){
        throw new Error("Username or Email already in use.")
    }
    const hashedPassword = await hashPassword(password)
    const userData:IUserData = {email, username, password: hashedPassword}

    const user = await prisma.user.create({
        data:userData
    })

    res.status(201).json(user)
}

export const login =async()=>{

}