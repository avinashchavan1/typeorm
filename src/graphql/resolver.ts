import { Post } from "../entity/Post";
import { getConnection, getRepository } from "typeorm";
import { User } from "../entity/User";
const validator = require("validator");

import {
  AuthenticationError,
  ValidationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server";

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
    posts: async function (parent, agrs, context) {
      const userId = context.userId;
      if (!userId) throw new AuthenticationError("you must be logged in");
      const postRepository = getRepository(Post);
      const posts = await postRepository.find();
      return posts;
    },
    login: async function (parent, { email, password }) {
      if (!validator.isEmail(email)) {
        throw new UserInputError("Invalid Email");
      }
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ email: email });
      if (!user) {
        throw new ValidationError("User does not exist");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (user.email !== email || !isEqual) {
        return new ValidationError("Wrong Credentails");
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
    user: async function (parent, agrs, context) {
      const userId = context.userId;
      if (!userId) throw new AuthenticationError("you must be logged in");
      const userRepository = getRepository(User);
      const user = userRepository.findOne({ id: userId });
      if (!user) throw new ValidationError("User does not exit");

      return user;
    },
    post: async function (parent, { id }, context) {
      const userId = context.userId;
      if (!userId) throw new AuthenticationError("you must be logged in");
      const postRepository = getRepository(Post);
      let post = await postRepository.findOne({ id: id });
      if (!post) throw new ValidationError("Post does not exit");
      return post;
    },
  },
  Mutation: {
    addUser: async function (parent, { userData }) {
      let users = getRepository(User);
      let existingUser = await users.findOne({
        email: userData.email,
      });
      if (existingUser) {
        return new UserInputError("User Already exist");
      }
      const user = new User();
      const hashedPw = await bcrypt.hash(userData.password, 12);
      user.name = userData.name;
      user.email = userData.email;
      user.password = hashedPw;
      user.status = "I'm New here";
      await users.save(user); // Using Reposiroties

      let result: UserReturnType = {
        name: userData.name,
        id: user.id,
      };
      console.log(result);
      return result;
    },
    addPost: async function (parent, { postData }, context) {
      const userId = context.userId;
      console.log(userId);
      if (!userId) throw new AuthenticationError("you must be logged in");
      // Add the logic to check the data validation
      const posts = getRepository(Post);
      const post = new Post();

      post.title = postData.title;
      post.content = postData.content;
      post.imageUrl = postData.imageUrl;
      post.creator = userId;
      // post.creatorName = "Avinash Chavan";
      post.createdAt = new Date().toISOString();
      post.updatedAt = new Date().toISOString();
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ id: userId });
      post.creatorName = user.name;
      user.posts = [...user.posts, post];
      await posts.save(post);
      await userRepository.save(user);
      return post;
    },
    updatePost: async function (parent, { id, postData }, context) {
      const userId = context.userId;
      if (!userId) throw new AuthenticationError("you must be logged in");
      const postRepository = getRepository(Post);
      let post = await postRepository.findOne({ id: id });
      if (!post) throw new ValidationError("Post does not exit");
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ id: userId });
      const uId: number = +post.creator;
      console.log(user.id, uId);
      if (user.id !== uId)
        throw new ForbiddenError("User not allowed to modify this post");
      post.title = postData.title;
      post.content = postData.content;
      post.imageUrl = postData.imageUrl;
      post.updatedAt = new Date().toISOString();

      await postRepository.save(post);
      console.log("Post Updated with postId: ", post.id);
      return post;
    },
    deletePost: async function (parent, { id }, context) {
      const userId = context.userId;
      if (!userId) throw new AuthenticationError("you must be logged in");
      const postRepository = getRepository(Post);
      let post = await postRepository.findOne({ id: id });
      if (!post) throw new ValidationError("Post does not exit");
      if (post.creator !== userId)
        throw new ForbiddenError("User not allowed to modify this post");

      await postRepository.remove(post);
      return true;
    },
    updateStatus: async function (parent, { status }, context) {
      const userId = context.userId;
      if (!userId) throw new AuthenticationError("you must be logged in");
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({ id: userId });
      if (!user) throw new ValidationError("User does not exit");
      user.status = status;
      await userRepository.save(user);
      return user;
    },
  },
};
