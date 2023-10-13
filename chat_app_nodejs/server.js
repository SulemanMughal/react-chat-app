import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';
import jwt from "jsonwebtoken";
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from "express"
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express()
const httpServer = createServer(app);



// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.

// console.debug("Okkkkkkk")
const serverCleanup = useServer({ schema }, wsServer);

// const server = new ApolloServer({
//   schema,
// });

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});





// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async ({req}) => {
//     const {authorization} = req.headers;
//     if(authorization){
//       const {userId} = jwt.verify(authorization, process.env.JWT_SECRET)
//       return {userId}
//     }
//   }
// });
  
// console.log(`🚀  Server ready at: ${url}`);


await server.start();
app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server, {
  context: async ({req}) => {
    const {authorization} = req.headers;
    if(authorization){
      const {userId} = jwt.verify(authorization, process.env.JWT_SECRET)
      return {userId}
    }
    return null
  },
  
}));

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});