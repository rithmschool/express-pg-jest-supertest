process.env.NODE_ENV = "test";
const db = require("../db");
const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  await db.query("CREATE TABLE students (id SERIAL PRIMARY KEY, name TEXT)");
});

beforeEach(async () => {
  // seed with some data
  await db.query("INSERT INTO students (name) VALUES ('Elie'), ('Matt')");
});

afterEach(async () => {
  await db.query("DELETE FROM students");
});

afterAll(async () => {
  await db.query("DROP TABLE students");
  db.end();
});

describe("GET / ", () => {
  test("It should respond with an array of students", async () => {
    const response = await request(app).get("/");
    expect(response.body).toEqual(["Elie", "Matt", "Joel", "Michael"]);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /students", () => {
  test("It should respond with an array of students", async () => {
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /students", () => {
  test("It should respond with an array of students", async () => {
    const newStudent = await request(app)
      .post("/students")
      .send({
        name: "New Student"
      });
    expect(newStudent.body.name).toBe("New Student");
    expect(newStudent.body).toHaveProperty("id");
    expect(newStudent.body).toHaveProperty("name");
    expect(newStudent.statusCode).toBe(200);

    // make sure we have 3 students
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(3);
  });
});

describe("PATCH /students/1", () => {
  test("It should respond with an array of students", async () => {
    const newStudent = await request(app)
      .post("/students")
      .send({
        name: "Another one"
      });
    const updatedStudent = await request(app)
      .patch(`/students/${newStudent.body.id}`)
      .send({ name: "updated" });
    expect(updatedStudent.body.name).toBe("updated");
    expect(updatedStudent.body).toHaveProperty("id");
    expect(updatedStudent.body).toHaveProperty("name");
    expect(updatedStudent.statusCode).toBe(200);

    // make sure we have 3 students
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(3);
  });
});

describe("DELETE /students/1", () => {
  test("It should respond with an array of students", async () => {
    const newStudent = await request(app)
      .post("/students")
      .send({
        name: "Another one"
      });
    const removedStudent = await request(app).delete(
      `/students/${newStudent.body.id}`
    );
    expect(removedStudent.body).toEqual({ message: "Deleted" });
    expect(removedStudent.statusCode).toBe(200);

    // make sure we still have 2 students
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(2);
  });
});

describe("Test a 404", () => {
  test("It should respond with a 404 status", async () => {
    const response = await request(app).get("/nowhere");
    expect(response.statusCode).toBe(404);
  });
});
