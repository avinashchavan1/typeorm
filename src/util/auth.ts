import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { AuthenticationError } from "apollo-server";
const jwt = require("jsonwebtoken");
module.exports = async ({ req }) => {
  const tokenRaw: string = req.headers.authorization || "";
  let token: string;
  if (tokenRaw) {
    token = tokenRaw.split(" ")[1];
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "hello");
  } catch (err) {
    decodedToken = "";
  }
  let userId: number;
  if (decodedToken) {
    userId = decodedToken.userId as number;
  }

  return { userId };
};
