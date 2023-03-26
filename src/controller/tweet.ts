import { Prisma, PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../error/AppError"

const prisma = new PrismaClient()

export const createTweet = async (req: Request, res:Response)=>{
    const { content, parentId } = req.body
    const { userId } = req.user
   
    // Create args for new tweet
    const newTweet: Prisma.TweetCreateArgs = {
        data:{
            content: content,
            author: {connect:{id:userId}}
        }
    }
    
    // if it's a reply tweet(comment), attach the parent-tweetId to the 'newTweet' 
    if (parentId){
        newTweet.data.parent = {
            connect:{id:parentId}
        }
    }

    const tweet = await prisma.tweet.create(newTweet)

    res.status(201).json(tweet)
}

export const getAllTweets = async (req: Request, res:Response) => {
    const {username} = req.params

    const user = await prisma.user.findFirst({
        where: {username}
    })

    if (!user){
        throw new AppError({message:"The user does not exist", httpCode: StatusCodes.NOT_FOUND})
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
        throw new AppError({message:`Tweet with id: ${tweetId}, does not exist`, httpCode: StatusCodes.NOT_FOUND})
    }

    res.status(200).json(tweet)
}

export const likeTweet = async (req: Request, res:Response) =>{
    const {tweetId} = req.params
    const {userId} = req.user

    console.log(tweetId, userId);
    

    const tweet = await prisma.tweet.findFirst({
        where:{
            id: tweetId
        }
    })

    if (!tweet) {
        throw new AppError({message:`Tweet with id: ${tweetId}, does not exist`, httpCode: StatusCodes.NOT_FOUND})
    }

    const likedTweet = await prisma.tweetLikes.create({
        data:{
            author: {
                connect: {id: userId}
            },
            tweet: {
                connect: {id: tweetId}
            }
        }
    })

    res.status(201).send()
}