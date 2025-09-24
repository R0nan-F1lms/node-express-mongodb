const request = require("supertest");
const db = require("../app/models");
const app = require("../server");

describe("Tutorials CRUD API", () => {

  it("should create a tutorial", async () => {
    const res = await request(app)
      .post("/api/tutorials")
      .send({ title: "Test", description: "Desc" });
    expect(res.statusCode).toBe(200);
  });

  it("should fetch all tutorials", async () => {
    const res = await request(app).get("/api/tutorials");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(async () => {
    await db.mongoose.connection.close();
  });
});
