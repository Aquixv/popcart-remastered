import { gql } from "@apollo/client";

export const Register = gql `
mutation Mutation($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    token
    avatar
    role
    email
    name
    _id
  }
}
`
export const LOGIN = gql `
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    name
    email
    avatar
    _id
    token
    role
  }
}
`

export const FORGOT_PASSWORD = gql `
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}`
 
export const RESET_PASSWORD = gql `
mutation ResetPassword($token: String!, $password: String!) {
  resetPassword(token: $token, password: $password)
}`

export const UPGRADE_TO_SELLER = gql `
mutation UpgradeToSeller {
  upgradeToSeller {
    _id
    name
    email
    role
    avatar
  }
}`

export const CREATE_PRODUCT = gql `
mutation CreateProduct($title: String!, $price: Float!, $description: String!, $category: String!, $stock: Int!, $brand: String) {
  createProduct(title: $title, price: $price, description: $description, category: $category, stock: $stock, brand: $brand) {
    _id
    title
    price
    description
    category
    stock
    thumbnail
    brand
    rating
    numReviews
    reviews {
      name
      comment
      rating
    }
  }
}`
export const UPDATE_PRODUCT = gql`
mutation UpdateProduct($productId: ID!, $title: String, $price: Float, $description: String, $category: String, $stock: Int) {
  updateProduct(productId: $productId, title: $title, price: $price, description: $description, category: $category, stock: $stock) {
    title
    price
    description
    _id
    stock
    numReviews
    thumbnail
  }
}`

export const DELETE_PRODUCT = gql`
mutation DeleteProduct($productId: ID!) {
  deleteProduct(productId: $productId)
}`

export const CREATE_PRODUCT_REVIEW = gql`
mutation CreateProductReview($productId: ID!, $rating: Float!, $comment: String!) {
  createProductReview(productId: $productId, rating: $rating, comment: $comment)
}` 

export const ADD_TO_CART = gql`
mutation AddToCart($productId: ID!, $quantity: Int!) {
  addToCart(productId: $productId, quantity: $quantity) {
    user {
      name
      email
      avatar
      _id
    }
    _id
    items {
      quantity
      product {
        title
        _id
        price
        stock
        thumbnail
        rating
        brand
      }
    }
  }
}`
export const REMOVE_FROM_CART = gql`
mutation RemoveFromCart($productId: ID!) {
  removeFromCart(productId: $productId) {
    user {
      name
      role
      avatar
      email
    }
    items {
      product {
        title
        _id
        price
        thumbnail
        brand
        rating
      }
    }
  }
}`
export const DECREASE_QUANTITY = gql`
mutation DecreaseQuantity($productId: ID!) {
  decreaseQuantity(productId: $productId) {
    items {
      product {
        _id
        title
        price
        category
        stock
        thumbnail
        rating
        numReviews
      }
    }
    user {
      name
      avatar
      _id
    }
  }
}`

export const CREATE_ORDER = gql`
mutation CreateOrder($shippingAddress: String!, $paymentMethod: String!, $itemsPrice: Float!, $shippingPrice: Float!, $totalPrice: Float!, $paymentResult: String) {
  createOrder(shippingAddress: $shippingAddress, paymentMethod: $paymentMethod, itemsPrice: $itemsPrice, shippingPrice: $shippingPrice, totalPrice: $totalPrice, paymentResult: $paymentResult) {
    deliveredAt
    isDelivered
    paidAt
    isPaid
    totalPrice
    shippingPrice
    itemsPrice
    paymentMethod
    shippingAddress
    orderItems {
      product {
        numReviews
        rating
        thumbnail
        stock
        description
        price
        title
        _id
      }
      price
      quantity
    }
    _id
    user {
      name
      _id
      avatar
    }
  }
}`
export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      _id
      name
      role
    }
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($productId: ID!) {
    toggleFavorite(productId: $productId)
  }
`;