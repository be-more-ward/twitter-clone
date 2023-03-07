import "dotenv/config"
import express from "express"
const app = express()

app.use(express.json())


//Routers
import authRouter from "./routes/authRoutes"

app.get("/",(req,res)=>{
    res.send("test")
})

app.use("/api/v1/auth", authRouter)


const port = process.env.PORT || 3000
app.listen(port, ()=>{console.log("server 3000");
})