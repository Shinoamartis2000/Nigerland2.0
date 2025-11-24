import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import TaxConferencePage from "./pages/TaxConferencePage";
import Conferences2026Page from "./pages/Conferences2026Page";
import AboutPage from "./pages/AboutPage";
import BooksPageEnhanced from "./pages/BooksPageEnhanced";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import MoreLifePage from "./pages/MoreLifePage";
import TrainingPage from "./pages/TrainingPage";
import TrainingEnrollPage from "./pages/TrainingEnrollPage";
import AdminDashboardAdvanced from "./pages/AdminDashboardAdvanced";
import AdminDashboardNew from "./pages/AdminDashboardNew";
import LiveChat from "./components/LiveChat";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { Toaster } from "./components/ui/toaster";

// Layout wrapper for pages with header and footer
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/morelife" element={<Layout><MoreLifePage /></Layout>} />
          <Route path="/training" element={<Layout><TrainingPage /></Layout>} />
          <Route path="/training/enroll/:category" element={<Layout><TrainingEnrollPage /></Layout>} />
          <Route path="/tax-conference" element={<Layout><TaxConferencePage /></Layout>} />
          <Route path="/conferences-2026" element={<Layout><Conferences2026Page /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/books" element={<Layout><BooksPageEnhanced /></Layout>} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          
          {/* Admin Routes without Layout */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardNew />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <LiveChat />
    </div>
  );
}

export default App;
