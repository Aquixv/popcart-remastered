import express, { Response } from 'express';
import passport from 'passport';
import User from '../models/Schema';
import { upload, cloudinary } from '../cloudinary';
import generateToken from '../config/GenerateToken';
import { protect, isAdmin, isSeller, AuthRequest } from '../middleware/authMiddleware'; 

import { registerUser, loginUser, forgotPassword, resetPassword, upgradeToSeller } from '../controllers/Authcontroller';
import { addToCart, getCart, removeFromCart, decreaseQuantity } from '../controllers/Cartcontroller';
import { getProducts, getProductsByCategory, getSingleProduct, createProduct } from '../controllers/Productcontroller';
import { createOrder, getMyOrders, getSellerRevenue } from '../controllers/Ordercontroller';
import { toggleFavorite, getFavorites, getAllUsers, updateUserRole } from '../controllers/Usercontroller';

const router = express.Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.get('/profile', protect as any, async (req: any, res: Response): Promise<any> => {
  return res.json({
    _id: req.user?._id,
    name: req.user?.name,
    email: req.user?.email,
    role: req.user?.role,
    avatar: req.user?.avatar,
  });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req: any, res: Response) => {
    const token = generateToken(req.user._id.toString());
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

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req: any, res: Response) => {
    const token = generateToken(req.user._id.toString());
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

router.post('/profile/upload', protect as any, upload.single('avatar') as any, async (req: any, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }
    const streamUpload = (file: Express.Multer.File): Promise<any> => {
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
        stream.end(file.buffer); 
      });
    };
    
    console.log("Uploading to Cloudinary...");
    const result = await streamUpload(req.file);
    console.log("✅ Cloudinary Success:", result.secure_url);

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar: result.secure_url },
      { returnDocument: 'after' }
    );
    
    return res.json({
      message: "Profile picture updated successfully",
      avatarUrl: updatedUser?.avatar
    });

  } catch (error) {
    console.error("🚨 Cloudinary/Server Error:", error);
    return res.status(500).json({ message: "Error uploading image" });
  }
});

router.post('/cart', protect as any, addToCart as any);
router.get('/cart', protect as any, getCart as any);
router.get('/products', getProducts as any);
router.get('/products/category/:category', getProductsByCategory as any);
router.delete('/cart/:productId', protect as any, removeFromCart as any);
router.put('/cart/:productId/decrease', protect as any, decreaseQuantity as any);
router.get('/products/:id', getSingleProduct as any);
router.post('/orders', protect as any, createOrder as any);
router.post('/forgot-password', forgotPassword as any);
router.put('/reset-password/:token', resetPassword as any);
router.get('/favorites', protect as any, getFavorites as any);
router.get('/orders', protect as any, getMyOrders as any);
router.post('/favorites/:productId', protect as any, toggleFavorite as any);
router.put('/profile/upgrade', protect as any, upgradeToSeller as any);
router.get('/orders/revenue', protect as any, isSeller as any, getSellerRevenue as any);
router.get('/users', protect as any, isAdmin as any, getAllUsers as any);
router.put('/users/:id/role', protect as any, isAdmin as any, updateUserRole as any);

export default router;