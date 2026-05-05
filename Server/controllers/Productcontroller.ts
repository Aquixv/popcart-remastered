import { Request, Response } from 'express';
import { cloudinary } from "../cloudinary";
import { AuthRequest } from "../middleware/authMiddleware";
import Product from "../models/Product";

export const getProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit as string) : 30;
    const skip = parseInt(req.query.skip as string) || 0;
    const keyword = req.query.keyword as string;

    const searchFilter = keyword
      ? { title: { $regex: keyword, $options: 'i' } }
      : {};

    const products = await Product.find({ ...searchFilter })
                                  .skip(skip)
                                  .limit(limit);
                                  
    const total = await Product.countDocuments({ ...searchFilter });
      
    return res.status(200).json({ 
      products,
      total,
      skip,
      limit
    }); 
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Server error fetching products" });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const categoryName = req.params.category;
    const limit = parseInt(req.query.limit as string) || 30;
    const skip = parseInt(req.query.skip as string) || 0;

    const products = await Product.find({ category: categoryName })
                                  .skip(skip)
                                  .limit(limit);

    const total = await Product.countDocuments({ category: categoryName });
    
    return res.status(200).json({ 
      products,
      total,
      skip,
      limit
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ message: "Server error fetching category" });
  }
};

export const createProductReview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user?.toString() === req.user?._id?.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product." });
    }

    const review = {
      name: req.user?.name, 
      rating: Number(rating),
      comment,
      user: req.user?._id,
    };
    
    product.reviews.push(review as any);
    
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    
    return res.status(201).json({ message: "Review added successfully!" });

  } catch (error) {
    console.error("Review Error:", error);
    return res.status(500).json({ message: "Server error saving review" });
  }
};

export const getSingleProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching single product:", error);
    return res.status(500).json({ message: "Server error fetching product" });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }
    const { title, price, description, category, stock } = req.body;
    const streamUpload = (file: Express.Multer.File): Promise<any> => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { 
            folder: "ecommerce_products",
            transformation: [{ width: 800, height: 800, crop: 'limit' }] 
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

    console.log("Uploading product image to Cloudinary...");
    const result = await streamUpload(req.file);
    console.log("✅ Cloudinary Success:", result.secure_url);

    const product = new Product({
      user: req.user?._id,
      title,
      price,
      description,
      category,
      stock,
      thumbnail: result.secure_url, 
      brand: "Independent Seller", 
      rating: 0,
      numReviews: 0,
      discountPercentage: 0
    });
    const createdProduct = await product.save();
    
    return res.status(201).json(createdProduct);

  } catch (error) {
    console.error("🚨 Create Product Error:", error);
    return res.status(500).json({ message: "Error creating product" });
  }
};

export const getSellerProducts = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const products = await Product.find({ user: req.user?._id }).sort({ createdAt: -1 }); 
    return res.json(products);
  } catch (error) {
    console.error("Fetch seller products error:", error);
    return res.status(500).json({ message: "Server error fetching products" });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.user?.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: "You can only delete your own products!" });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ message: "Product removed successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Server error deleting product" });
  }
};

export const getAdminProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await Product.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    return res.json(products);
  } catch (error) {
    console.error("Fetch all products error:", error);
    return res.status(500).json({ message: "Server error fetching global inventory" });
  }
};