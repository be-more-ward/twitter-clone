import {Router} from "express";
import { createTweet, getAllTweets, getSingleTweet } from "../controller/tweet";
import auth from "../middleware/authentication";
import { validator } from "../middleware/validator";
import { tweetSchema } from "../validate/schemas";


const router = Router()

router.post("/:username", auth, validator(tweetSchema), createTweet)
router.get("/:username", getAllTweets)
router.get("/:username/status/:tweetId", getSingleTweet)


export default router
