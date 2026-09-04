import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import Contact from '../pages/Contact';
import TearmsCondition from '../pages/TearmsCondition';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import About from '../pages/About';
import Cart from '../customer/components/Cart/Cart';
import Navigation from '../customer/components/Navbar/Navigation';
import Footer from '../customer/components/footer/Footer';
import Product from '../customer/components/Product/Product/Product';
import ProductDetails from '../customer/components/Product/ProductDetails/ProductDetails';
import Checkout from '../customer/components/Checkout/Checkout';
import Order from '../customer/components/orders/Order';
import OrderDetails from '../customer/components/orders/OrderDetails';
import PaymentSuccess from '../customer/components/paymentSuccess/PaymentSuccess';
import RateProduct from '../customer/components/ReviewProduct/RateProduct';
import CategoryProducts from '../customer/components/Category/CategoryProducts';


const CustomerRoutes = () => {
  return (
    <div>
      <div>
        <Navigation />
      </div>
      <Routes>
        <Route path="/login" element={<Homepage />} />
        <Route path="/register" element={<Homepage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-condition" element={<TearmsCondition />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/:lavelOne/:lavelTwo/:lavelThree" element={<Product />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account/order" element={<Order />} />
        <Route path="/account/order/:orderId" element={<OrderDetails />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        
        {/* FLUTTERWAVE CALLBACK & PAYMENT SUCCESS ROUTES */}
        <Route path="/payment/callback" element={<PaymentSuccess />} />
        <Route path="/payment/:orderId" element={<PaymentSuccess />} />
        
        <Route path="/rate/:productId" element={<RateProduct />} />
      </Routes>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default CustomerRoutes;