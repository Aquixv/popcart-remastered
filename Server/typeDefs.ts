export const typeDefs = `#graphql
type User {
  _id: ID!
  name: String!
  email: String!
  role: String!
  avatar: String
}

type AuthPayload {
  token: String!
  user: User!
}

type Mutation {
  register(name: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  forgotPassword(email: String!): String!
  resetPassword(token: String!, password: String!): String!
  upgradeToSeller: User!
}

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String! # Returns the JWT token
    # createProduct(name: String!, price: Float!, ...): Product!
  }
`;