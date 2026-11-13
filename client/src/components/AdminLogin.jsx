import React, { useState } from 'react';
import { Shield, Lock, User, ArrowLeft, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin({ onAdminLoginSuccess, onBackToShop, showToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        onAdminLoginSuccess(data.user, data.token);
        if (showToast) {
          showToast(`Chào mừng Quản trị viên: ${data.user.ten_hien_thi || data.user.username}`);
        }
      } else {
        setError(data.message || 'Tài khoản hoặc mật khẩu quản trị không đúng');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin1');
    setPassword('admin123');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        position: 'relative'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
          position: 'relative'
        }}
      >
        {/* Back button */}
        <button
          type="button"
          onClick={onBackToShop}
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            padding: '0.4rem 0.8rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: 600
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#0f172a';
            e.currentTarget.style.borderColor = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <ArrowLeft size={14} /> Trang mua sắm
        </button>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.25rem',
              borderRadius: '16px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.15)'
            }}
          >
            <Shield size={32} color="#1d4ed8" />
          </div>

          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.85rem',
              borderRadius: '999px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}
          >
            Cổng Quản Trị Hệ Thống
          </span>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            Đăng Nhập Quản Trị
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Dành riêng cho Quản trị viên quản lý sản phẩm, đơn hàng và số liệu bán hàng.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              fontWeight: 600
            }}
          >
            <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} color="#1d4ed8" /> Tên đăng nhập Admin
            </label>
            <input
              type="text"
              className="form-input"
              required
              autoFocus
              placeholder="Nhập username quản trị (vd: admin1)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={14} color="#1d4ed8" /> Mật khẩu Admin
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                required
                placeholder="Nhập mật khẩu quản trị"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.8rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.2rem'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Quick Demo Fill Helper */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}
          >
            <div>
              <span>Tài khoản demo: </span>
              <strong style={{ color: '#0f172a' }}>admin1</strong> / <strong style={{ color: '#0f172a' }}>admin123</strong>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#1d4ed8',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <KeyRound size={12} /> Tự điền
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 700
            }}
          >
            {loading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
          </button>
        </form>
      </div>
    </div>
  );
}
