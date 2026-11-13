import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, MapPin, Check } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states for Customer
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    ten_khachhang: '',
    email: '',
    password: '',
    dien_thoai: '',
    dia_chi: ''
  });

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success) {
        onAuthSuccess(data.user, data.token);
        showToast('Chào mừng bạn, ' + (data.user.ten_khachhang || 'Khách hàng'));
        onClose();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (data.success) {
        onAuthSuccess(data.user, data.token);
        showToast('Đăng ký tài khoản thành công!');
        onClose();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Tài khoản Khách Hàng</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid var(--border-subtle)',
            background: '#f8fafc'
          }}
        >
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              padding: '0.9rem 0.5rem',
              background: tab === 'login' ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid #0f172a' : 'none',
              color: tab === 'login' ? '#0f172a' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              padding: '0.9rem 0.5rem',
              background: tab === 'register' ? '#ffffff' : 'transparent',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid #0f172a' : 'none',
              color: tab === 'register' ? '#0f172a' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Đăng ký
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '1.25rem',
                fontWeight: 600
              }}
            >
              {error}
            </div>
          )}

          {/* TAB LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email tài khoản</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="user@gmail.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem', background: '#f1f5f9', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
                💡 Tài khoản mẫu: <code>user@gmail.com</code> / Mật khẩu: <code>123456</code>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập Mua sắm'}
              </button>
            </form>
          )}

          {/* TAB REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Nguyễn Văn A"
                  value={registerForm.ten_khachhang}
                  onChange={(e) => setRegisterForm({ ...registerForm, ten_khachhang: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email đăng ký *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="email@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu *</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="0912 345 678"
                  value={registerForm.dien_thoai}
                  onChange={(e) => setRegisterForm({ ...registerForm, dien_thoai: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  value={registerForm.dia_chi}
                  onChange={(e) => setRegisterForm({ ...registerForm, dia_chi: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                {loading ? 'Đang đăng ký...' : 'Tạo tài khoản mới'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
