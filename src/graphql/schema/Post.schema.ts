const Post = `
input PostInputData {
  title: String!
  content: String!
  imageUrl: String!
  creator: String!
}
type Post {
  id: ID!
  title: String!
  content: String!
  imageUrl: String!
  creator: String!
  creatorName: String!
  createdAt: String!
  updatedAt: String!
}
  extend type Mutation{
    addPost(postData: PostInputData!): Post!
    updatePost(id: ID!, postData: PostInputData!): Post!
    deletePost(id: ID!): Boolean
  }
  extend type Query{
    posts: [Post]
    post(id: ID): Post!
  }
`;
module.exports = Post;
