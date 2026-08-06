import { registerUser, loginUser, forgotPassword, resetPassword, upgradeToSeller } from './controllers/Authcontroller';
import { getProducts, getSingleProduct, getProductsByCategory, createProductReview } from './controllers/Productcontroller';
import { getCart, addToCart, removeFromCart, decreaseQuantity } from './controllers/Cartcontroller';
import { getMyOrders, createOrder, getSellerRevenue } from './controllers/Ordercontroller';

export const resolvers = {
  Query: {
    //USERS FOR NOTING
    getProducts: getProducts,
    getSingleProduct: getSingleProduct,
    getProductsByCategory: getProductsByCategory,
    //CART FOR NOTING
    getCart: getCart,
    //ORDERS FOR NOTING
    getMyOrders: getMyOrders,
    getSellerRevenue: getSellerRevenue
  },
  Mutation: {
    //USERS FOR NOTING
    register: registerUser,
    login: loginUser,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    upgradeToSeller: upgradeToSeller,

  //PRODUCT FOR NOTING
    createProductReview: createProductReview,

    //CART FOR NOTING
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    decreaseQuantity: decreaseQuantity,

    //ORDERS FOR NOTING
    createOrder: createOrder
  }
};