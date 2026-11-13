import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import { Filter, SlidersHorizontal, Check, Truck, RefreshCw, ShieldCheck, Headphones, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  // Products and Categories State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isDiscountOnly, setIsDiscountOnly] = useState(false);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shopao_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer Auth State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('shopao_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Admin Auth State (Completely separated from customer login)
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const savedAdmin = localStorage.getItem('shopao_admin_user');
      return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch {
      return null;
    }
  });

  // View States dựa trên URL pathname (không dùng hash nữa)
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  const isAdminView = currentPath === '/admin';
  const isAboutView = currentPath === '/about';

  // Lắng nghe thay đổi URL (nút Back/Forward của trình duyệt)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const productsRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Hàm điều hướng bằng pathname (chuẩn SPA)
  const navigate = (path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => navigate('/admin');
  const handleOpenAbout = () => navigate('/about');
  const handleBackToShop = () => navigate('/');

  const handleExploreProducts = () => {
    handleBackToShop();
    setTimeout(() => {
      scrollToProducts();
    }, 100);
  };

  const handleSelectMenuItem = (config) => {
    if (!config) return;

    if (config.view === 'about') {
      handleOpenAbout();
      return;
    }
    if (config.view === 'admin') {
      handleOpenAdmin();
      return;
    }

    // Return to shop view
    handleBackToShop();

    if (config.category !== undefined) {
      setActiveCategory(String(config.category));
      setSearchTerm('');
      setIsDiscountOnly(false);
      setIsFeaturedOnly(false);
    } else if (config.search !== undefined) {
      setSearchTerm(config.search);
      setActiveCategory('all');
      setIsDiscountOnly(false);
      setIsFeaturedOnly(false);
    } else if (config.discount) {
      setIsDiscountOnly(true);
      setIsFeaturedOnly(false);
      setActiveCategory('all');
      setSearchTerm('');
    } else if (config.featured) {
      setIsFeaturedOnly(true);
      setIsDiscountOnly(false);
      setActiveCategory('all');
      setSearchTerm('');
    } else if (config.sort) {
      setSortBy(config.sort);
      setIsDiscountOnly(false);
      setIsFeaturedOnly(false);
      setActiveCategory('all');
      setSearchTerm('');
    }

    setTimeout(() => {
      scrollToProducts();
    }, 120);
  };

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('shopao_cart', JSON.stringify(cart));
  }, [cart]);

  // Load Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Load Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?limit=100&sort=${sortBy}`;
      if (activeCategory !== 'all') {
        url += `&category=${activeCategory}`;
      }
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      if (isDiscountOnly) {
        url += `&discount=true`;
      }
      if (isFeaturedOnly) {
        url += `&featured=true`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchTerm, sortBy, isDiscountOnly, isFeaturedOnly]);

  // Cart actions
  const handleAddToCart = (product, size = 'M', quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (it) => it.id_hanghoa === product.id_hanghoa && it.size === size
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += quantity;
        return nextCart;
      } else {
        return [
          ...prev,
          {
            ...product,
            size,
            quantity
          }
        ];
      }
    });
    showToast(`Đã thêm "${product.ten_hanghoa}" (Size ${size}) vào giỏ!`);
  };

  const handleUpdateQty = (id, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id, size);
      return;
    }
    setCart((prev) =>
      prev.map((it) =>
        it.id_hanghoa === id && it.size === size ? { ...it, quantity: newQty } : it
      )
    );
  };

  const handleRemoveItem = (id, size) => {
    setCart((prev) => prev.filter((it) => !(it.id_hanghoa === id && it.size === size)));
    showToast('Đã xóa món khỏi giỏ hàng');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Customer Auth actions
  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('shopao_user', JSON.stringify(userData));
    localStorage.setItem('shopao_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shopao_user');
    showToast('Đã đăng xuất tài khoản khách hàng');
  };

  // Admin Auth actions
  const handleAdminLoginSuccess = (adminData, token) => {
    setAdminUser(adminData);
    localStorage.setItem('shopao_admin_user', JSON.stringify(adminData));
    localStorage.setItem('shopao_admin_token', token);
    localStorage.setItem('shopao_token', token);
    setIsAdminView(true);
  };

  const handleLogoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('shopao_admin_user');
    localStorage.removeItem('shopao_admin_token');
    showToast('Đã đăng xuất tài khoản Quản trị');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notice">
          <Check size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
        adminUser={adminUser}
        onLogoutAdmin={handleLogoutAdmin}
        isAdminView={isAdminView}
        onOpenAdmin={handleOpenAdmin}
        onBackToShop={handleBackToShop}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isAboutView={isAboutView}
        onOpenAbout={handleOpenAbout}
        onExploreProducts={handleExploreProducts}
        onSelectMenuItem={handleSelectMenuItem}
      />

      {/* VIEW SWITCH: ADMIN vs ABOUT vs SHOP */}
      {isAdminView ? (
        adminUser ? (
          <AdminDashboard
            onBackToShop={handleBackToShop}
            showToast={showToast}
            adminUser={adminUser}
            onLogoutAdmin={handleLogoutAdmin}
          />
        ) : (
          <AdminLogin
            onAdminLoginSuccess={handleAdminLoginSuccess}
            onBackToShop={handleBackToShop}
            showToast={showToast}
          />
        )
      ) : isAboutView ? (
        <AboutUs onBackToShop={handleBackToShop} />
      ) : (
        <main className="main-content">
          {/* Hero Section */}
          <HeroBanner onExplore={scrollToProducts} />

          {/* Brand Commitments Bar - 4 Golden Service Promises */}
          <div className="brand-commitments-bar">
            <div className="commitment-item">
              <div className="commitment-icon-wrap">
                <Truck size={22} color="#1d4ed8" />
              </div>
              <div>
                <div className="commitment-title">Miễn phí giao hàng</div>
                <div className="commitment-desc">Toàn quốc cho đơn từ 499K</div>
              </div>
            </div>

            <div className="commitment-item">
              <div className="commitment-icon-wrap">
                <RefreshCw size={22} color="#d97706" />
              </div>
              <div>
                <div className="commitment-title">Đổi hàng trong 15 ngày</div>
                <div className="commitment-desc">Đổi tận nơi nhanh chóng, dễ dàng</div>
              </div>
            </div>

            <div className="commitment-item">
              <div className="commitment-icon-wrap">
                <ShieldCheck size={22} color="#059669" />
              </div>
              <div>
                <div className="commitment-title">100% Chính hãng</div>
                <div className="commitment-desc">Chất lượng sợi Compact cao cấp</div>
              </div>
            </div>

            <div className="commitment-item">
              <div className="commitment-icon-wrap">
                <Headphones size={22} color="#0f172a" />
              </div>
              <div>
                <div className="commitment-title">Hỗ trợ tư vấn 24/7</div>
                <div className="commitment-desc">Hotline chọn size: 1900 8888</div>
              </div>
            </div>
          </div>

          {/* Catalog Section */}
          <div ref={productsRef}>
            {/* Category Filter Chips */}
            <div className="category-chips">
              <button
                className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                Tất cả sản phẩm
              </button>
              {categories.map((c) => (
                <button
                  key={c.id_loai}
                  className={`category-chip ${activeCategory === String(c.id_loai) ? 'active' : ''}`}
                  onClick={() => setActiveCategory(String(c.id_loai))}
                >
                  {c.ten_loai} ({c.so_san_pham})
                </button>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="filter-toolbar">
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Hiển thị <strong style={{ color: '#0f172a' }}>{products.length}</strong> sản phẩm thời trang
                {searchTerm && ` cho từ khóa "${searchTerm}"`}
                {isDiscountOnly && <span style={{ color: '#dc2626', fontWeight: 700, marginLeft: 6 }}>• Đang lọc: Khuyến Mãi Giảm Giá</span>}
                {isFeaturedOnly && <span style={{ color: '#1d4ed8', fontWeight: 700, marginLeft: 6 }}>• Đang lọc: Bán Chạy Nhất</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {(searchTerm || isDiscountOnly || isFeaturedOnly || activeCategory !== 'all') && (
                  <button
                    className="btn-outline"
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchTerm('');
                      setIsDiscountOnly(false);
                      setIsFeaturedOnly(false);
                    }}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    Bỏ lọc
                  </button>
                )}
                <SlidersHorizontal size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Sắp xếp:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.88rem', background: '#f8fafc' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Mới nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                Đang tải danh sách sản phẩm...
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '1.05rem' }}>
                  Không tìm thấy sản phẩm nào phù hợp!
                </p>
                <button
                  className="btn-outline"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchTerm('');
                    setIsDiscountOnly(false);
                    setIsFeaturedOnly(false);
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard
                    key={p.id_hanghoa}
                    product={p}
                    onAddToCart={handleAddToCart}
                    onOpenDetail={(prod) => setSelectedProduct(prod)}
                  />
                ))}
              </div>
            )}

            {/* About Brand Teaser on Home Page */}
            <div
              style={{
                marginTop: '4.5rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '3rem 2.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    marginBottom: '1rem'
                  }}
                >
                  <Sparkles size={12} color="#f59e0b" /> VỀ THƯƠNG HIỆU DUYDENIM
                </span>
                <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.3 }}>
                  Thời Trang Để Tận Hưởng Cuộc Sống <br />
                  <span style={{ color: '#1d4ed8' }}>Tự Tin & Phong Cách</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  DUYDENIM là thương hiệu thời trang nam ứng dụng hàng đầu, tiên phong trong công nghệ vải Smart Jeans™ co giãn 4 chiều và chất dệt ProCOOL++ siêu thoáng mát. Mỗi thiết kế đều chuẩn form dáng nam giới Việt, mang lại sự chỉn chu và thoải mái vượt trội.
                </p>
                <button
                  className="btn-primary"
                  onClick={handleOpenAbout}
                  style={{ padding: '0.75rem 1.4rem' }}
                >
                  Tìm hiểu câu chuyện thương hiệu <ArrowRight size={16} />
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&h=500&fit=crop"
                  alt="DUYDENIM Workshop"
                  style={{
                    width: '100%',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    maxHeight: '320px',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.08)'
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <Footer onOpenAdmin={handleOpenAdmin} onOpenAbout={handleOpenAbout} />

      {/* MODALS */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        user={user}
        showToast={showToast}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />
    </div>
  );
}
