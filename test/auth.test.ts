import { PrismaClient } from '@prisma/client'
import request from "supertest"
import app from "../src/app"

import { hashPassword } from '../src/utils/bcrypt'

const prisma = new PrismaClient()

beforeAll( async ()=>{
    await prisma.$connect()

    //new user for test in login
    const user =await prisma.user.create({
        data:{
            username: "john",
            email: "john@gmail.com",
            password: await hashPassword("password")
        }
    })
    
    console.log("new user created");
})

afterAll(async()=>{
    const deleteUsers = await prisma.user.deleteMany()
    await prisma.$disconnect()
})

describe("Register tests", ()=>{ 

    test("should create a new user with valid data", async ()=>{
        const response = await request(app).post("/api/v1/auth/register").send(
            {
                username: "anna",
                email:"anna@gmail.com",
                password: "password"
            }
        )

        expect(response.status).toBe(201)
    })

    test("should return 400, user already sign up", async ()=>{
        const response = await request(app).post("/api/v1/auth/register").send(
            {
                username: "anna",
                email:"anna@gmail.com",
                password: "password"
            }
        )

        expect(response.status).toBe(400)
        expect(response.body.msg).toEqual("Username or Email already in use")
    })

    test("should return 400, missing data ", async ()=>{
        const response = await request(app).post("/api/v1/auth/register").send(
            {
                email:"dave@gmail.com",
                password: "password"
            }
        )

        expect(response.status).toBe(400)
        expect(response.body.msg).toEqual(`\"username\" is required`)
    })

    test("should return 400, sending empty body ", async ()=>{
        const response = await request(app).post("/api/v1/auth/register").send({})

        expect(response.status).toBe(400)
    })

    test("should return 400, invalid data ", async ()=>{
        const response = await request(app).post("/api/v1/auth/register").send(
            {
                username: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                email: "peter@gmail.com",
                password: "password"
            }
        )

        expect(response.status).toBe(400)
        expect(response.body.msg).toEqual(`\"username\" length must be less than or equal to 30 characters long`)
    })
    
})

describe("Login tests", ()=>{
    test("should return 200 for login with username only (valid data)", async ()=>{
        const response = await request(app).post("/api/v1/auth/login").send(
            {
                username: "anna",
                password: "password"
            }
        )

        expect(response.status).toBe(200)
    })

    test("should return 200 for login with email only (valid data)", async ()=>{
        const response = await request(app).post("/api/v1/auth/login").send(
            {
                email: "anna@gmail.com",
                password: "password"
            }
        )

        expect(response.status).toBe(200)
    })

    test("should return 200 for login with user created before tests", async ()=>{
        const response = await request(app).post("/api/v1/auth/login").send(
            {
                email: "john@gmail.com",
                password: "password"
            }
        )
        
        expect(response.status).toBe(200)
    })

    test("should return 401 for login with invalid credentials",async () => {
        const response = await request(app).post("/api/v1/auth/login").send(
            {
                username: "john",
                password: "pasworddd"
            }
        )
        expect(response.status).toBe(401)
        expect(response.body.msg).toBe("credentials are invalid")
    })

    test("should return 404 for login with non-existent user",async () => {
        const response = await request(app).post("/api/v1/auth/login").send(
            {
                username: "mike",
                password: "mikePassword"
            }
        )
        expect(response.status).toBe(404)
        expect(response.body.msg).toBe("credentials are invalid")
    })

    test("should return 400 for login with missing data (no username or email)", async ()=>{
        const response = await request(app).post("/api/v1/auth/login").send(
            {
                password:"passwordd"
            }
        )

        expect(response.status).toBe(400)
        expect(response.body.msg).toBe("Please provide username or email")
    })

    test("should return 400 for login with missing data (no password)", async ()=>{
        const response = await request(app).post("/api/v1/auth/login").send(
            {
                email:"john@gmail.com"
            }
        )

        expect(response.status).toBe(400)
        expect(response.body.msg).toBe(`\"password\" is required`)
    })
})