import React from 'react';
import { ShoppingBag, Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';

export default function Footer({ onOpenAbout }) {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 60%, #172554 100%)',
        color: '#ffffff',
        borderTop: '1px solid #1d4ed8',
        padding: '3.5rem 1.5rem 2rem',
        marginTop: 'auto',
        boxShadow: '0 -4px 20px rgba(30, 64, 175, 0.15)'
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Brand Info */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1rem',
              fontSize: '1.35rem',
              fontWeight: 900
            }}
          >
            <div
              className="logo-icon-wrap"
              style={{
                width: 36,
                height: 36,
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <ShoppingBag size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ color: '#ffffff' }}>DUY</span>
              <span style={{ color: '#93c5fd' }}>DENIM</span>
            </div>
          </div>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '0.88rem',
              lineHeight: 1.65,
              marginBottom: '1.25rem'
            }}
          >
            Thương hiệu thời trang nam hiện đại, năng động và cao cấp. Khẳng định phong cách với các
            dòng Smart Jeans™, ProCOOL++™ và 100% Cotton Compact.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              color: '#e2e8f0',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <MapPin size={16} color="#93c5fd" /> Trụ sở: 261 Quang Trung, Gò Vấp, TP.HCM
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Phone size={16} color="#fca5a5" /> Hotline đặt hàng:{' '}
              <strong style={{ color: '#ffffff' }}>1900 8888</strong> (8:30 - 22:00)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Mail size={16} color="#86efac" /> Email: cskh@duydenim.vn
            </div>
          </div>
        </div>

        {/* Store Locations */}
        <div>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1.15rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Hệ thống cửa hàng
          </h4>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#cbd5e1',
              fontSize: '0.88rem',
              lineHeight: 2.1
            }}
          >
            <li>• Chi nhánh 1: 261 Quang Trung, P.10, Q. Gò Vấp, TP.HCM</li>
            <li>• Chi nhánh 2: 12 Hàng Gai, Q. Hoàn Kiếm, Hà Nội</li>
            <li>• Chi nhánh 3: 45 Lê Duẩn, Q. Hải Châu, Đà Nẵng</li>
            <li>• Chi nhánh 4: Aeon Mall Tân Phú, TP.HCM</li>
            <li style={{ color: '#93c5fd', fontWeight: 600 }}>
              • Giờ mở cửa: 08:30 – 22:00 (Tất cả các ngày)
            </li>
          </ul>
        </div>

        {/* Policies & Links */}
        <div>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1.15rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Thông tin & Hỗ trợ
          </h4>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#cbd5e1',
              fontSize: '0.88rem',
              lineHeight: 2.1
            }}
          >
            {onOpenAbout && (
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#93c5fd',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Sparkles size={14} color="#fde047" /> Về thương hiệu DUYDENIM (Giới thiệu)
                </button>
              </li>
            )}
            <li>Chính sách đổi trả trong 15 ngày tận nhà</li>
            <li>Bảng hướng dẫn chọn size chuẩn xác</li>
            <li>Chính sách bảo mật thông tin khách hàng</li>
            <li>Chính sách khách hàng thân thiết (VIP Club)</li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1.15rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Đăng ký nhận ưu đãi
          </h4>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '0.88rem',
              marginBottom: '1rem',
              lineHeight: 1.5
            }}
          >
            Nhập email để nhận ngay voucher giảm <strong style={{ color: '#fde047' }}>50.000đ</strong>{' '}
            và thông tin bộ sưu tập mới nhất!
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              style={{
                flex: 1,
                padding: '0.7rem 0.95rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                background: 'rgba(255, 255, 255, 0.1)',
                fontSize: '0.88rem',
                outline: 'none',
                color: '#ffffff'
              }}
            />
            <button
              type="button"
              style={{
                padding: '0.7rem 1.1rem',
                background: '#ffffff',
                color: '#1e40af',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              title="Đăng ký nhận tin"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#93c5fd';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#1e40af';
              }}
            >
              <Send size={16} />
            </button>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
            ✓ Cam kết không spam thông tin của khách hàng.
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          paddingTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: '#94a3b8',
          maxWidth: '1300px',
          margin: '0 auto'
        }}
      >
        © 2026 DUYDENIM (DuyShirt). Thương hiệu thời trang nam phong cách hiện đại. Enjoy Life.
      </div>
    </footer>
  );
}
