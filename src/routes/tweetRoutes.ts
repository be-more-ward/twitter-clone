import {Router} from "express";
import { createTweet } from "../controller/tweet";
import auth from "../middleware/authentication";


const router = Router()

router.post("/", auth, createTweet)


export default router
