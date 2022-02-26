import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { ApolloServer, gql } from "apollo-server-express";
import express = require("express");
import bodyparser = require("body-parser");

import resolvers = require("./graphql/resolver");
const typeDefs = require("./graphql/schema");
const setHeader = require("./util/headers");

const app = express();
// Mandatory middlewares for each incoming request
app.use(bodyparser.json());
app.use(setHeader);

// app.use((req, res, next) => {
//   console.log(req.body);
//   req.body = true;
//   next();
// });

app.use("/hello", (req: Request, res: Response, next: NextFunction) => {
  res.status(200);
  res.send("From hello!");
  res.end();
});

async function startServer() {
  await createConnection();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("Server is up");
  });
}

startServer();
