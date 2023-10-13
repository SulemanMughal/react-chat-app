
const typeDefs = `
    type User {
        id : ID!
        firstName : String!
        lastName : String!
        email : String!
    }

 
    input UserInput{
        firstName:String!
        lastName:String
        email:String!
        password:String!
    }

    input UserSignInInput{
        email:String!
        password:String!
    }


    type Token{
        token:String!
    }

    


    scalar Date

    type Message{
        id:ID!
        text:String!
        receivedId: Int!
        senderId: Int!
        createdAt: Date!
    }

    type Query {
        users: [User]
        user(id: ID!): User
        messagesByUser(receivedId: Int!): [Message]
    }

    type Mutation{
        signupUser(userNew:UserInput):User
        signInUser(userSignIn:UserSignInInput):Token
        createMessage(receivedId:Int!, text:String!):Message
    }
    

    type Subscription  {
        messageAdded: Message
    }

`;


export default typeDefs;