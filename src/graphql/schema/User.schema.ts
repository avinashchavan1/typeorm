const User = `
type UserResponse {
    id: ID!
    token: String!
    name: String!
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
  input UserInputData {
    name: String!
    email: String!
    password: String!
  }
  extend type Mutation{
    addUser(userData: UserInputData!): UserResponse!
    updateStatus(status: String!): User!
    updateStatus(status: String!): User!
  }
  extend type Query{
    login(email: String, password: String!): AuthData!
    user: User!
  }
`;
module.exports = User;
