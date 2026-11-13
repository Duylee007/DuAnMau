import React from 'react';
import { Sparkles, ArrowRight, Truck, ShieldCheck, RefreshCw, Star, Tag } from 'lucide-react';

export default function HeroBanner({ onExplore }) {
  return (
    <div className="hero-banner">
      <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
        <span className="hero-tag">
          <Sparkles size={13} style={{ display: 'inline', marginRight: 5 }} />
          ENJOY LIFE • BỘ SƯU TẬP 2026
        </span>
        <h1 className="hero-title">
          Thời Trang Trẻ Trung <br />
          <span style={{ color: '#0f172a' }}>Phong Cách Bứt Phá</span>
        </h1>
        <p className="hero-desc">
          Trải nghiệm trang phục cao cấp từ chất liệu 100% Cotton Compact & công nghệ dệt ProCOOL++ siêu thoáng mát. Thiết kế đa dạng từ streetwear cá tính đến phong cách smart-casual lịch lãm.
        </p>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onExplore}>
            Mua sắm ngay <ArrowRight size={17} />
          </button>
          <button
            className="btn-outline"
            onClick={onExplore}
            style={{ background: '#ffffff', borderColor: '#cbd5e1' }}
          >
            <Tag size={16} /> Xem ưu đãi Outlet
          </button>
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Truck size={17} color="#1d4ed8" /> Giao hàng hỏa tốc
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <ShieldCheck size={17} color="#059669" /> 100% Cotton tự nhiên
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <RefreshCw size={17} color="#d97706" /> Đổi trả trong 15 ngày
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Star size={17} color="#f59e0b" /> Form chuẩn người Việt
          </div>
        </div>
      </div>

      {/* Visual Image Lookbook - Icon Denim Fashion */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          minWidth: '320px',
          maxWidth: '420px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=650&h=650&fit=crop"
            alt="DuyDenim Lookbook Collection"
            style={{
              width: '100%',
              maxHeight: '400px',
              borderRadius: '20px',
              boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.15)',
              objectFit: 'cover',
              border: '4px solid #ffffff'
            }}
          />
          {/* Floating Pill Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#0f172a',
              border: '1px solid #e2e8f0'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }}></span>
            New Arrival 2026 • Hot Deals
          </div>
        </div>
      </div>
    </div>
  );
}
