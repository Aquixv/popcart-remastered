import express from 'express';
const router = express.Router();
import { protect, isSeller, isAdmin } from "../middleware/authMiddleware";
import { createProductReview } from "../controllers/Productcontroller";
import { getProducts, getProductsByCategory, getSingleProduct, createProduct } from "../controllers/Productcontroller";
import { getSellerProducts } from "../controllers/Productcontroller";
import { deleteProduct } from "../controllers/Productcontroller";
import { upload, cloudinary } from "../cloudinary";
import { getAdminProducts } from "../controllers/Productcontroller";



router.get('/all', protect as any, isAdmin as any, getAdminProducts);
router.get('/', getProducts as any);
router.get('/mine', protect as any, isSeller as any, getSellerProducts as any);
router.get('/category/:category', getProductsByCategory as any);
router.get('/:id', getSingleProduct as any);
router.post('/:id/reviews', protect as any, createProductReview as any);
router.post('/', protect as any, isSeller as any, upload.single('image'), createProduct as any);
router.delete('/:id', protect as any, isSeller as any, deleteProduct as any);

export default router;