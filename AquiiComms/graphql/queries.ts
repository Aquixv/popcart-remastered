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
        user {
          avatar
          name
          email
          role
        }
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
      user {
        _id
        name
        email
        role
        avatar
      }
    }
  }
}
}
`