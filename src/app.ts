import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import { ApolloServer, AuthenticationError, gql } from "apollo-server";
const auth = require("./util/auth");
const jwt = require("jsonwebtoken");

// import resolvers = require("./graphql/resolver");
// const typeDefs = require("./graphql/schema");
const schema = require("./graphql/schema");
const server = new ApolloServer({
  schema,
  context: auth,
});

createConnection()
  .then(() => {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch((err) => console.log(err));
