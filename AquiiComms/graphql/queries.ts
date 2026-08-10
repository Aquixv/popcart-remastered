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
export const GET_CART = gql ``