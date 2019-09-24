const Event = require("../model/Event");

const timestamps = () => {
  const date = new Date();
  return { createdAt: date, updatedAt: date };
};

const newEventData = (eventData, timestamps) => ({
  ...eventData,
  ...timestamps,
  comment: { ...eventData.comment, ...timestamps }
});

// req.body for createEvent should look something like:
// {
//   name: "Birthday Bash",
//   address: {
//     street: "1234 E Maryville Ln",
//     city: "Seattle",
//     state: "WA",
//     zip: "40219"
//   },
//   latitude: 91.0,
//   longitude: 24.0,
//   comment: {
//     text: "hey there",
//     user: 12,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   user: 12, // retrieve user w/ username taken off the jwt
//   eventDate: true, // from client
//   createdAt: new Date(),
//   updatedAt: new Date()
// }
// But we'll spread timestamps on the body, and nested comment object.
const createEvent = async (req, res, next) => {
  const { body } = req;
  console.log("createEvents' req.body ", body);
  const event = new Event(newEventData(body, timestamps()));
  const result = await event.save();
  res.send("event created!");
};

module.exports = {
  createEvent
};
