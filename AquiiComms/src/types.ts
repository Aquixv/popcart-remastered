export type Product = {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  description: string;
  rating: number;
  stock: number;
  brand?: string; 
  user?: UserProfile | null;
  reviews?: Review[];
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
export type CartContextType = {
  cart: CartData;
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
};
export type AuthContextType = {
  user: UserInfo | null;
  login: (userData: UserInfo) => void;
  logout: () => void;
};
export type FavoritesContextType = {
  favorites: string[]; 
  toggleFavorite: (productId: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
};
export type Review = {
  _id?: string;
  name?: string;
  reviewerName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  date?: string;
};