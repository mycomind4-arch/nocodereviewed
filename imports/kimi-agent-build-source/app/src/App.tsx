import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import ToolsPage from '@/pages/ToolsPage';
import ToolDetailPage from '@/pages/ToolDetailPage';
import ComparePage from '@/pages/ComparePage';
import ComparisonDetailPage from '@/pages/ComparisonDetailPage';
import CategoryPage from '@/pages/CategoryPage';
import BlogPage from '@/pages/BlogPage';
import ArticlePage from '@/pages/ArticlePage';
import SubmitPage from '@/pages/SubmitPage';
import AdvertisePage from '@/pages/AdvertisePage';
import NewsletterPage from '@/pages/NewsletterPage';
import AboutPage from '@/pages/AboutPage';
import AdminPage from '@/pages/AdminPage';

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#012A38]">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/tools" element={<Layout><ToolsPage /></Layout>} />
        <Route path="/tools/:slug" element={<Layout><ToolDetailPage /></Layout>} />
        <Route path="/compare" element={<Layout><ComparePage /></Layout>} />
        <Route path="/compare/:slug" element={<Layout><ComparisonDetailPage /></Layout>} />
        <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><ArticlePage /></Layout>} />
        <Route path="/submit" element={<Layout><SubmitPage /></Layout>} />
        <Route path="/advertise" element={<Layout><AdvertisePage /></Layout>} />
        <Route path="/newsletter" element={<Layout><NewsletterPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  );
}
