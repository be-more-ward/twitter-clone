import {Router} from "express";
import { createTweet, getAllTweets, getSingleTweet } from "../controller/tweet";
import auth from "../middleware/authentication";


const router = Router()

router.post("/:username", auth, createTweet)
router.get("/:username", getAllTweets)
router.get("/:username/status/:tweetId", getSingleTweet)


export default router
