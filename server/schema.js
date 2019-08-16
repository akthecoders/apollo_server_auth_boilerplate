const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String
    password: String
    company: String
    email: String
  }

  type Query {
    me: User
    login(email: String!, password: String!): token
  }

  type token {
    token: String
  }

  type Mutation {
    registerUser(
      name: String!
      password: String!
      company: String!
      email: String!
    ): token
    deleteUser: User
  }
`;

module.exports = typeDefs;
