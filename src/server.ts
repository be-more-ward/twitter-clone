import { PrismaClient } from '@prisma/client'
import app from "./app"

const prisma = new PrismaClient()

const port = 3000

const start = async () =>{
    try {
        // connect to DB
        await prisma.$connect()
        app.listen(port, ()=>{
            console.log("server listening, port 3000");
        })

    } catch (error) {
        console.log(error);
    }
}

start()