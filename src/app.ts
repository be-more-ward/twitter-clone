import "express-async-errors"
import "dotenv/config"

import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

//Routers
import authRouter from "./routes/authRoutes"
import tweetsRouter from "./routes/tweetRoutes"
import refreshRouter from "./routes/refresh"

//Middlewares
import { notFound } from "./middleware/not-found"
import { errorHandler } from "./middleware/errorHandler"

app.get("/",(req,res)=>{
    res.send("test")
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/tweets", tweetsRouter)
app.use("/api/v1", refreshRouter)

app.use(notFound)
app.use(errorHandler)


export default app
// const port = process.env.PORT || 3000
// app.listen(port, ()=>{console.log("server 3000");
// })