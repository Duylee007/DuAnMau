import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  Shield,
  LogOut,
  ArrowLeft,
  ChevronDown,
  MapPin,
  Flame,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Header({
  cartCount,
  onOpenCart,
  onOpenAuth,
  user,
  onLogout,
  adminUser,
  onLogoutAdmin,
  isAdminView,
  onOpenAdmin,
  onBackToShop,
  searchTerm,
  onSearchChange,
  isAboutView,
  onOpenAbout,
  onSelectMenuItem
}) {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'products' | 'denim' | 'collection' | null
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const handleMouseEnter = (menuName) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  const handleItemClick = (filterConfig) => {
    setActiveDropdown(null);
    if (onSelectMenuItem) {
      onSelectMenuItem(filterConfig);
    }
  };

  return (
    <>
      {/* Top Announcement Bar - Icon Denim Style */}
      <div className="top-announcement-bar">
        <Flame size={14} color="#f59e0b" />
        <span>
          MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN TỪ <strong>499.000Đ</strong> • ĐỔI HÀNG DỄ DÀNG 15 NGÀY • <strong>ENJOY LIFE</strong>
        </span>
      </div>

      <header
        className="header-glass"
        onMouseLeave={handleMouseLeave}
      >
        <div className="nav-container">
          {/* Logo Brand - Stylized like Icon Denim */}
          <div
            onClick={onBackToShop}
            className="logo-brand"
            style={{ cursor: 'pointer' }}
            title="Về trang chủ cửa hàng"
          >
            <div className="logo-icon-wrap">
              <ShoppingBag size={20} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <div style={{ fontSize: '1.32rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                <span>DUY</span>
                <span style={{ color: '#1d4ed8' }}>DENIM</span>
              </div>
              <span style={{ fontSize: '0.62rem', letterSpacing: '1.5px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>
                Enjoy Life
              </span>
            </div>
          </div>

          {/* MAIN NAVIGATION BAR (MEGA MENU BAR) */}
          {!isAdminView ? (
            <nav className="nav-menu-wrapper">
              {/* 1. SẢN PHẨM (MEGA MENU TRIGGER) */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter('products')}
              >
                <button
                  type="button"
                  className={`nav-link-btn has-dropdown ${activeDropdown === 'products' ? 'is-open active' : ''}`}
                  onClick={() => setActiveDropdown(activeDropdown === 'products' ? null : 'products')}
                >
                  Sản phẩm <ChevronDown size={14} />
                </button>
              </div>

              {/* 2. HÀNG MỚI (WITH RED 'NEW' BADGE) */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="nav-link-btn"
                  onClick={() => handleItemClick({ sort: 'latest' })}
                >
                  Hàng Mới
                  <span className="badge-new-tag">New</span>
                </button>
              </div>

              {/* 3. HÀNG BÁN CHẠY */}
              <div>
                <button
                  type="button"
                  className="nav-link-btn"
                  onClick={() => handleItemClick({ featured: true })}
                >
                  Hàng Bán Chạy
                </button>
              </div>

              {/* 4. DENIM DROPDOWN */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter('denim')}
              >
                <button
                  type="button"
                  className={`nav-link-btn has-dropdown ${activeDropdown === 'denim' ? 'is-open active' : ''}`}
                  onClick={() => setActiveDropdown(activeDropdown === 'denim' ? null : 'denim')}
                >
                  DENIM <ChevronDown size={14} />
                </button>

                {/* Mini Dropdown for DENIM */}
                {activeDropdown === 'denim' && (
                  <div className="mini-dropdown-menu" onMouseEnter={() => handleMouseEnter('denim')}>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'Jean' })}>
                      <span>Quần Jeans Nam Smart Jeans™</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'Lightweight' })}>
                      <span>Quần Jean ICON105 Lightweight™</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'Áo Khoác Denim' })}>
                      <span>Áo Khoác Denim Trucker</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'Sơ Mi Denim' })}>
                      <span>Áo Sơ Mi Denim Stonewash</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'Short Jean' })}>
                      <span>Quần Short Denim Rách Gấu</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. SALE 11-11 / OUTLET (RED) */}
              <div>
                <button
                  type="button"
                  className="nav-link-btn nav-link-sale"
                  onClick={() => handleItemClick({ discount: true })}
                >
                  SALE 11-11
                </button>
              </div>

              {/* 6. COLLECTION DROPDOWN */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter('collection')}
              >
                <button
                  type="button"
                  className={`nav-link-btn has-dropdown ${activeDropdown === 'collection' ? 'is-open active' : ''}`}
                  onClick={() => setActiveDropdown(activeDropdown === 'collection' ? null : 'collection')}
                >
                  Collection <ChevronDown size={14} />
                </button>

                {/* Mini Dropdown for COLLECTION */}
                {activeDropdown === 'collection' && (
                  <div className="mini-dropdown-menu" onMouseEnter={() => handleMouseEnter('collection')}>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'ProCOOL' })}>
                      <span>Sportcation Collection (ProCOOL++)</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'Marvel' })}>
                      <span>Marvel Collection (Spider-Man)</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'Disney' })}>
                      <span>Disney Mickey & Friends Collection</span>
                      <ArrowRight size={14} />
                    </div>
                    <div className="mini-dropdown-item" onClick={() => handleItemClick({ search: 'Enjoy Life' })}>
                      <span>Signature "Enjoy Life" Collection</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                )}
              </div>

              {/* 7. GIỚI THIỆU */}
              <div>
                <button
                  type="button"
                  className={`nav-link-btn ${isAboutView ? 'active' : ''}`}
                  onClick={onOpenAbout}
                >
                  Giới thiệu
                </button>
              </div>
            </nav>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#0f172a',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: '#f1f5f9',
                padding: '0.45rem 1.15rem',
                borderRadius: '999px',
                border: '1px solid #cbd5e1'
              }}
            >
              <Shield size={16} color="#1d4ed8" /> Cổng Quản Trị Hệ Thống (Admin Portal)
            </div>
          )}

          {/* RIGHT ACTIONS */}
          <div className="nav-actions">
            {/* Search Toggle / Bar */}
            {!isAdminView && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {isSearchExpanded ? (
                  <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '999px', padding: '0.2rem 0.5rem 0.2rem 1rem', border: '1px solid #cbd5e1' }}>
                    <Search size={16} color="#64748b" style={{ marginRight: 6 }} />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Tìm sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem', width: '160px', color: '#0f172a' }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchExpanded(false)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 2, display: 'flex', color: '#64748b' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-icon"
                    onClick={() => setIsSearchExpanded(true)}
                    title="Tìm kiếm sản phẩm"
                  >
                    <Search size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Store Location Icon */}
            {!isAdminView && (
              <button
                className="btn-icon"
                onClick={onOpenAbout}
                title="Hệ thống cửa hàng DUYDENIM"
              >
                <MapPin size={18} />
              </button>
            )}

            {/* Nút "Xem Cửa Hàng" chỉ hiện khi đang trong Admin View */}
            {isAdminView && (
              <button
                className="btn-outline"
                onClick={onBackToShop}
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
              >
                <ArrowLeft size={16} /> Xem Cửa Hàng
              </button>
            )}

            {/* Admin User Info when in Admin View */}
            {isAdminView && adminUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <Shield size={14} color="#1d4ed8" />
                  <span>{adminUser.ten_hien_thi || adminUser.username}</span>
                </div>
                <button
                  className="btn-icon"
                  onClick={onLogoutAdmin}
                  title="Đăng xuất Quản trị"
                  style={{ width: 38, height: 38, color: '#dc2626' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : null}

            {/* Customer User Account (Shop View) */}
            {!isAdminView && (
              <>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <User size={15} color="#1d4ed8" />
                      <span>{user.ten_khachhang || user.email}</span>
                    </div>
                    <button
                      className="btn-icon"
                      onClick={onLogout}
                      title="Đăng xuất"
                      style={{ width: 38, height: 38, color: '#dc2626' }}
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button className="btn-icon" onClick={onOpenAuth} title="Tài khoản khách hàng">
                    <User size={18} />
                  </button>
                )}

                {/* Cart Icon */}
                <button className="btn-icon" onClick={onOpenCart} title="Xem giỏ hàng">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && <span className="cart-counter">{cartCount}</span>}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========================================================
            FULL-WIDTH MEGA MENU (EXACTLY AS SCREENSHOT FROM USER)
            ======================================================== */}
        {activeDropdown === 'products' && (
          <div
            className="mega-menu-overlay"
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="mega-menu-grid">
              {/* CỘT 1: TẤT CẢ SẢN PHẨM */}
              <div>
                <span className="mega-col-heading">TẤT CẢ SẢN PHẨM</span>
                <ul className="mega-items-list">
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ sort: 'latest' })}>
                      Sản Phẩm Mới
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ featured: true })}>
                      Bán Chạy Nhất
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link highlight-red" onClick={() => handleItemClick({ discount: true })}>
                      OUTLET - Sale Up To 50%
                    </span>
                  </li>
                </ul>
              </div>

              {/* CỘT 2: ÁO NAM */}
              <div>
                <span className="mega-col-heading">ÁO NAM</span>
                <ul className="mega-items-list">
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Áo Thun' })}>
                      Áo Thun
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Polo' })}>
                      Áo Polo
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Sơ Mi' })}>
                      Áo Sơmi
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Áo Khoác' })}>
                      Áo Khoác
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Nỉ' })}>
                      Áo Nỉ Và Len
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Hoodie' })}>
                      Hoodie
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Tank Top' })}>
                      Tank Top - Áo Ba Lỗ
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Set' })}>
                      Set Đồ
                    </span>
                  </li>
                </ul>
              </div>

              {/* CỘT 3: QUẦN NAM */}
              <div>
                <span className="mega-col-heading">QUẦN NAM</span>
                <ul className="mega-items-list">
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Jean' })}>
                      Quần Jean
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Short' })}>
                      Quần Short
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Kaki' })}>
                      Quần Kaki & Chino
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Jogger' })}>
                      Quần Jogger - Quần Dài
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Quần Tây' })}>
                      Quần Tây
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Boxer' })}>
                      Quần Boxer
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Set' })}>
                      Set Đồ
                    </span>
                  </li>
                </ul>
              </div>

              {/* CỘT 4: GIÀY & PHỤ KIỆN */}
              <div>
                <span className="mega-col-heading">GIÀY & PHỤ KIỆN</span>
                <ul className="mega-items-list">
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Giày' })}>
                      Giày & Dép
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Ví' })}>
                      Balo, Túi & Ví
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Nón' })}>
                      Nón
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Thắt Lưng' })}>
                      Thắt Lưng
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Vớ' })}>
                      Vớ
                    </span>
                  </li>
                  <li>
                    <span className="mega-item-link" onClick={() => handleItemClick({ search: 'Kính' })}>
                      Mắt Kính
                    </span>
                  </li>
                </ul>
              </div>

              {/* CỘT 5: 2 CARDS HÌNH ẢNH BỘ SƯU TẬP (GIỐNG HỆT ẢNH CHỤP) */}
              <div className="mega-promo-column">
                {/* Banner 1: SPORTCATION COLLECTION */}
                <div
                  className="mega-promo-card"
                  onClick={() => handleItemClick({ search: 'ProCOOL' })}
                >
                  <img
                    src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&h=300&fit=crop"
                    alt="Sportcation Collection - The Chiller The Cheerier"
                    className="mega-promo-img"
                  />
                  <div className="mega-promo-caption">
                    <div className="mega-promo-title">SPORTCATION COLLECTION</div>
                    <div className="mega-promo-subtitle">THE CHILLER THE CHEERIER • PROCOOL++</div>
                  </div>
                </div>

                {/* Banner 2: MARVEL COLLECTION - SPIDER-MAN */}
                <div
                  className="mega-promo-card"
                  onClick={() => handleItemClick({ search: 'Marvel' })}
                >
                  <img
                    src="https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=300&fit=crop"
                    alt="Marvel Collection - Spider-Man (Same Hero)"
                    className="mega-promo-img"
                  />
                  <div className="mega-promo-caption">
                    <div className="mega-promo-title">MARVEL COLLECTION - SPIDER-MAN</div>
                    <div className="mega-promo-subtitle">SAME HERO • FIRST TIME TEAM UP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
