import { registerUser, loginUser, forgotPassword, resetPassword, upgradeToSeller } from './controllers/Authcontroller';
import { getProducts, getSingleProduct, getProductsByCategory, createProductReview, getAdminProducts, getSellerProducts, deleteProduct, updateProductStock } from './controllers/Productcontroller';
import { getCart, addToCart, removeFromCart, decreaseQuantity } from './controllers/Cartcontroller';
import { getMyOrders, createOrder, getSellerRevenue } from './controllers/Ordercontroller';
import { toggleFavorite, getFavorites, getAllUsers, updateUserRole, getUserProfile, } from './controllers/Usercontroller';

export const resolvers = {
  Query: {
    // USERS FOR NOTING
    getAllUsers: getAllUsers,
    getFavorites: getFavorites,
    getUserProfile: getUserProfile,
    getSellerProducts:getSellerProducts,
    // PRODUCTS FOR NOTING
    getProducts: getProducts,
    getSingleProduct: getSingleProduct,
    getProductsByCategory: getProductsByCategory,
    getAdminProducts:getAdminProducts,
    // CART FOR NOTING
    getCart: getCart,
    
    // ORDERS FOR NOTING
    getMyOrders: getMyOrders,
    getSellerRevenue: getSellerRevenue
  },
  Mutation: {
    // AUTH/USERS FOR NOTING
    register: registerUser,
    login: loginUser,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    upgradeToSeller: upgradeToSeller,
    updateUserRole: updateUserRole,
    toggleFavorite: toggleFavorite,
    deleteProduct:deleteProduct,
    updateProduct:updateProductStock,
    // PRODUCT FOR NOTING
    createProductReview: createProductReview,

    // CART FOR NOTING
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    decreaseQuantity: decreaseQuantity,

    // ORDERS FOR NOTING
    createOrder: createOrder
  }
};