export const typeDefs = `#graphql
  # --- TYPES ---
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

  # --- QUERIES (Fetching Data) ---
  type Query {
    getAllProducts: [Product!]!
    getCategory(categoryName: String!): [Product!]!
    # getCart: Cart (We will add this later!)
  }

  # --- MUTATIONS (Changing Data) ---
  type Mutation {
    # Auth
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String! # Returns the JWT token
    
    # Products
    # createProduct(name: String!, price: Float!, ...): Product!
  }
`;