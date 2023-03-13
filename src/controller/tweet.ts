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

export const getAllTweets = async (req: Request, res:Response) => {
    const {username} = req.params

    const user = await prisma.user.findFirst({
        where: {username}
    })

    if (!user){
        throw new Error("The user does not exist")
    }

    // get all tweets that user posted but not the comments on other tweets
    const tweets = await prisma.tweet.findMany({
        where:{
            authorId: user.id,
            parent: null
        }
    })

    res.status(200).json(tweets)
}

export const getSingleTweet = async (req: Request, res:Response) => {
    const {tweetId} = req.params

    const tweet = await prisma.tweet.findFirst({
        where:{
            id: tweetId
        }
    })
    
    if (!tweet){
        throw new Error(`Tweet with id: ${tweetId}, does not exist`)
    }

    res.status(200).json(tweet)
}