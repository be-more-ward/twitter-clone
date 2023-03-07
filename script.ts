import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // const user = await prisma.user.createMany({
  //   data:[
  //     {username:"john",email:"john@gmail.com",password:"password"},
  //     {username:"anna",email:"anna@gmail.com",password:"password"},
  //   ]
  // })

  // create comment to "authorId=1" and "PostOwner=1"
  // const tweet = await prisma.tweet.create({
  //   data:{
  //     content:"first comment response",
  //     author:{connect:{id:"e8fbe556-cff4-4c5a-9c37-a457f215b70f"}},
  //     parent:{connect:{id:"e8acb963-f069-4b6b-8b5e-89935258b7c5"}}
  //   }
  // })
  // console.log(tweet)


  // const users = await prisma.user.findMany({
  //   include:{posts:true, comments:true}
  // })
  // console.dir(users,{depth:null});

  // const posts = await prisma.post.findMany({include:{CommentsInPost:true,author:true}})
  // console.dir(posts,{depth:null});

  const users = await prisma.user.findMany()
  console.dir(users,{depth:null});
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