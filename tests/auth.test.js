import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API Tests", () => {
  describe("POST /api/auth/register", () => {
    it("should register user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(200);
    });

    it("should fail duplicate email", async () => {
      await User.create({
        email: "test@example.com",
        password: "123456",
      });

      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(400); // ✅ FIXED
    });

    it("should fail missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "123456",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(200);
    });

    it("should fail wrong password", async () => {
      await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "123456",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpass",
      });

      expect(res.statusCode).toBe(401);
    });
  });
});