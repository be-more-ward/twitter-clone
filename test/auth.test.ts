import { PrismaClient } from '@prisma/client'
import request from "supertest"
import app from "../src/app"

const prisma = new PrismaClient()

beforeAll( async ()=>{
    await prisma.$connect()
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