const Event = require("../model/Event");
const { Comment } = require("../model/Comment");
const { compose } = require("ramda");

const timestamps = () => {
  const date = new Date();
  return { createdAt: date, updatedAt: date };
};

const newEventData = ({
  eventData: { latitude, longitude, ...rest },
  currentUser,
  timestamps
}) => {
  console.log("WHAT IS REST: ", rest);
  console.log(`lat: ${latitude}, lon: ${longitude}`);
  console.log("currentUser.id: ", currentUser.id);
  return {
    ...rest,
    ...timestamps,
    location: { type: "Point", coordinates: [latitude, longitude] },
    user: currentUser.id,
    comments: [{ ...rest.comment, ...timestamps, user: currentUser.id }]
  };
};

const newCommentData = ({ commentData, currentUser, timestamps }) => ({
  ...commentData,
  ...timestamps,
  user: currentUser.id
});

const returnEventData = ({
  _id,
  name,
  location,
  eventDate,
  address,
  comment
}) => ({
  _id,
  name,
  location,
  eventDate,
  address,
  comment
});

const createNewEvent = async ({ eventData, currentUser }) => {
  console.log("eventData in createNewEvent: ", eventData);
  const eventInfo = newEventData({
    eventData,
    currentUser,
    timestamps: timestamps()
  });
  console.log("eventInfo in createNewEvent: ", eventInfo);
  const event = new Event(eventInfo);
  console.log("event after new Event: ", event);
  return await event.save();
};

const saveCommentToEvent = async ({ event_id }, savedComment) => {
  const event = await Event.findById(event_id);
  event.comments.push(savedComment);
  return await event.save();
};

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
const createEvent = async (req, res) => {
  // TODO: handle validation of user input
  const { body, currentUser } = req;
  const savedEvent = await createNewEvent({ eventData: body, currentUser });
  res.send({ data: returnEventData(savedEvent) });
};

const createComment = async (req, res) => {
  const { body, currentUser } = req;
  const comment = new Comment(
    newCommentData({
      commentData: { text: body.text },
      currentUser,
      timestamps: timestamps()
    })
  );
  const savedComment = await comment.save();
  // TODO:
  // Handle possible failure event.
  const commentSavedToEvent = await saveCommentToEvent(body, savedComment);
  res.send({ data: { text: savedComment.text } });
};

// List all events within a given radius
const listEvents = async (req, res) => {
  // https://docs.mongodb.com/manual/geospatial-queries/
  // Found from: https://mongoosejs.com/docs/geojson.html
  // Event.find({
  //   location: {
  //     $geoWithin: {
  //       $geometry: colorado
  //     }
  //   }
  // })
  // Found from: https://stackoverflow.com/questions/25734092/query-locations-within-a-radius-in-mongodb
  // var query = {
  //   "loc" : {
  //       $geoWithin : {
  //           $centerSphere : [landmark.loc.coordinates, milesToRadian(5) ]
  //       }
  //   }
  // };
};

// Used when the user clicks on an individual event.
// Necessary so that all of the comments may be fetched, because
// the comments will not be included in the response from listEvents.
const getEvent = async (req, res) => {
  const {
    params: { eventId }
  } = req;
  const event = await Event.findById(eventId);
  res.send({ data: event });
};

module.exports = {
  createEvent,
  listEvents,
  getEvent,
  createComment,
  // Helper Methods Only!!!
  createNewEvent
};

// ramda.compose attempt:
// const inspect = (text) => (input) => {
//     console.log(`${text}: ${input}`)
//     console.dir(input)
//   }
//   const formatEventInput = ({ body, currentUser }) => ({ eventData: body, currentUser, timestamps: timestamps()})
//   const newEvent = eventInput => new Event(eventInput)
//   const saveEvent = async event => await event.save();
// saveEvent in this pipeline is returning a promise... so returnEventData can't format the return result.
// const create = async req => compose(inspect("after returnEventData Input"), returnEventData, inspect("after saveEvent Input"), await saveEvent, inspect("after newEvent Input"), newEvent, inspect("after newEventData Input"), newEventData, inspect("after formatEvent Input"), formatEventInput)(req)
