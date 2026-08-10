import { Request, Response } from 'express';
import { cloudinary } from "../cloudinary";
import Product from "../models/Product";

export const getProducts = async (_: any, args: { limit?: number, skip?: number, keyword?: string }) => {
  try {
    const limit = args.limit !== undefined ? args.limit : 30;
    const skip = args.skip || 0;
    const keyword = args.keyword;

    const searchFilter = keyword
      ? { title: { $regex: keyword, $options: 'i' } }
      : {};

    const products = await Product.find({ ...searchFilter })
                                  .skip(skip)
                                  .limit(limit);
                                  
    const total = await Product.countDocuments({ ...searchFilter });
      
    return { 
      products,
      total,
      skip,
      limit
    }; 
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Server error fetching products");
  }
};

export const getProductsByCategory = async(_: any, args: {limit?: number, skip?: number, categoryName?:string }) => {
  try {
    const categoryName = args.categoryName;
    const limit = args.limit !== undefined ? args.limit : 30;
    const skip = args.skip || 0 ; 

    const products = await Product.find({ category: categoryName })
                                  .skip(skip)
                                  .limit(limit);

    const total = await Product.countDocuments({ category: categoryName });
    
    return{ 
      products,
      total,
      skip,
      limit
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error ("Server error fetching category" );
  }
};

export const createProductReview = async (_: any, args: { productId: string, rating: number, comment: string }, context: any) => {
  try {
    if (!context.user) {
      throw new Error("You must be logged in to leave a review.");
    }

    const { productId, rating, comment } = args;

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const alreadyReviewed = product.reviews.find(
      (r: any) => r.user?.toString() === context.user._id.toString()
    );

    if (alreadyReviewed) {
      throw new Error("You already reviewed this product.");
    }

    const review = {
      name: context.user.name,
      rating: Number(rating),
      comment,
      user: context.user._id,
    };
    
    product.reviews.push(review as any);
    
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    
    return "Review added successfully!"; 

  } catch (error) {
    console.error("Review Error:", error);
    throw new Error("Server error saving review");
  }
}; 
export const getSingleProduct = async(_: any, args: { productId: string }) => {
  try {
    const product = await Product.findById(args.productId);
    
    if (!product) throw new Error ("Product not found");
    return product;
  } catch (error) {
    console.error("Error fetching single product:", error);
    throw new Error("Server error fetching product");
  }
};

export const getSellerProducts = async (_: any, __: any, context: any) => {
  try {
    if (!context.user) throw new Error("Not authenticated");
    
    const products = await Product.find({ user: context.user._id }).sort({ createdAt: -1 }); 
    return products;
  } catch (error) {
    console.error("Fetch seller products error:", error);
    throw new Error("Server error fetching products");
  }
};

export const deleteProduct = async (_: any, args: { productId: string }, context: any) => {
  try {
    if (!context.user) throw new Error("Not authenticated");

    const product = await Product.findById(args.productId);
    if (!product) throw new Error("Product not found");
    
    if (product.user?.toString() !== context.user._id.toString() && context.user.role !== 'admin') {
      throw new Error("You can only delete your own products!");
    }
    
    await Product.findByIdAndDelete(args.productId);
    return "Product removed successfully";
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Server error deleting product");
  }
};

export const getAdminProducts = async (_: any, __: any, context: any) => {
  try {
    if (!context.user || context.user.role !== 'admin') {
      throw new Error("Not authorized as an admin");
    }

    const products = await Product.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    return products;
  } catch (error) {
    console.error("Fetch all products error:", error);
    throw new Error("Server error fetching global inventory");
  }
};

export const updateProductStock = async (_: any, args: { productId: string, stock: number }, context: any) => {
  try {
    if (!context.user) throw new Error("Not authenticated");

    const { productId, stock } = args;
    const product = await Product.findById(productId);

    if (!product) throw new Error("Product not found");

    if (product.user?.toString() !== context.user._id.toString() && context.user.role !== 'admin') {
      throw new Error("You can only update your own products!");
    }

    product.stock = Number(stock);
    const updatedProduct = await product.save();
    
    return updatedProduct;
  } catch (error) {
    console.error("Stock update error:", error);
    throw new Error("Server error updating stock");
  }
};


export const createProduct = async (req: Request | any, res: Response): Promise<any> => {
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
    console.log("👍 Cloudinary Success:", result.secure_url);

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