export const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String
  }

  type Product {
    _id: ID!
    name: String!
    description: String
    price: Float!
    category: String!
    stock: Int!
    imageUrl: String
  }
  type Query {
    getAllProducts: [Product!]!
    getCategory(categoryName: String!): [Product!]!
    # getCart: Cart (We will add this later!)
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String! # Returns the JWT token
    # createProduct(name: String!, price: Float!, ...): Product!
  }
`;