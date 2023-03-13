import {Router} from "express";
import { createTweet, getAllTweets } from "../controller/tweet";
import auth from "../middleware/authentication";


const router = Router()

router.post("/", auth, createTweet)
router.get("/:username", getAllTweets)


export default router
