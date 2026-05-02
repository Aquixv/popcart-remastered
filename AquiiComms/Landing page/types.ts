export type Product = {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  description: string;
  rating: number;
  stock: number;
};
export type UserRole = 'customer' | 'seller' | 'admin';

export type UserProfile = {
  name: string;
  email: string;
  role: UserRole;
};
export type UserInfo = {
  token: string;
  avatar?: string;
};
export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  image: string; 
};

export type Order = {
  _id: string;
  createdAt: string; 
  totalPrice: number;
  isPaid: boolean;
  orderItems: OrderItem[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};
export type CartData = {
  items: CartItem[];
};
export type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};