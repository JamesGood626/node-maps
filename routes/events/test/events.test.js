const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");

let server;
let agent;

beforeAll(() => {
  server = app.listen();
  agent = request.agent(server);
});

afterAll(done => {
  console.log("Calling server.close()");
  console.log("the server: ", server.close);
  mongoose.connection.close();
  server.close(done);
});

describe("Testing events' routes", function() {
  test("should return OK status", async done => {
    const response = await agent.get("/");
    expect(response.status).toBe(200);
    done();
  });
});
