import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/bcrypt'

const prisma = new PrismaClient()

async function main() {
    const user1 = await prisma.user.upsert({
        where: {
            email: "anna@gmail.com"
        },
        update:{},
        create: {
            email: "anna@gmail.com",
            username: "anna",
            password: await hashPassword("password"),
            tweets:{
                create: [
                    { content: "first tweet" },
                ]
            }
        },
    })

    const user2 = await prisma.user.upsert({
        where: {
            email: "john@gmail.com"
        },
        update:{},
        create: {
            email: "john@gmail.com",
            username: "john",
            password: await hashPassword("password"),
            tweets:{
                create: [
                    { content: "hello world" },
                    { content: "hello earth" },
                ]
            }
        },
    })
    
    const tweetAnna = await prisma.tweet.create({
        data:{
            content:"hello",
            author: {
                connect:{ id: user1.id}
            }
        }
    })

    // reply from john
    const reply = await prisma.tweet.create({
        data:{
            content:"hello anna",
            parent:{
                connect: { id: tweetAnna.id}
            },
            author: {
                connect:{ id: user2.id}
            }
        }
    })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })