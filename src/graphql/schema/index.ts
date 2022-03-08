const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("../resolver");
const PostSchema = require("./Post.schema");
const UserSchema = require("./User.schema");
const BaseSchema = require("./Base.schema");

module.exports = makeExecutableSchema({
  typeDefs: [BaseSchema, PostSchema, UserSchema],
  resolvers: {
    ...resolvers,
  },
});
