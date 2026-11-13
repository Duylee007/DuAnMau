import React, { useState, useEffect } from 'react';
import {
  X, Trash2, ShoppingBag, ArrowRight, CheckCircle2,
  Truck, Shield, RotateCcw, Minus, Plus, ChevronRight,
  MapPin, Phone, User, FileText, Package
} from 'lucide-react';

const formatCurrency = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  user,
  showToast
}) {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [orderInfo, setOrderInfo] = useState({
    name: user ? user.ten_khachhang : '',
    phone: user ? (user.dien_thoai || '') : '',
    address: user ? (user.dia_chi || '') : '',
    notes: ''
  });

  // Đồng bộ user info khi user thay đổi
  useEffect(() => {
    if (user) {
      setOrderInfo(prev => ({
        ...prev,
        name: user.ten_khachhang || prev.name,
        phone: user.dien_thoai || prev.phone,
        address: user.dia_chi || prev.address,
      }));
    }
  }, [user]);

  // Reset về step cart khi đóng
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStep('cart'), 300);
    }
  }, [isOpen]);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.gia_khuyen_mai > 0 ? item.gia_khuyen_mai : item.gia;
    return acc + price * item.quantity;
  }, 0);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const freeShipThreshold = 499000;
  const freeShip = subtotal >= freeShipThreshold;
  const remaining = freeShipThreshold - subtotal;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!orderInfo.phone || !orderInfo.address) {
      showToast('Vui lòng điền đầy đủ số điện thoại và địa chỉ giao hàng!');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('shopao_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dia_chi_giao: `${orderInfo.address} (Người nhận: ${orderInfo.name || 'Khách lẻ'})`,
          sdt_giao: orderInfo.phone,
          ghi_chu: orderInfo.notes,
          items: cart
        })
      });

      const data = await res.json();
      if (data.success) {
        setLastOrderId(data.orderId);
        setStep('success');
        onClearCart();
        showToast('🎉 Đặt hàng thành công! Mã đơn #' + data.orderId);
      } else {
        showToast(data.message || 'Lỗi khi đặt hàng. Vui lòng thử lại!');
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const STEP_TITLES = {
    cart: { icon: <ShoppingBag size={18} />, text: `Giỏ hàng (${totalItems} sản phẩm)` },
    checkout: { icon: <MapPin size={18} />, text: 'Thông tin giao hàng' },
    success: { icon: <CheckCircle2 size={18} color="#059669" />, text: 'Đặt hàng thành công' },
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1101,
          width: '100%', maxWidth: '460px',
          background: '#ffffff',
          boxShadow: '-20px 0 60px -10px rgba(15,23,42,0.18)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.34,1.1,0.64,1)',
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0.5; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* ── HEADER ── */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a' }}>
            {STEP_TITLES[step].icon}
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>
              {STEP_TITLES[step].text}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid #e2e8f0', background: '#f8fafc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#475569',
            }}
          ><X size={17} /></button>
        </div>

        {/* Step indicator */}
        {step !== 'success' && (
          <div style={{
            display: 'flex', padding: '0.75rem 1.25rem',
            gap: 0, background: '#f8fafc',
            borderBottom: '1px solid #f1f5f9', flexShrink: 0,
          }}>
            {['cart', 'checkout'].map((s, i) => {
              const done = (step === 'checkout' && s === 'cart');
              const active = step === s;
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: done ? '#059669' : active ? '#0f172a' : '#e2e8f0',
                      color: done || active ? '#fff' : '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 800,
                    }}>{done ? '✓' : i + 1}</div>
                    <span style={{
                      fontSize: '0.78rem', fontWeight: 700,
                      color: active ? '#0f172a' : done ? '#059669' : '#94a3b8',
                    }}>
                      {s === 'cart' ? 'Giỏ hàng' : 'Giao hàng & Thanh toán'}
                    </span>
                  </div>
                  {i < 1 && <ChevronRight size={14} color="#cbd5e1" style={{ margin: '0 0.5rem' }} />}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* ── CONTENT (scrollable) ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>

          {/* ── STEP 1: GIỎ HÀNG ── */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: '#f1f5f9', margin: '0 auto 1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ShoppingBag size={34} color="#94a3b8" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Giỏ hàng đang trống
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                    Hãy chọn thêm sản phẩm yêu thích và thêm vào giỏ nhé!
                  </p>
                  <button className="btn-primary" onClick={onClose}>
                    Khám phá sản phẩm <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <>
                  {/* Thanh tiến độ miễn phí ship */}
                  <div style={{
                    background: freeShip ? '#ecfdf5' : '#fffbeb',
                    border: `1px solid ${freeShip ? '#6ee7b7' : '#fde68a'}`,
                    borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem',
                      color: freeShip ? '#059669' : '#d97706',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Truck size={13} />
                        {freeShip
                          ? '🎉 Bạn được MIỄN PHÍ vận chuyển!'
                          : `Thêm ${formatCurrency(remaining)} để được miễn phí ship`}
                      </span>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '999px', height: 5, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '999px',
                        background: freeShip ? '#059669' : '#f59e0b',
                        width: `${Math.min(100, (subtotal / freeShipThreshold) * 100)}%`,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {cart.map((item) => {
                      const itemPrice = item.gia_khuyen_mai > 0 ? item.gia_khuyen_mai : item.gia;
                      const hasD = item.gia_khuyen_mai > 0 && item.gia_khuyen_mai < item.gia;
                      return (
                        <div key={`${item.id_hanghoa}-${item.size}`} style={{
                          display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                          background: '#f8fafc', borderRadius: '12px',
                          padding: '0.85rem', border: '1px solid #f1f5f9',
                        }}>
                          <div style={{ position: 'relative', flexShrink: 0 }}>
                            <img
                              src={item.hinh_anh}
                              alt={item.ten_hanghoa}
                              style={{
                                width: 72, height: 72, objectFit: 'cover',
                                borderRadius: '10px', border: '1px solid #e2e8f0',
                              }}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'; }}
                            />
                            <span style={{
                              position: 'absolute', top: -6, right: -6,
                              background: '#0f172a', color: '#fff',
                              width: 20, height: 20, borderRadius: '50%',
                              fontSize: '0.68rem', fontWeight: 800,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{item.quantity}</span>
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontWeight: 700, fontSize: '0.86rem', color: '#0f172a',
                              lineHeight: 1.35, marginBottom: '0.3rem',
                              overflow: 'hidden', textOverflow: 'ellipsis',
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            }}>{item.ten_hanghoa}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.5rem' }}>
                              Size: <strong style={{ color: '#1d4ed8' }}>{item.size}</strong>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              {/* Qty controls */}
                              <div style={{
                                display: 'inline-flex', alignItems: 'center',
                                border: '1px solid #e2e8f0', borderRadius: '8px',
                                background: '#fff', overflow: 'hidden',
                              }}>
                                <button
                                  onClick={() => onUpdateQty(item.id_hanghoa, item.size, item.quantity - 1)}
                                  style={{
                                    width: 28, height: 28, border: 'none', background: 'transparent',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#475569',
                                  }}
                                ><Minus size={12} /></button>
                                <span style={{
                                  width: 28, textAlign: 'center', fontWeight: 800,
                                  fontSize: '0.85rem', color: '#0f172a',
                                  borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9',
                                  lineHeight: '28px',
                                }}>{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQty(item.id_hanghoa, item.size, item.quantity + 1)}
                                  style={{
                                    width: 28, height: 28, border: 'none', background: 'transparent',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#475569',
                                  }}
                                ><Plus size={12} /></button>
                              </div>

                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.92rem' }}>
                                  {formatCurrency(itemPrice * item.quantity)}
                                </div>
                                {hasD && (
                                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                    {formatCurrency(item.gia * item.quantity)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id_hanghoa, item.size)}
                            style={{
                              width: 28, height: 28, border: 'none', background: 'transparent',
                              cursor: 'pointer', color: '#cbd5e1', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              borderRadius: '6px', transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.background = '#fef2f2'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; }}
                          ><Trash2 size={15} /></button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── STEP 2: THANH TOÁN ── */}
          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit}>
              {/* Tóm tắt đơn */}
              <div style={{
                background: '#f8fafc', borderRadius: '12px',
                padding: '0.85rem 1rem', marginBottom: '1.25rem',
                border: '1px solid #f1f5f9',
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  TÓM TẮT ĐƠN HÀNG
                </div>
                {cart.map(item => {
                  const p = item.gia_khuyen_mai > 0 ? item.gia_khuyen_mai : item.gia;
                  return (
                    <div key={`${item.id_hanghoa}-${item.size}`} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '0.82rem', color: '#475569', marginBottom: '0.3rem',
                    }}>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                        {item.ten_hanghoa} (×{item.quantity}, {item.size})
                      </span>
                      <span style={{ fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>
                        {formatCurrency(p * item.quantity)}
                      </span>
                    </div>
                  );
                })}
                <div style={{ borderTop: '1px dashed #e2e8f0', marginTop: '0.6rem', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Phí ship:</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: freeShip ? '#059669' : '#0f172a' }}>
                    {freeShip ? 'Miễn phí' : formatCurrency(30000)}
                  </span>
                </div>
              </div>

              {/* Form thông tin */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {[
                  { label: 'Họ tên người nhận *', key: 'name', type: 'text', placeholder: 'Nguyễn Văn A', icon: <User size={15} color="#64748b" />, required: false },
                  { label: 'Số điện thoại *', key: 'phone', type: 'tel', placeholder: '0912 345 678', icon: <Phone size={15} color="#64748b" />, required: true },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                      {f.label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>{f.icon}</span>
                      <input
                        type={f.type}
                        required={f.required}
                        placeholder={f.placeholder}
                        value={orderInfo[f.key]}
                        onChange={e => setOrderInfo({ ...orderInfo, [f.key]: e.target.value })}
                        style={{
                          width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.3rem',
                          borderRadius: '10px', border: '1.5px solid #e2e8f0',
                          fontSize: '0.88rem', color: '#0f172a', background: '#fff',
                          outline: 'none', boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#1d4ed8'; }}
                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Địa chỉ giao hàng *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} color="#64748b" style={{ position: 'absolute', left: '0.75rem', top: '0.75rem' }} />
                    <textarea
                      required
                      rows={3}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                      value={orderInfo.address}
                      onChange={e => setOrderInfo({ ...orderInfo, address: e.target.value })}
                      style={{
                        width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.3rem',
                        borderRadius: '10px', border: '1.5px solid #e2e8f0',
                        fontSize: '0.88rem', color: '#0f172a', background: '#fff',
                        outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#1d4ed8'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Ghi chú (tùy chọn)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={15} color="#64748b" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Giao giờ hành chính, gọi trước khi giao..."
                      value={orderInfo.notes}
                      onChange={e => setOrderInfo({ ...orderInfo, notes: e.target.value })}
                      style={{
                        width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.3rem',
                        borderRadius: '10px', border: '1.5px solid #e2e8f0',
                        fontSize: '0.88rem', color: '#0f172a', background: '#fff',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#1d4ed8'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                    />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div style={{
                marginTop: '1rem', background: '#fffbeb', borderRadius: '10px',
                padding: '0.85rem 1rem', border: '1px solid #fde68a',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                <Package size={18} color="#d97706" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400e' }}>Thanh toán khi nhận hàng (COD)</div>
                  <div style={{ fontSize: '0.76rem', color: '#78350f' }}>Kiểm tra hàng thoải mái trước khi thanh toán</div>
                </div>
              </div>
            </form>
          )}

          {/* ── STEP 3: THÀNH CÔNG ── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#ecfdf5', margin: '0 auto 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid #6ee7b7',
              }}>
                <CheckCircle2 size={44} color="#059669" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
                Đặt Hàng Thành Công!
              </h3>
              <div style={{
                display: 'inline-block', background: '#eff6ff',
                border: '1px solid #bfdbfe', borderRadius: '10px',
                padding: '0.5rem 1.25rem', margin: '0.5rem 0 1rem',
              }}>
                <span style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 700 }}>Mã đơn hàng: </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d4ed8' }}>#{lastOrderId}</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Cảm ơn bạn đã mua sắm tại <strong>DUYDENIM</strong>! 🎉<br />
                Đội CSKH sẽ liên hệ xác nhận đơn hàng và giao tới bạn trong <strong>1-3 ngày làm việc</strong>.
              </p>
              <div style={{
                background: '#f8fafc', borderRadius: '12px', padding: '0.85rem',
                marginBottom: '1.5rem', border: '1px solid #f1f5f9',
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
              }}>
                {[
                  { icon: <Truck size={14} color="#1d4ed8" />, text: 'Giao hàng toàn quốc 1-3 ngày' },
                  { icon: <Shield size={14} color="#059669" />, text: 'Kiểm tra hàng trước khi thanh toán' },
                  { icon: <RotateCcw size={14} color="#d97706" />, text: 'Đổi trả miễn phí trong 15 ngày' },
                ].map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                    {it.icon} {it.text}
                  </div>
                ))}
              </div>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setStep('cart'); onClose(); }}
              >
                Tiếp tục mua sắm <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── FOOTER STICKY ── */}
        {step !== 'success' && cart.length > 0 && (
          <div style={{
            padding: '1rem 1.25rem', borderTop: '1px solid #f1f5f9',
            background: '#fff', flexShrink: 0,
          }}>
            {/* Tổng tiền */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '0.85rem',
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tổng thanh toán</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {freeShip ? '+ Miễn phí vận chuyển' : `+ phí ship ${formatCurrency(30000)}`}
                </div>
              </div>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626', letterSpacing: '-0.5px' }}>
                {formatCurrency(subtotal + (freeShip ? 0 : 30000))}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              {step === 'checkout' && (
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  style={{
                    padding: '0.8rem 1rem', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', background: '#fff',
                    color: '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem',
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    transition: 'all 0.15s',
                  }}
                >
                  ← Giỏ hàng
                </button>
              )}

              {step === 'cart' && (
                <button
                  onClick={() => setStep('checkout')}
                  style={{
                    flex: 1, padding: '0.9rem', borderRadius: '10px',
                    background: '#0f172a', color: '#fff',
                    border: 'none', fontWeight: 800, fontSize: '0.95rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.5rem', boxShadow: '0 4px 14px rgba(15,23,42,0.2)',
                  }}
                >
                  Tiến hành đặt hàng <ArrowRight size={18} />
                </button>
              )}

              {step === 'checkout' && (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  style={{
                    flex: 1, padding: '0.9rem', borderRadius: '10px',
                    background: loading ? '#94a3b8' : '#dc2626',
                    color: '#fff', border: 'none',
                    fontWeight: 800, fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.5rem', transition: 'all 0.2s',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(220,38,38,0.3)',
                  }}
                >
                  {loading ? (
                    <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Đang gửi đơn...</>
                  ) : (
                    <><CheckCircle2 size={18} /> Xác nhận đặt hàng (COD)</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
