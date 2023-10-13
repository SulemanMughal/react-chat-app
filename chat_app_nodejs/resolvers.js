
// import {todos, users} from "./data.js"
import prisma from "./prisma.js";
import bcrypt from "bcryptjs";
import { GraphQLError } from 'graphql';
import jwt from "jsonwebtoken";
// import { PubSub } from "grapghql-subscriptions"
import { PubSub } from 'graphql-subscriptions';



const pubsub = new PubSub();


const MESSAGE_ADDED = "MESSAGE_ADDED";


const resolvers = {
    Query: {
        users : async (_, args,  contextValue) => {
          // console.debug(contextValue)
          if (!contextValue.userId) throw new GraphQLError('Not authenticated')
          const users = await prisma.user.findMany({
            orderBy : {
              createdAt : "desc"
            },
            where : {
              id : {
                not : contextValue.userId
              }
          }})
          // console.debug(users)
          return users
        },
        messagesByUser: async (_, {receivedId}, contextValue) => {
          if (!contextValue.userId) throw new GraphQLError('Not authenticated') 
          // console.debug(contextValue.userId,receivedId)
          const messages = await prisma.message.findMany({
            where : {
              OR : [
                { receivedId : receivedId, senderId : contextValue.userId },
                { receivedId : contextValue.userId, senderId : receivedId },
              ]
            },
            orderBy : {
              createdAt : "asc"
            }
          })

          // console.debug(messages)
          
          return messages;

        }
    },
    
    
    Mutation : {
      signupUser: async (_,{userNew} ) => {
        const user = await prisma.user.findUnique({
          where : {
            email: userNew.email
          }
        })
        if(user) throw new GraphQLError('User already exists')
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userNew.password, salt);
        const new_user = await prisma.user.create({
          data: {
            ...userNew,
            password: hashedPassword,
          }
        })
        return new_user;
      },
      signInUser : async (_,{userSignIn}) => {
        // console.debug(userSignIn)
        const user = await prisma.user.findUnique({
          where : {
            email: userSignIn.email
          }
        })
        if (!user) throw new GraphQLError('User does not exist with that email')
        const comparePassword = await bcrypt.compare(userSignIn.password, user.password);
        if (!comparePassword) throw new GraphQLError('Email or password does not match');
        const token = jwt.sign({
            userId : user.id
          }, process.env.JWT_SECRET)
          return {token};
        },


        createMessage : async(_, {receivedId, text}, contextValue) =>{
          if (!contextValue.userId) throw new GraphQLError('Not authenticated') 
          const message = await prisma.message.create({
        data:{
          text : text,
          receivedId : receivedId,
          senderId : contextValue.userId
        }
      })
          pubsub.publish(MESSAGE_ADDED , {messageAdded : message})
          return message;
        },

        
        

        

    },
    Subscription : {
      messageAdded : {
        subscribe : () => pubsub.asyncIterator(MESSAGE_ADDED)
      }
    }
  };


export default resolvers;