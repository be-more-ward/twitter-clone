import { PrismaClient } from '@prisma/client'
import request from "supertest"
import app from "../src/app"

const prisma = new PrismaClient()

interface ITweet {
    id: string,
    content: string,
    authorId: string,
    parentId: string | null
}

//test users
const testUser1 = {username: "anna", email:"anna@gmail.com", password:"password"}
const testUser2 = {username: "john", email:"john@gmail.com", password:"password"}

let user1_token: string, user2_token:string

let testTweet: ITweet

beforeAll( async ()=>{

    await prisma.$connect()

    // register new user 
    await request(app).post("/api/v1/auth/register").send(testUser1)

    //login for the token
    const response = await request(app).post("/api/v1/auth/login").send( {email: testUser1.email, password: testUser1.password} )
    
    //setting the token for later tests
    user1_token = response.body.token
    
    console.log("user1 created");
    

    //register user2
    await request(app).post("/api/v1/auth/register").send(testUser2)

    // login user2
    const response2 = await request(app).post("/api/v1/auth/login").send( {email: testUser2.email, password: testUser2.password} )
    user2_token = response2.body.token
    
    //user2 create tweet
    const response3 = await request(app).post(`/api/v1/tweets/${testUser2.username}`)
    .set("Authorization", `Bearer ${user2_token}`)
    .send( {content: "hello earth"} )

    testTweet= response3.body
    
    console.log("user2 created with 1 tweet");
})

afterAll( async()=>{
    const deleteLikes = prisma.tweetLikes.deleteMany()
    const deleteTweets = prisma.tweet.deleteMany()
    const deleteUsers = prisma.user.deleteMany()

    await prisma.$transaction([
        deleteLikes,
        deleteTweets,
        deleteUsers
    ])

    await prisma.$disconnect()
})

describe("Tweet tests", ()=>{
    test("should return 200 when retrieving tweets of an existing user with no tweets", async ()=>{
        const response = await request(app).get(`/api/v1/tweets/${testUser1.username}`)
        
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual([])
    })

    test("should return 404 when retrieving tweets of a non-existing user", async ()=>{
        const response = await request(app).get("/api/v1/tweets/fakeUser")
        
        expect(response.status).toBe(404)
        expect(response.body.msg).toBe("The user does not exist")
    })

    test("should return 201 when creating a tweet with an existing user", async ()=>{
        const response = await request(app).post(`/api/v1/tweets/${testUser1.username}`)
        .set("Authorization", `Bearer ${user1_token}`)
        .send(
            { content: "hello world" }
        )
        
        expect(response.status).toBe(201)
        expect(response.body.content).toBe("hello world")
    })

    test("should return 201 when replying to another tweet", async ()=>{

        //reply to testTweet
        const response = await request(app).post(`/api/v1/tweets/${testUser1.username}`)
        .set("Authorization", `Bearer ${user1_token}`)
        .send({content: "my first reply", parentId: testTweet.id})

        expect(response.status).toBe(201)
        expect(response.body.content).toBe("my first reply")
        expect(response.body.parentId).toBe(testTweet.id)
    })

    test("should return 200 when retrieving an existing single tweet and comments", async ()=>{
        const response = await request(app).get(`/api/v1/tweets/${testUser2.username}/status/${testTweet.id}`)
        // console.log(response.body);
        
        expect(response.status).toBe(200)
        expect(response.body.content).toBe(testTweet.content)
        expect(response.body.authorId).toBe(testTweet.authorId)

        //check first comment content
        expect(response.body.comments[0].content).toBe("my first reply")
    })

    test("should return 200 when retrieving tweets of an existing user with tweets", async ()=>{
        const response = await request(app).get(`/api/v1/tweets/${testUser1.username}`)
        
        expect(response.status).toBe(200)
        expect(response.body[0].content).toBe("hello world")
    })

    test("should return 404 when retrieving a single tweet that does not exist", async ()=>{
        const fakeTweet = "1234abc555"
        const response = await request(app).get(`/api/v1/tweets/${testUser1.username}/status/${fakeTweet}`)

        expect(response.status).toBe(404)
        expect(response.body.msg).toBe(`Tweet with id: ${fakeTweet}, does not exist`)
    })

    test("should return 201 when user like a tweet", async ()=>{
        const response = await request(app).post(`/api/v1/tweets/likes/${testTweet.id}`)
        .set("Authorization", `Bearer ${user1_token}`)

        expect(response.status).toBe(201)
    })

    test("should return 404 when user like a non-existing tweet", async ()=>{
        const fakeTweet = "aaaa11122"
        const response = await request(app).post(`/api/v1/tweets/likes/${fakeTweet}`)
        .set("Authorization", `Bearer ${user1_token}`)

        expect(response.status).toBe(404)
        expect(response.body.msg).toBe(`Tweet with id: ${fakeTweet}, does not exist`)
    })
})