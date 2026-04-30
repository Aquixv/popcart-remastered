const { cloudinary } = require('../cloudinary');
const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 30;
    const skip = parseInt(req.query.skip) || 0;
    const searchFilter = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    const products = await Product.find({ ...searchFilter })
                                  .skip(skip)
                                  .limit(limit);
                                  
    const total = await Product.countDocuments({ ...searchFilter });
      
    res.status(200).json({ 
      products,
      total,
      skip,
      limit
    }); 
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const limit = parseInt(req.query.limit) || 30;
    const skip = parseInt(req.query.skip) || 0;

    const products = await Product.find({ category: categoryName })
                                  .skip(skip)
                                  .limit(limit);

    const total = await Product.countDocuments({ category: categoryName });
    
    res.status(200).json({ 
      products,
      total,
      skip,
      limit
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error fetching category" });
  }
};
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user?.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product." });
    }

    const review = {
      name: req.user.name, 
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    
    res.status(201).json({ message: "Review added successfully!" });

  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({ message: "Server error saving review" });
  }
};
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).json({ message: "Server error fetching product" });
  }
};
const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }
    const { title, price, description, category, stock } = req.body;
    const streamUpload = (req) => {
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
        stream.end(req.file.buffer); 
      });
    };

    console.log("Uploading product image to Cloudinary...");
    const result = await streamUpload(req);
    console.log("✅ Cloudinary Success:", result.secure_url);

    const product = new Product({
      user: req.user._id,
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
    
    res.status(201).json(createdProduct);

  } catch (error) {
    console.error("🚨 Create Product Error:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 }); 
    res.json(products);
  } catch (error) {
    console.error("Fetch seller products error:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only delete your own products!" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error deleting product" });
  }
};
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(products);
  } catch (error) {
    console.error("Fetch all products error:", error);
    res.status(500).json({ message: "Server error fetching global inventory" });
  }
};
module.exports = { getProducts, getProductsByCategory, getSingleProduct, createProductReview, createProduct, getSellerProducts, deleteProduct,getAdminProducts };