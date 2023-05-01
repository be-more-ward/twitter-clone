import {Router} from "express"
import { register, login, logout } from "../controller/auth";
import { validator } from "../middleware/validator";
import { registerSchema, loginSchema } from "../validate/schemas";
import auth from "../middleware/authentication";

const router = Router()

router.post("/register", validator(registerSchema), register)
router.post("/login", validator(loginSchema), login)
router.delete("/logout", auth, logout)

export default router