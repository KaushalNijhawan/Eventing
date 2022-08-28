const {buildSchema} = require('graphql');

module.exports = buildSchema(`
type Event{
    _id : ID!,
    eventName : String!,
    date : String!,
    description : String!,
    price : Float!,
    creator : User!
}
type Booking {
    _id: ID,
    user : User!,
    event : Event!,
    createdAt : String!,
    udpdatedAt: String!
}
type User{
    username : String!,
    password:String,
    eventsList: [Event!]
}

input EventInput{
    eventName : String!,
    date : String!,
    description : String!,
    price : Float!
}
input UserInput{
    username : String!,
    password:String!,
    email : String!
}

type LoggedUser{
    username : String!,
    token : String!,
    eventsList: [Event!]
}
type RootQuery{
    events: [Event!]!,
    users : [User!]!,
    bookings : [Booking!]!
} 
type RootMutation{
    createEvent(eventType : EventInput): Event,
    createUser(userDetails : UserInput) : User,
    createBooking(eventID : ID!):Booking,
    cancelBooking(bookingId : ID!):Booking,
    loginUser(username : String , password : String) : LoggedUser
}

schema{
    query : RootQuery
    mutation : RootMutation
}
`);