const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const User = require("../../user/model/User");
const Event = require("../model/Event");
const { createNewEvent } = require("../service");

const userSignupData = {
  username: "testUser",
  email: "test@test.com",
  password: "password"
};

const firstEventData = {
  name: "First Event",
  address: {
    street: "1234 E Maryville Ln",
    city: "Seattle",
    state: "WA",
    zip: "40219"
  },
  latitude: 91.0,
  longitude: 24.0,
  comment: {
    text: "The test's beforeAll created this!"
  },
  eventDate: new Date()
};

const eventData = {
  name: "Birthday Bash",
  address: {
    street: "1234 E Maryville Ln",
    city: "Seattle",
    state: "WA",
    zip: "40219"
  },
  latitude: 91.0,
  longitude: 24.0,
  comment: {
    text: "hey there"
  },
  eventDate: new Date()
};

const commentData = {
  text: "What's up!"
  // event_id should also be included
};

let server;
let agent;
let event;

beforeAll(async done => {
  server = app.listen();
  agent = request.agent(server);
  const {
    body: { id }
  } = await agent.post("/api/users/signup").send(userSignupData);
  console.log("GOT ID: ", id);
  event = await createNewEvent({
    eventData: firstEventData,
    currentUser: { id }
  });
  console.log("Created event in beforeAll: ", event);
  console.dir(event);
  done();
});

afterAll(async done => {
  await User.deleteMany({});
  await Event.deleteMany({});
  mongoose.connection.close();
  server.close(done);
});

describe("User may make a request to Events' routes", function() {
  test("GET 'api/events/:eventId' should retrieve a single event associated with eventId", async done => {
    const {
      status,
      body: { data }
    } = await agent.get(`/api/events/${event._id}`).send(eventData);
    expect(data.name).toBe("First Event");
    expect(status).toBe(200);
    done();
  });

  test("POST 'api/events' should create event", async done => {
    const {
      status,
      body: { data }
    } = await agent.post("/api/events/").send(eventData);
    expect(status).toBe(200);
    // TODO:
    // Could do a more comprehensive check to ensure that everything is on the data object.
    // But will skip for now.
    expect(data.name).toBe("Birthday Bash");
    done();
  });

  test("POST 'api/events/comment should create event comment", async done => {
    const {
      status,
      body: { data }
    } = await agent
      .post("/api/events/comment")
      .send({ ...commentData, event_id: event._id });
    expect(status).toBe(200);
    expect(data.text).toBe(commentData.text);
    done();
  });
});

// Example "POST '/events' should create event response.body.data result:"
// + Object {
//   +   "data": Object {
//   +     "_id": "5d93939cd16bdf720495d343",
//   +     "address": Object {
//   +       "_id": "5d93939cd16bdf720495d344",
//   +       "city": "Seattle",
//   +       "state": "WA",
//   +       "street": "1234 E Maryville Ln",
//   +       "zip": "40219",
//   +     },
//   +     "comment": Array [
//   +       Object {
//   +         "_id": "5d93939cd16bdf720495d345",
//   +         "createdAt": "2019-10-01T17:57:48.232Z",
//   +         "replies": Array [],
//   +         "text": "hey there",
//   +         "updatedAt": "2019-10-01T17:57:48.232Z",
//   +       },
//   +     ],
//   +     "eventDate": "2019-10-01T17:57:47.888Z",
//   +     "latitude": 91,
//   +     "longitude": 24,
//   +     "name": "Birthday Bash",
//   +   },
//   + }
