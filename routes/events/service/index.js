const Event = require("../model/Event");
const { Comment } = require("../model/Comment")
const { compose } = require('ramda')

const timestamps = () => {
  const date = new Date();
  return { createdAt: date, updatedAt: date };
};

const newEventData = ({ eventData, currentUser, timestamps }) => ({
  ...eventData,
  ...timestamps,
  user: currentUser.id,
  comments: [{ ...eventData.comment, ...timestamps, user: currentUser.id }]
})

const newCommentData = ({ commentData, currentUser, timestamps }) => ({
  ...commentData,
  ...timestamps,
  user: currentUser.id
})

const returnEventData = ({ _id, name, latitude, longitude, eventDate, address, comment}) => ({
  _id,
  name,
  latitude,
  longitude,
  eventDate,
  address,
  comment
})

const createNewEvent = async ({ eventData, currentUser }) => {
  const event = new Event(newEventData({ eventData, currentUser, timestamps: timestamps() }))
  return await event.save()
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
  // const event = new Event(newEventData({ eventData: body, currentUser, timestamps: timestamps() }));
  // const savedEvent = await event.save();

  const savedEvent = await createNewEvent({ eventData: body, currentUser })
  res.send({ data: returnEventData(savedEvent) });
};

const createComment = async (req, res) => {
  const { body, currentUser } = req;
  const comment = new Comment(newCommentData({ commentData: { text: body.text }, currentUser, timestamps: timestamps() }));
  const savedComment = await comment.save()
  // TODO:
  // Handle possible failure event.
  const commentSavedToEvent = await saveCommentToEvent(body, savedComment)
  res.send({ data: { text: savedComment.text } })
}

const saveCommentToEvent = async ({ event_id }, savedComment) => {
  const event = await Event.findById(event_id)
  event.comments.push(savedComment)
  console.log("event after push: ", event)
  return await event.save()
}

module.exports = {
  createEvent,
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