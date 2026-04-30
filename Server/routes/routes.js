const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/Authcontroller');
const { protect, isAdmin, isSeller } = require('../middleware/authMiddleware'); 
const { upload, cloudinary } = require('../cloudinary');
const passport = require('passport');
const generateToken = require('../config/GenerateToken');
const User = require('../models/Schema')
const { forgotPassword, resetPassword } = require('../controllers/Authcontroller');
const { addToCart, getCart, removeFromCart, decreaseQuantity } = require('../controllers/Cartcontroller');
const { getProducts, getProductsByCategory, getSingleProduct, createProduct } = require('../controllers/Productcontroller');
const { createOrder } = require('../controllers/Ordercontroller');
const { toggleFavorite, getFavorites } = require('../controllers/Usercontroller');
const { upgradeToSeller } = require('../controllers/Authcontroller');
const { getMyOrders } = require('../controllers/Ordercontroller');
const { getSellerRevenue } = require('../controllers/Ordercontroller');
const { getAllUsers } = require('../controllers/Usercontroller');
const { updateUserRole } = require('../controllers/Usercontroller');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', protect, async (req, res) => {

  res.json({
      _id: req.user._id,
  name: req.user.name,
  email: req.user.email,
  role: req.user.role,
  avatar: req.user.avatar,
  });
});
router.get(
  '/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {

    const token = generateToken(req.user._id);
    const userData = JSON.stringify({
  _id: req.user._id,
  name: req.user.name,
  email: req.user.email,
  role: req.user.role,
  avatar: req.user.avatar,
  token: token
});

    const encodedUser = encodeURIComponent(userData);
    res.redirect(`${process.env.FRONTEND_URL}/login?user=${encodedUser}`);
  }
);
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const userData = JSON.stringify({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      token: token
    });

    const encodedUser = encodeURIComponent(userData);
    res.redirect(`${process.env.FRONTEND_URL}/login?user=${encodedUser}`);
  }
);
router.post('/profile/upload', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { 
            folder: "ecommerce_avatars",
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.file.buffer); 
      });
    };
    console.log("Uploading to Cloudinary...");
    const result = await streamUpload(req);
    console.log("✅ Cloudinary Success:", result.secure_url);

    const updatedUser = await User.findByIdAndUpdate(
  req.user._id,
  { avatar: result.secure_url },
  { returnDocument: 'after' }
);
    res.json({
      message: "Profile picture updated successfully",
      avatarUrl: updatedUser.avatar
    });

  } catch (error) {
    console.error("🚨 Cloudinary/Server Error:", error);
    return res.status(500).json({ message: "Error uploading image" });
  }
});
router.post('/cart', protect, addToCart);
router.get('/cart', protect, getCart);
router.get('/products', getProducts);

router.get('/products/category/:category', getProductsByCategory);

router.delete('/cart/:productId', protect, removeFromCart);
router.put('/cart/:productId/decrease', protect, decreaseQuantity);

router.get('/products/:id', getSingleProduct);
router.post('/orders', protect, createOrder);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/favorites', protect, getFavorites);
router.get('/orders', protect, getMyOrders);
router.post('/favorites/:productId', protect, toggleFavorite);
router.put('/profile/upgrade', protect, upgradeToSeller);
router.get('/orders/revenue', protect, isSeller, getSellerRevenue);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);
module.exports = router;