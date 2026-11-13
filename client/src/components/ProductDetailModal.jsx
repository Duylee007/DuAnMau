import React, { useState, useEffect } from 'react';
import {
  X, ShoppingBag, Truck, RefreshCw, ShieldCheck, Star,
  ChevronLeft, ChevronRight, Minus, Plus, Heart, Share2, Tag
} from 'lucide-react';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

const SIZE_GUIDE = {
  S:   { chest: '86-90', waist: '70-74', height: '155-160' },
  M:   { chest: '90-94', waist: '74-78', height: '160-165' },
  L:   { chest: '94-98', waist: '78-82', height: '165-170' },
  XL:  { chest: '98-102', waist: '82-86', height: '170-175' },
  '2XL': { chest: '102-108', waist: '86-92', height: '175-180' },
  '3XL': { chest: '108-116', waist: '92-100', height: '178-183' },
};

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc' | 'material' | 'care'

  // Ngăn scroll body khi modal mở
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!product) return null;

  const hasDiscount = product.gia_khuyen_mai > 0 && product.gia_khuyen_mai < product.gia;
  const currentPrice = hasDiscount ? product.gia_khuyen_mai : product.gia;
  const discountPct = hasDiscount
    ? Math.round((1 - product.gia_khuyen_mai / product.gia) * 100)
    : 0;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, qty);
    setAddedAnim(true);
    setTimeout(() => { setAddedAnim(false); onClose(); }, 900);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        display: 'flex', alignItems: 'flex-end',
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      {/* Drawer trượt từ dưới lên trên desktop, full màn hình mobile */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '24px 24px 0 0',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 -20px 60px -10px rgba(15,23,42,0.18)',
          position: 'relative',
          animation: 'slideUpModal 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <style>{`
          @keyframes slideUpModal {
            from { transform: translateY(60px); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.1rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          position: 'sticky', top: 0, background: '#fff', zIndex: 10,
          borderRadius: '24px 24px 0 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.6px',
              textTransform: 'uppercase', color: '#1d4ed8',
              background: '#eff6ff', padding: '0.25rem 0.65rem', borderRadius: '999px',
              border: '1px solid #bfdbfe'
            }}>
              {product.ten_loai || 'DUYDENIM'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid #e2e8f0', background: '#f8fafc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#475569', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#0f172a'; e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.color='#475569'; }}
          >
            <X size={17} />
          </button>
        </div>

        {/* ── BODY: 2 CỘT ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
          gap: 0,
          minHeight: '500px',
        }}>

          {/* CỘT TRÁI: Hình ảnh */}
          <div style={{ padding: '1.5rem', background: '#f8fafc', position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
              <img
                src={product.hinh_anh}
                alt={product.ten_hanghoa}
                style={{
                  width: '100%', aspectRatio: '1/1',
                  objectFit: 'cover', display: 'block',
                  borderRadius: '16px',
                }}
                onError={e => {
                  e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop';
                }}
              />
              {/* Badges */}
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {product.noi_bat === 1 && (
                  <span style={{
                    background: '#0f172a', color: '#fbbf24',
                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.5px',
                    padding: '0.3rem 0.7rem', borderRadius: '999px',
                    textTransform: 'uppercase'
                  }}>⭐ Nổi bật</span>
                )}
                {hasDiscount && (
                  <span style={{
                    background: '#dc2626', color: '#fff',
                    fontSize: '0.75rem', fontWeight: 800,
                    padding: '0.3rem 0.7rem', borderRadius: '999px'
                  }}>-{discountPct}%</span>
                )}
              </div>

              {/* Wishlist */}
              <button style={{
                position: 'absolute', top: 12, right: 12,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Heart size={16} color="#dc2626" />
              </button>
            </div>

            {/* Cam kết ngắn */}
            <div style={{
              marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '0.6rem'
            }}>
              {[
                { icon: <Truck size={13} color="#1d4ed8" />, text: 'Giao hàng toàn quốc' },
                { icon: <RefreshCw size={13} color="#d97706" />, text: 'Đổi trả 15 ngày' },
                { icon: <ShieldCheck size={13} color="#059669" />, text: '100% Chính hãng' },
                { icon: <Star size={13} color="#f59e0b" />, text: 'Form chuẩn người Việt' },
              ].map((it, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.78rem', color: '#64748b', fontWeight: 600,
                  background: '#fff', padding: '0.45rem 0.65rem',
                  borderRadius: '8px', border: '1px solid #e2e8f0',
                }}>
                  {it.icon} {it.text}
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: Thông tin & đặt hàng */}
          <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Tên + giá */}
            <div>
              <h2 style={{
                fontSize: '1.35rem', fontWeight: 800, color: '#0f172a',
                lineHeight: 1.35, marginBottom: '0.75rem'
              }}>
                {product.ten_hanghoa}
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#dc2626', letterSpacing: '-0.5px' }}>
                  {formatCurrency(currentPrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: '1rem', fontWeight: 500 }}>
                      {formatCurrency(product.gia)}
                    </span>
                    <span style={{
                      background: '#fef2f2', color: '#dc2626',
                      fontSize: '0.78rem', fontWeight: 700,
                      padding: '0.2rem 0.6rem', borderRadius: '999px',
                      border: '1px solid #fecaca'
                    }}>
                      Tiết kiệm {formatCurrency(product.gia - product.gia_khuyen_mai)}
                    </span>
                  </>
                )}
              </div>
              {/* Rating giả */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#f59e0b" fill="#f59e0b" />)}
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>4.8 (128 đánh giá)</span>
              </div>
            </div>

            {/* Chọn size */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                  Kích cỡ: <span style={{ color: '#1d4ed8' }}>{selectedSize}</span>
                </span>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#1d4ed8', fontSize: '0.78rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    textDecoration: 'underline', textUnderlineOffset: 2,
                  }}
                >
                  <Tag size={12} /> Hướng dẫn chọn size
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {SIZES.map(s => {
                  const active = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        width: 48, height: 44, borderRadius: '10px',
                        border: active ? '2px solid #0f172a' : '1.5px solid #cbd5e1',
                        background: active ? '#0f172a' : '#fff',
                        color: active ? '#fff' : '#334155',
                        fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: active ? '0 4px 12px rgba(15,23,42,0.18)' : 'none',
                      }}
                    >{s}</button>
                  );
                })}
              </div>

              {/* Bảng size guide */}
              {showSizeGuide && (
                <div style={{
                  marginTop: '0.75rem', background: '#f8fafc',
                  borderRadius: '10px', border: '1px solid #e2e8f0',
                  overflow: 'hidden', fontSize: '0.8rem',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#0f172a', color: '#fff' }}>
                        {['Size', 'Vòng ngực (cm)', 'Vòng eo (cm)', 'Chiều cao (cm)'].map(h => (
                          <th key={h} style={{ padding: '0.5rem 0.6rem', textAlign: 'center', fontWeight: 700, fontSize: '0.75rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SIZES.map((s, i) => (
                        <tr key={s} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', textAlign: 'center' }}>
                          <td style={{ padding: '0.45rem', fontWeight: 800, color: selectedSize === s ? '#dc2626' : '#0f172a' }}>{s}</td>
                          <td style={{ padding: '0.45rem', color: '#475569' }}>{SIZE_GUIDE[s].chest}</td>
                          <td style={{ padding: '0.45rem', color: '#475569' }}>{SIZE_GUIDE[s].waist}</td>
                          <td style={{ padding: '0.45rem', color: '#475569' }}>{SIZE_GUIDE[s].height}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Chọn số lượng */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Số lượng:</span>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1.5px solid #e2e8f0', borderRadius: '10px',
                overflow: 'hidden', background: '#fff',
              }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    width: 40, height: 40, background: 'transparent', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#475569',
                  }}
                ><Minus size={15} /></button>
                <span style={{
                  width: 44, textAlign: 'center', fontWeight: 800,
                  fontSize: '1rem', color: '#0f172a', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9',
                  lineHeight: '40px',
                }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{
                    width: 40, height: 40, background: 'transparent', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#475569',
                  }}
                ><Plus size={15} /></button>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Còn {product.so_luong || 50} sản phẩm
              </span>
            </div>

            {/* Nút thêm giỏ */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '0.9rem 1.25rem',
                  background: addedAnim ? '#059669' : '#0f172a',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.18)',
                }}
              >
                <ShoppingBag size={18} />
                {addedAnim ? '✓ Đã thêm vào giỏ!' : `Thêm vào giỏ • ${formatCurrency(currentPrice * qty)}`}
              </button>
            </div>

            {/* Tabs mô tả */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: 0, marginBottom: '0.85rem', borderBottom: '2px solid #f1f5f9' }}>
                {[
                  { key: 'desc', label: 'Mô tả' },
                  { key: 'material', label: 'Chất liệu' },
                  { key: 'care', label: 'Bảo quản' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '0.5rem 1rem', background: 'none', border: 'none',
                      cursor: 'pointer', fontWeight: 700, fontSize: '0.83rem',
                      color: activeTab === tab.key ? '#0f172a' : '#94a3b8',
                      borderBottom: activeTab === tab.key ? '2px solid #0f172a' : '2px solid transparent',
                      marginBottom: '-2px', transition: 'all 0.15s',
                    }}
                  >{tab.label}</button>
                ))}
              </div>

              <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.7 }}>
                {activeTab === 'desc' && (
                  <p>{product.mo_ta || 'Sản phẩm thiết kế chuẩn form dáng nam Việt. Chất liệu Cotton Compact 100% thoáng mát, co giãn tự nhiên 2 chiều, tôn dáng và bền màu qua nhiều lần giặt. Phù hợp đi làm, dạo phố, và các hoạt động ngoài trời.'}</p>
                )}
                {activeTab === 'material' && (
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    <li>Chất liệu: 100% Cotton Compact / ProCOOL++ Polyester blend</li>
                    <li>Trọng lượng vải: 180-200 GSM, dày dặn không lộ</li>
                    <li>Công nghệ: Co giãn 4 chiều Smart Jeans™ (dòng quần denim)</li>
                    <li>Kháng khuẩn, khử mùi tự nhiên từ sợi vải</li>
                    <li>Màu sắc bền, không phai sau 50 lần giặt</li>
                  </ul>
                )}
                {activeTab === 'care' && (
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    <li>Giặt máy ở chế độ nhẹ, nhiệt độ ≤ 30°C</li>
                    <li>Không dùng chất tẩy màu hay漂白 (bleach)</li>
                    <li>Phơi trong bóng mát, tránh ánh nắng trực tiếp</li>
                    <li>Ủi ở nhiệt độ thấp (≤ 110°C), không ủi trực tiếp lên hình in</li>
                    <li>Bảo quản nơi thoáng mát, tránh ẩm mốc</li>
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
