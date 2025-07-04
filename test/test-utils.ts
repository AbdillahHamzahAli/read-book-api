import supertest from "supertest";
import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import app from "../src/application/web";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "test",
        email: "test@test.com",
        password: await bcrypt.hash("test1234", 10),
        role: "ADMIN",
      },
    });
  }

  static async delete() {
    await prismaClient.user.delete({
      where: {
        email: "test@test.com",
      },
    });
  }

  static async getToken() {
    const response = await supertest(app).post("/api/user/login").send({
      email: "test@test.com",
      password: "test1234",
    });

    return response.body.data.token;
  }
}
