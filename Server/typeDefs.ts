export const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String
    email: String
    role: String
    avatar: String
  }

  type AuthPayload {
    token: String!
    _id: ID
    name: String
    email: String!
    role: String!
    avatar: String
  }

type Review {
  _id: ID
  name: String
  rating: Float!
  comment: String!
  user: User   
  reviewerName: String
  date: String
  createdAt: String
}
type ShippingAddress {
  address: String!
  city: String!
  postalCode: String!
  country: String!
}
input ShippingAddressInput {
  address: String!
  city: String!
  postalCode: String!
  country: String!
}

input PaymentResultInput {
  id: String
  status: String
  email_address: String
}
input OrderItemInput {
  name: String!
  quantity: Int!
  image: String
  price: Float!
  product: ID!
}
  type Product {
    _id: ID!
    title: String!
    price: Float!
    user: User
    description: String!
    category: String!
    stock: Int!
    thumbnail: String
    brand: String
    rating: Float
    numReviews: Int
    reviews: [Review]
    discountPercentage: Float
    originalPrice: Int
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

  type OrderItem {
    name: String!
  quantity: Int!
  image: String
  price: Float!
  product: Product
  }
  type Order {
    _id: ID!
  status: String
  email: String
    user: User! 
    orderItems: [OrderItem!]!
    paymentMethod: String!
    itemsPrice: Float!
    shippingPrice: Float!
    totalPrice: Float!
    isPaid: Boolean!
    paidAt: String
    createdAt: String
    isDelivered: Boolean!
    deliveredAt: String
    shippingAddress: ShippingAddress!
  }

  type RevenueStats {
    totalRevenue: Float!
    totalItemsSold: Int!
  }

  type Query {
    getProducts(limit: Int, skip: Int, keyword: String): PaginatedProducts
    getProductsByCategory(categoryName: String!, limit: Int, skip: Int): PaginatedProducts
    getSingleProduct(productId: ID!): Product
    getAdminProducts: [Product]
    getCart: Cart
    getMyOrders: [Order!]
    getSellerRevenue: RevenueStats
    getAllUsers: [User!]
    getUserProfile: User!
  getFavorites: [Product]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    forgotPassword(email: String!): String
    resetPassword(token: String!, password: String!): String
    upgradeToSeller: User

    updateUserRole(id: ID!, role: String!): User
  toggleFavorite(productId: ID!): [String]

    createProduct(title: String!, price: Float!, description: String!, category: String!, stock: Int!, brand: String): Product
    updateProduct(productId: ID!, title: String, price: Float, description: String, category: String, stock: Int, brand: String): Product
    deleteProduct(productId: ID!): String

    createProductReview(productId: ID!, rating: Float!, comment: String!): String
    addToCart(productId: ID!, quantity: Int!): Cart
    removeFromCart(productId: ID!): Cart
    decreaseQuantity(productId: ID!): Cart
    
    createOrder(
      orderItems: [OrderItemInput!]!
    shippingAddress: ShippingAddressInput!,
      paymentMethod: String!, 
      itemsPrice: Float!, 
      shippingPrice: Float!, 
      totalPrice: Float!, 
      paymentResult: PaymentResultInput
    ): Order
  }
`;