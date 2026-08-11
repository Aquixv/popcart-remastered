import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql `query Getproducts{
  getProducts {
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
        reviews {
          name
          rating
          comment
          user {
            name
            avatar
          }
        }
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
export const GET_SELLER_REVENUE = gql `
query GetSellerRevenue {
  getSellerRevenue {
    totalRevenue
    totalItemsSold
  }
}`