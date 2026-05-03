import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import CategoryPage from './CategoryPage';
import Header from '../Landing page/Navbar';
import Footer from '../Landing page/Footer';
import ProductDetails from './Productdetails';
import ProtectedRoute from '../Landing page/Protectroutes';
import { CartProvider } from './CartContext';
import Deals from '../Landing page/Deals';
import StaticPage from '../Landing page/Staticpage';
import New from '../Landing page/What\'s New';
import Signup from './Signup';
import Login from './Login';
import Account from '../Landing page/Account';
import { AuthProvider } from './AuthContext';
import Cart from '../Landing page/Cart';
import Checkout from '../Landing page/Checkout';
import ResetPassword from './ResetPassword';
import ForgotPassword from './Forgotpassword';
import Favorites from '../Landing page/Favorites';
import { FavoritesProvider } from './FavoritesContext';
import Seller from '../Landing page/Seller';
import AdminDashboard from './AdminDashboard';
import ProductManager from './ProductManager';
function App() {
  return (
  <AuthProvider>
  <CartProvider>
    <FavoritesProvider>
    <Router> 
      <Header />
      
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/delivery" element={<StaticPage title="Delivery Information" content="All orders are processed within 2-3 business days..." image='https://tse1.mm.bing.net/th/id/OIP.hS0QWmDOpc_2-dEHfLm3TwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'/>}/>
          <Route path="/new" element={<New />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/products/all" element={<CategoryPage isAll={true} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
  <ProtectedRoute>
    <Checkout />
  </ProtectedRoute>
} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/seller-dashboard" element={<Seller />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductManager />} />
        </Routes>
      </main>

      <Footer />
    </Router>
    </FavoritesProvider>
    </CartProvider> 
    </AuthProvider>
    
  
  );
}
export default App;
//Filler smh