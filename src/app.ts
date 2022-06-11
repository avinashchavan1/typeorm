import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";

const auth = require("./util/auth");
const jwt = require("jsonwebtoken");

// import resolvers = require("./graphql/resolver");
// const typeDefs = require("./graphql/schema");
const schema = require("./graphql/schema");
// const server = new ApolloServer({
//   schema,
//   context: auth,
//   csrfPrevention: true,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context: auth,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  createConnection()
    .then(async () => {
      const portNumber = process.env.PORT || 3000;
      // server.listen().then(({ url }) => {
      //   console.log(`🚀  Server ready at ${url}`);
      // });
      await server.start();
      server.applyMiddleware({ app });
      app.use("*", function (req, res) {
        res.send("what???").status(404);
      });
      await new Promise<void>((resolve) =>
        httpServer.listen({ port: portNumber }, resolve)
      );
      console.log(
        `🚀 Server ready at http://localhost:${portNumber}${server.graphqlPath}`
      );
    })
    .catch((err) => console.log(err));
}
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   csrfPrevention: true,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });

// createConnection()
//   .then(async() => {
//     // server.listen().then(({ url }) => {
//     //   console.log(`🚀  Server ready at ${url}`);
//     // });
//     await server.start();
//     server.applyMiddleware({ app });
//     await new Promise<void>((resolve) =>
//       httpServer.listen({ port: 4000 }, resolve)
//     );
//     console.log(
//       `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
//     );
//   })
//   .catch((err) => console.log(err));
startApolloServer();
