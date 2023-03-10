import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

const prisma = new PrismaClient()

export const createTweet = async (req: Request, res:Response)=>{
    const { content } = req.body
    const { userId } = req.user
   
    const tweet = await prisma.tweet.create({
        data: {
            content: content,
            author: {connect:{id: userId}}
        }
    })
    
    res.status(201).json(tweet)
}

