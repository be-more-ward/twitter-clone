import {Router} from "express";
import { createTweet, getAllTweets, getSingleTweet, likeTweet } from "../controller/tweet";
import { FollowUser,UnfollowUser } from "../controller/userFollow";
import auth from "../middleware/authentication";
import { validator } from "../middleware/validator";
import { tweetSchema } from "../validate/schemas";


const router = Router()

router.post("/:username", auth, validator(tweetSchema), createTweet)
router.get("/:username", getAllTweets)
router.get("/:username/status/:tweetId", getSingleTweet)
router.post("/likes/:tweetId", auth, likeTweet)

router.post("/follow/:followId", auth, FollowUser)
router.delete("/unfollow/:unfollowId", auth, UnfollowUser)


export default router
