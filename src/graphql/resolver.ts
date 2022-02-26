import { Post } from "../entity/Post";
import { getConnection, getRepository } from "typeorm";
import { User } from "../entity/User";
const error = require("../util/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

type AuthData = {
  token: string;
  userId: string;
};

type UserReturnType = {
  name: string;
  id: number;
};

module.exports = {
  Query: {
    posts: async function () {
      const postRepository = getRepository(Post);
      const posts = await postRepository.find();
      console.log(posts);
      return posts;
    },
    login: async function (parent, { email, password }) {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ email: email });
      if (!user) {
        return error.generateErrorWithStausCode(401, "User does not exist");
      }
      // console.log(user, email, password);
      const isEqual = await bcrypt.compare(password, user.password);
      if (user.email !== email || !isEqual) {
        return error.generateErrorWithStausCode(401, "Wrong Credentails");
      }

      const token = jwt.sign(
        { userId: user.id.toString(), email: user.email },
        "hello",
        { expiresIn: "10h" }
      );
      let result: AuthData = {
        token: token,
        userId: user.id.toString(),
      };

      return result;
    },
  },
  Mutation: {
    addUser: async function (parent, { userData }) {
      let users = getRepository(User);
      let existingUser = await users.findOne({
        email: userData.email,
      });
      if (existingUser) {
        return error.generateErrorWithStausCode(401, "User Already exist");
      }
      const user = new User();
      const hashedPw = await bcrypt.hash(userData.password, 12);
      user.name = userData.name;
      user.email = userData.email;
      user.password = hashedPw;
      user.status = userData.status;
      await users.save(user); // Using Reposiroties

      let result: UserReturnType = {
        name: userData.name,
        id: user.id,
      };
      return result;
    },
    addPost: async function (parent, { postData }) {
      // Add the logic to check if the user is valid by token
      // Add the logic to check the data validation
      const posts = getRepository(Post);
      const post = new Post();
      post.title = postData.title;
      post.content = postData.content;
      post.imageUrl = postData.imageUrl;
      post.creator = postData.creator;
      post.createdAt = new Date().toISOString();
      post.updatedAt = new Date().toISOString();

      await posts.save(post);
      return post;
    },
  },
};
