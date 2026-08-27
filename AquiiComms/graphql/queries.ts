import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql `query GetProducts($limit: Int, $skip: Int, $keyword: String) {
  getProducts(limit: $limit, skip: $skip, keyword: $keyword) {
    products {
     user {
        name
        email
        _id
      }
      _id
      title
      price
      description
      category
      stock
      thumbnail
      brand
          discountPercentage
    originalPrice
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
    description
    category
    stock
    thumbnail
    brand
    numReviews
    rating
    discountPercentage
    originalPrice
  }
}
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryName: String!, $limit: Int) {
    getProductsByCategory(categoryName: $categoryName, limit: $limit) {
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
    discountPercentage
    originalPrice
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
      reviewerName
      date
      createdAt
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
    shippingAddress {
        address
        city
        postalCode
        country
      }
    paymentMethod
    itemsPrice
    shippingPrice
    totalPrice
    isPaid
    createdAt
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
    category
    stock
    thumbnail
    brand
    rating
    numReviews
    reviews {
      name
      rating
      comment
    }
    discountPercentage
    originalPrice
    user {
      name
      email
      role
    }
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
export const GET_ADMIN_PRODUCTS = gql `
query GetAdminProducts {
  getAdminProducts {
    _id
    title
    price
    user {
      name
      email
    }
    category
    stock
    thumbnail
    rating
    discountPercentage
  }
}
`