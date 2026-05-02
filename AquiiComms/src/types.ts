export type Product = {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  description?: string; // The ? makes it optional since some might not have one
  discountPercentage?: number;
  rating: number;
  stock: number;
};