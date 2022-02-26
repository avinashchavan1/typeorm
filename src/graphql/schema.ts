const { ApolloServer, gql } = require("apollo-server-express");

module.exports = gql`
  type UserResponse {
    id: ID!
    token: String!
    name: String!
  }
  type Post {
    id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: String!
    createdAt: String!
    updatedAt: String!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    status: String!
    password: String!
    posts: [Post!]!
  }
  type AuthData {
    token: String!
    userId: String!
  }
  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
    creator: String!
  }

  input UserInputData {
    name: String!
    email: String!
    password: String!
    status: String
  }

  type Query {
    posts: [Post]
    login(email: String, password: String!): AuthData!
  }

  type Mutation {
    addPost(postData: PostInputData!): Post!
    addUser(userData: UserInputData!): UserResponse!
  }
`;
