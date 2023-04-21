import { PrismaClient } from '@prisma/client'
import request from "supertest"
import app from "../src/app"

import { hashPassword } from '../src/utils/bcrypt'

const prisma = new PrismaClient()

const testUser1 = {username: "anna", email:"anna@gmail.com", password:"password"}
const testUser2 = {username: "john", email:"john@gmail.com", password:"password"}

let user1_token:string, user2_token:string

interface IUser {
    id:string,
    username:string,
    email:string,
    password:string
}

let user1:IUser


beforeAll( async ()=>{
    await prisma.$connect()

    // create new user1
    // use this method to get ID of user
    user1 = await prisma.user.create({
        data:{
            username: testUser1.username,
            email: testUser1.email,
            password: await hashPassword(testUser1.password)
        }
    })
    
    console.log("user1 created");

    //new user2 registration
    await request(app).post("/api/v1/auth/register").send(testUser2)

    //login new user2
    const response2 = await request(app).post("/api/v1/auth/login").send( {email: testUser2.email, password: testUser2.password} )
    user2_token = response2.body.token

    console.log("user2 created");
})

afterAll(async()=>{
    const deleteFollows = prisma.followUser.deleteMany()
    const deleteUsers = prisma.user.deleteMany()

    await prisma.$transaction([
        deleteFollows,
        deleteUsers
    ])

    await prisma.$disconnect()
})


describe("User follow tests", ()=>{
    test("should return 200 when following an existing user", async ()=>{

        //user2 follow user1
        const response = await request(app).post(`/api/v1/tweets/follow/${user1.id}`)
        .set("Authorization", `Bearer ${user2_token}`)

        expect(response.status).toBe(201)
        expect(response.body.followUserId).toBe(user1.id)
    })

    test("should return 404 when following an non-existing user", async ()=>{
        const fakeUserId= "AGASGEWE12415555"
        const response = await request(app).post(`/api/v1/tweets/follow/${fakeUserId}`)
        .set("Authorization", `Bearer ${user2_token}`)

        expect(response.status).toBe(404)
        expect(response.body.msg).toBe("The user does not exist")
    })

    test("should return 401 when following an existing user without authorization", async ()=>{
        const response = await request(app).post(`/api/v1/tweets/follow/${user1.id}`)

        expect(response.status).toBe(401)
        expect(response.body.msg).toBe("Invalid Authentication")
    })

    test("should return 401 when following a non-existing user without authorization", async ()=>{
        const fakeUserId= "AGASGEWE12415555"
        const response = await request(app).post(`/api/v1/tweets/follow/${fakeUserId}`)

        expect(response.status).toBe(401)
        expect(response.body.msg).toBe("Invalid Authentication")
    })
})