import { Prisma, PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../error/AppError"

const prisma = new PrismaClient()

export const FollowUser = async (req: Request, res:Response)=>{
    const {userId} = req.user
    const {followId} = req.params
  
    const userToFollowExist = await prisma.user.findFirst({
        where:{
            id: followId
        }
    })

    if (!userToFollowExist){
        throw new AppError({message:`The user does not exist`, httpCode: StatusCodes.NOT_FOUND})
    }

    const following = await prisma.followUser.create({
        data:{
            author:{
                connect:{id: userId}
            },
            followUser:{
                connect:{id: followId}
            }
        }
    })

    res.status(StatusCodes.CREATED).json(following)
}

export const UnfollowUser = async (req: Request, res:Response)=>{
    const {userId} = req.user
    const {unfollowId} = req.params

    const userToUnfollowExist = await prisma.user.findFirst({
        where:{
            id: unfollowId
        }
    })

    if (!userToUnfollowExist){
        throw new AppError({message:"The user does not exist", httpCode:StatusCodes.NOT_FOUND})
    }

    await prisma.followUser.deleteMany({
        where:{
            AND:[ {authorId: userId}, {followUserId: unfollowId} ]
        }
    })


    res.status(StatusCodes.NO_CONTENT).send()
}
