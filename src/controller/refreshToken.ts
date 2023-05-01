import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

import { AppError } from '../error/AppError'
import { StatusCodes } from 'http-status-codes'
import { IUserDetailsJWT, createToken, isTokenValid } from '../utils/jwt'

const prisma = new PrismaClient()

export const handleRefreshToken = async (req:Request, res:Response)=>{
    const cookies = req.cookies

    if(!cookies?.refreshToken) return res.sendStatus(StatusCodes.UNAUTHORIZED)

    const refreshToken = cookies.refreshTokens

    //find user with refresh token
    const user = await prisma.user.findFirst({
        where:{
            refreshToken: refreshToken
        }
    })

    if (!user) return res.sendStatus(StatusCodes.FORBIDDEN)
    
    try {
        //check if refresh token is valid
        const payload = <IUserDetailsJWT>isTokenValid(refreshToken)        
        if (payload.username !== user.username) return res.sendStatus(403)

        const accessToken = createToken({userId:user.id, username:user.username}, "30s")
    
        res.json({ accessToken })

    } catch (error) {
        if(error instanceof Error){
            throw new AppError({message: error.message, httpCode: StatusCodes.FORBIDDEN})
        }
    }
}