import mongoose, { Document, Schema } from 'mongoose';
export interface IReview {
  user?: mongoose.Types.ObjectId; 
  name?: string;
  rating: number;
  comment: string;
}

export interface IProduct extends Document {
  user?: mongoose.Types.ObjectId;
  title: string;
  thumbnail: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  discountPercentage: number;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  sold:number
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
    },
    name: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const productSchema = new Schema<IProduct>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sold: {
    type: Number,
    required: true,
    default: 0,
  },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;