import {Router} from "express"
import { register, login } from "../controller/auth";
import { validator } from "../middleware/validator";
import { registerSchema, loginSchema } from "../validate/schemas";

const router = Router()

router.post("/register", validator(registerSchema), register)
router.post("/login", validator(loginSchema), login)

export default router