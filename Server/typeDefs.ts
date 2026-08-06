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
    _id: ID!
    name: String!
    email: String!
    role: String!
    avatar: String
  }

  type Review {
    _id: ID
    name: String!
    rating: Float!
    comment: String!
    user: User! # Changed from ID! to User!
  }

  type Product {
    _id: ID!
    title: String!
    price: Float!
    description: String!
    category: String!
    stock: Int!
    thumbnail: String
    brand: String
    rating: Float
    numReviews: Int
    reviews: [Review]
  }

  type PaginatedProducts {
    products: [Product!]!
    total: Int!
    skip: Int!
    limit: Int!
  }

  type CartItem {
    product: Product!
    quantity: Int!
  }

  type Cart {
    _id: ID!
    user: User! # Changed from ID! to User!
    items: [CartItem!]!
  }

  # NEW: Defines the items locked into a specific order
  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  # UPGRADED: Fully fleshed out Order type
  type Order {
    _id: ID!
    user: User! 
    orderItems: [OrderItem!]!
    shippingAddress: String!
    paymentMethod: String!
    itemsPrice: Float!
    shippingPrice: Float!
    totalPrice: Float!
    isPaid: Boolean!
    paidAt: String
    isDelivered: Boolean!
    deliveredAt: String
  }

  type RevenueStats {
    totalRevenue: Float!
    totalItemsSold: Int!
  }

  type Query {
    getProducts(limit: Int, skip: Int, keyword: String): PaginatedProducts
    getProductsByCategory(categoryName: String!, limit: Int, skip: Int): PaginatedProducts
    getSingleProduct(productId: ID!): Product
    
    getCart: Cart
    getMyOrders: [Order!]
    getSellerRevenue: RevenueStats
  }

  type Mutation {
    # Auth
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    forgotPassword(email: String!): String
    resetPassword(token: String!, password: String!): String
    upgradeToSeller: User

    # Seller Actions (NEW)
    createProduct(title: String!, price: Float!, description: String!, category: String!, stock: Int!, brand: String): Product
    updateProduct(productId: ID!, title: String, price: Float, description: String, category: String, stock: Int, brand: String): Product
    deleteProduct(productId: ID!): String

    # User Actions
    createProductReview(productId: ID!, rating: Float!, comment: String!): String
    addToCart(productId: ID!, quantity: Int!): Cart
    removeFromCart(productId: ID!): Cart
    decreaseQuantity(productId: ID!): Cart
    
    # Orders
    createOrder(
      orderItems: [OrderItemInput!]! # <-- Add this!
      shippingAddress: String!
      paymentMethod: String!
      itemsPrice: Float!
      shippingPrice: Float!
      totalPrice: Float!
      paymentResult: String
    ): Order
  }
`;