import {Router} from "express";
import { handleRefreshToken } from "../controller/refreshToken";

const router = Router()

router.get("/refresh", handleRefreshToken )


export default router