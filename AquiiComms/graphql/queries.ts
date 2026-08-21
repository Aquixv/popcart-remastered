import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql `query GetProducts($limit: Int, $skip: Int, $keyword: String) {
  getProducts(limit: $limit, skip: $skip, keyword: $keyword) {
    products {
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
       _id
       name
        rating
        comment
      }
    }
  }
}
`
export const GET_SELLER_PRODUCTS = gql`
  query GetSellerProducts {
    getSellerProducts {
      _id
      title
      price
      stock
      sold
      thumbnail
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`query Getproductsbycategory($categoryName: String!){
getProductsByCategory(categoryName: $categoryName) {
  limit
  skip
  total
  products {
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
      _id
      name
      rating
      comment
    }
  }
}
}
`
export const GET_SINGLE_PRODUCT = gql`
query GetSingleProduct($productId: ID!) {
  getSingleProduct(productId: $productId) {
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
      _id
      name
      rating
      comment
    }
  }
}
`
export const GET_CART = gql `
query GetCart {
  getCart {
    _id
    user {
      name
      role
      avatar
      _id
    }
    items {
      product {
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
      quantity
    }
  }
}`
export const GET_ORDERS = gql `
query GetMyOrders {
  getMyOrders {
    _id
    user {
      name
      avatar
      _id
    }
    orderItems {
      product {
        title
        price
        description
        category
        stock
        thumbnail
        rating
        numReviews
        brand
      }
      quantity
      price
    }
    shippingAddress
    paymentMethod
    itemsPrice
    shippingPrice
    totalPrice
    isPaid
    paidAt
    isDelivered
    deliveredAt
  }
}`
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      name
      email
      role
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites {
    getFavorites {
      _id
      title
      price
      thumbnail
      rating
    }
  }
`;
export const GET_SELLER_REVENUE = gql `
query GetSellerRevenue {
  getSellerRevenue {
    totalRevenue
    totalItemsSold
  }
}`

export const GET_USER_PROFILE = gql`
query GetUserProfile {
  getUserProfile {
    _id
    name
    email
    role
    avatar
  }
}`