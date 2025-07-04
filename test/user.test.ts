import supertest from "supertest";
import app from "../src/application/web";
import { logger } from "../src/application/logging";
import { UserTest } from "./test-utils";

describe("POST /api/user", () => {
  it("should register a new user", async () => {
    const response = await supertest(app).post("/api/user").send({
      username: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    });

    // logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("John Doe");
    expect(response.body.data.email).toBe("johndoe@example.com");
  });

  it("should return an error if the email is already registered", async () => {
    const response = await supertest(app).post("/api/user").send({
      username: "Jane Doe",
      email: "johndoe@example.com",
      password: "password123",
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBe("Email already exists");
  });

  it("should return an error if request invalid", async () => {
    const response = await supertest(app).post("/api/user").send({
      username: "",
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should regis role Admin", async () => {
    const response = await supertest(app).post("/api/user").send({
      username: "admin",
      email: "admin@gmail.com",
      password: "admin12345",
      role: "ADMIN",
    });

    // logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("admin");
    expect(response.body.data.email).toBe("admin@gmail.com");
  });
});

describe("POST /api/user/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should login a user", async () => {
    const response = await supertest(app).post("/api/user/login").send({
      email: "test@test.com",
      password: "test1234",
    });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.email).toBe("test@test.com");
    expect(response.body.data.role).toBe("ADMIN");
    expect(response.body.data.token).toBeDefined();
    console.log(`Token: ${response.body.data.token}`);
  });
});
