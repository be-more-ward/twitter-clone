import "dotenv/config"
import "express-async-errors"
import express from "express"
const app = express()

app.use(express.json())


//Routers
import authRouter from "./routes/authRoutes"

//Middlewares
import { notFound } from "./middleware/not-found"

app.get("/",(req,res)=>{
    res.send("test")
})

app.use("/api/v1/auth", authRouter)

app.use(notFound)


const port = process.env.PORT || 3000
app.listen(port, ()=>{console.log("server 3000");
})