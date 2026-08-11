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
export const Login = gql `
mutation Mutation($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    token
    avatar
    role
    email
    name
    _id
  }
}`

export const FORGOT_PASSWORD = gql `
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}`
 
export const RESET_PASSWORD = gql `
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
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