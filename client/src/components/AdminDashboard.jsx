import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Save,
  X,
  LogOut,
  Shield,
  Search,
  Eye,
  Printer,
  KeyRound,
  Filter,
  AlertCircle,
  Phone,
  MapPin,
  FileText,
  User,
  Calendar,
  Check,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

export default function AdminDashboard({ onBackToShop, showToast, adminUser, onLogoutAdmin }) {
  // Navigation Tabs: 'stats' | 'products' | 'orders' | 'categories' | 'customers' | 'security'
  const [activeTab, setActiveTab] = useState('stats');

  // Core Data
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    ten_hanghoa: '',
    gia: '',
    gia_khuyen_mai: '',
    hinh_anh: '',
    mo_ta: '',
    id_loai: '',
    so_luong: 100,
    noi_bat: 1
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    ten_loai: '',
    mo_ta: ''
  });

  const [selectedOrder, setSelectedOrder] = useState(null); // for Order Detail Modal

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const getHeaders = () => {
    const token = localStorage.getItem('shopao_admin_token') || localStorage.getItem('shopao_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  // ================= DATA LOADERS =================
  const loadStats = async () => {
    try {
      const res = await fetch('/api/stats', { headers: getHeaders() });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=200');
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (e) {
      console.error(e);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (e) {
      console.error(e);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders', { headers: getHeaders() });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await fetch('/api/auth/customers', { headers: getHeaders() });
      const data = await res.json();
      if (data.success) setCustomers(data.customers);
    } catch (e) {
      console.error(e);
    }
  };

  const refreshAll = () => {
    loadStats();
    loadProducts();
    loadCategories();
    loadOrders();
    loadCustomers();
    if (showToast) showToast('Đã làm mới dữ liệu hệ thống!');
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // ================= PRODUCT CRUD =================
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      ten_hanghoa: '',
      gia: '',
      gia_khuyen_mai: '',
      hinh_anh: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      mo_ta: '',
      id_loai: categories.length > 0 ? categories[0].id_loai : '1',
      so_luong: 100,
      noi_bat: 1
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      ten_hanghoa: p.ten_hanghoa,
      gia: p.gia,
      gia_khuyen_mai: p.gia_khuyen_mai || '',
      hinh_anh: p.hinh_anh,
      mo_ta: p.mo_ta || '',
      id_loai: p.id_loai || '',
      so_luong: p.so_luong !== undefined ? p.so_luong : 100,
      noi_bat: p.noi_bat || 0
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id_hanghoa}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        loadProducts();
        loadStats();
        loadCategories();
      } else {
        alert(data.message || 'Lỗi khi lưu sản phẩm');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" (ID #${id})?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa sản phẩm #${id}!`);
        loadProducts();
        loadStats();
        loadCategories();
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // ================= CATEGORY CRUD =================
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ ten_loai: '', mo_ta: '' });
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (c) => {
    setEditingCategory(c);
    setCategoryForm({ ten_loai: c.ten_loai, mo_ta: c.mo_ta || '' });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id_loai}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingCategory ? 'Cập nhật loại hàng thành công!' : 'Thêm loại hàng mới thành công!');
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        loadCategories();
        loadStats();
      } else {
        alert(data.message || 'Lỗi khi lưu loại hàng');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id, name, count) => {
    if (count > 0) {
      if (!window.confirm(`Danh mục "${name}" đang có ${count} sản phẩm! Nếu xóa, các sản phẩm này sẽ về trạng thái chưa phân loại. Bạn có chắc muốn xóa?`)) return;
    } else {
      if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${name}" (ID #${id})?`)) return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa danh mục "${name}"!`);
        loadCategories();
        loadProducts();
        loadStats();
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // ================= ORDER WORKFLOW =================
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ trang_thai: status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đơn hàng #${id} chuyển thành: ${status}`);
        loadOrders();
        loadStats();
        if (selectedOrder && selectedOrder.id_hoadon === id) {
          setSelectedOrder({ ...selectedOrder, trang_thai: status });
        }
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng #${id}? Hành động này không thể hoàn tác.`)) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa đơn hàng #${id}!`);
        if (selectedOrder && selectedOrder.id_hoadon === id) {
          setSelectedOrder(null);
        }
        loadOrders();
        loadStats();
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const itemsHtml = (order.items || [])
      .map(
        (it, idx) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${it.ten_hanghoa} (Size: <strong>${it.size || 'M'}</strong>)</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${it.so_luong}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(it.don_gia)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${formatCurrency(it.so_luong * it.don_gia)}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa Đơn Bán Hàng #${order.id_hoadon} - DUYDENIM</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 2rem; color: #0f172a; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e40af; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .logo { font-size: 1.8rem; font-weight: 900; color: #1e40af; }
          .logo span { color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th { background: #f1f5f9; padding: 10px 8px; font-size: 0.85rem; text-align: left; border-bottom: 2px solid #cbd5e1; }
          .total-box { margin-top: 1.5rem; text-align: right; font-size: 1.1rem; }
          .footer-note { margin-top: 3rem; text-align: center; font-size: 0.85rem; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 1rem; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">DUY<span>DENIM</span></div>
            <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Thời Trang Nam Phong Cách Hiện Đại • Enjoy Life</div>
            <div style="font-size: 0.85rem; color: #64748b;">Trụ sở: 261 Quang Trung, Gò Vấp, TP.HCM • Hotline: 1900 8888</div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #0f172a;">HÓA ĐƠN BÁN HÀNG</h2>
            <div style="font-size: 1rem; font-weight: bold; color: #1e40af;">Mã đơn: #${order.id_hoadon}</div>
            <div style="font-size: 0.85rem; color: #64748b;">Ngày: ${order.ngay_dat_hang || new Date().toLocaleString()}</div>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <div style="font-weight: bold; margin-bottom: 0.5rem; color: #1e40af;">THÔNG TIN NGƯỜI NHẬN:</div>
          <div><strong>Khách hàng:</strong> ${order.ten_khachhang || 'Khách vãng lai'}</div>
          <div><strong>Điện thoại:</strong> ${order.sdt_giao || 'Chưa cập nhật'}</div>
          <div><strong>Địa chỉ giao:</strong> ${order.dia_chi_giao || 'Tại cửa hàng'}</div>
          ${order.ghi_chu ? `<div><strong>Ghi chú:</strong> ${order.ghi_chu}</div>` : ''}
          <div><strong>Hình thức thanh toán:</strong> Thanh toán khi nhận hàng (COD)</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: center; width: 40px;">STT</th>
              <th>Tên sản phẩm</th>
              <th style="text-align: center; width: 80px;">SL</th>
              <th style="text-align: right; width: 120px;">Đơn giá</th>
              <th style="text-align: right; width: 130px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-box">
          <div>Phí vận chuyển: <strong>Miễn phí toàn quốc</strong></div>
          <div style="margin-top: 0.5rem; font-size: 1.3rem;">Tổng thanh toán: <strong style="color: #dc2626;">${formatCurrency(order.tong_tien)}</strong></div>
        </div>

        <div class="footer-note">
          <p>Cảm ơn quý khách đã mua sắm tại DUYDENIM! Quý khách vui lòng kiểm tra kỹ sản phẩm trước khi nhận hàng.</p>
          <p>Hỗ trợ đổi trả miễn phí trong 15 ngày trên toàn quốc.</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  // ================= CUSTOMER MANAGEMENT =================
  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản khách hàng "${name}" (ID #${id})?`)) return;
    try {
      const res = await fetch(`/api/auth/customers/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa khách hàng #${id}!`);
        loadCustomers();
        loadStats();
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // ================= ADMIN PASSWORD CHANGE =================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-admin-password', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordSuccess(data.message || 'Đổi mật khẩu quản trị thành công!');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Đổi mật khẩu Admin thành công!');
      } else {
        setPasswordError(data.message || 'Không thể đổi mật khẩu');
      }
    } catch (err) {
      setPasswordError('Lỗi kết nối máy chủ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTERED DATA =================
  const filteredProducts = products.filter((p) => {
    const matchName = p.ten_hanghoa.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = productCategoryFilter === 'all' || String(p.id_loai) === String(productCategoryFilter);
    return matchName && matchCat;
  });

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      String(o.id_hoadon).includes(orderSearch) ||
      (o.ten_khachhang && o.ten_khachhang.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.sdt_giao && o.sdt_giao.includes(orderSearch));
    const matchStatus = orderStatusFilter === 'all' || o.trang_thai === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredCustomers = customers.filter((c) => {
    return (
      (c.ten_khachhang && c.ten_khachhang.toLowerCase().includes(customerSearch.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(customerSearch.toLowerCase())) ||
      (c.dien_thoai && c.dien_thoai.includes(customerSearch))
    );
  });

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1350px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#ffffff',
          padding: '1.25rem 1.75rem',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <button
            className="btn-outline"
            onClick={onBackToShop}
            style={{ padding: '0.55rem 1.1rem', fontWeight: 600 }}
          >
            <ArrowLeft size={18} /> Về Cửa Hàng
          </button>
          <div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 900,
                margin: 0,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <Shield size={26} color="#1d4ed8" /> Quản Trị Hệ Thống DUYDENIM
            </h1>
            {adminUser && (
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Đang đăng nhập với quyền Quản trị: <strong style={{ color: '#1d4ed8' }}>{adminUser.ten_hien_thi || adminUser.username}</strong>
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-outline"
            onClick={refreshAll}
            title="Tải lại toàn bộ dữ liệu mới nhất"
            style={{ padding: '0.55rem 0.9rem' }}
          >
            <RefreshCw size={16} /> Làm mới
          </button>

          {activeTab === 'products' && (
            <button className="btn-primary" onClick={openAddProduct}>
              <Plus size={18} /> Thêm Sản Phẩm Mới
            </button>
          )}

          {activeTab === 'categories' && (
            <button className="btn-primary" onClick={openAddCategory}>
              <Plus size={18} /> Thêm Danh Mục Mới
            </button>
          )}

          {onLogoutAdmin && (
            <button
              className="btn-outline"
              onClick={onLogoutAdmin}
              style={{
                borderColor: '#fca5a5',
                color: '#dc2626',
                padding: '0.55rem 1rem',
                fontWeight: 700
              }}
              title="Đăng xuất khỏi hệ thống quản trị"
            >
              <LogOut size={16} /> Đăng xuất Admin
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'stats', label: 'Tổng quan & Báo cáo', icon: TrendingUp },
          { id: 'products', label: `Sản phẩm (${products.length})`, icon: Package },
          { id: 'orders', label: `Đơn hàng (${orders.length})`, icon: ShoppingBag },
          { id: 'categories', label: `Danh mục (${categories.length})`, icon: Layers },
          { id: 'customers', label: `Khách hàng (${customers.length})`, icon: Users },
          { id: 'security', label: 'Bảo mật & Tài khoản', icon: KeyRound }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.35rem',
                borderRadius: '10px',
                border: isActive ? '1px solid #1e40af' : '1px solid #e2e8f0',
                background: isActive ? '#1e40af' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 12px rgba(30, 64, 175, 0.2)' : 'none'
              }}
            >
              <Icon size={17} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW & STATS ================= */}
      {activeTab === 'stats' && stats && (
        <div>
          {/* KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                background: '#ffffff',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>TỔNG DOANH THU</span>
                <span style={{ padding: '0.4rem', borderRadius: '8px', background: '#ecfdf5', color: '#059669' }}><DollarSign size={20} /></span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.5rem' }}>
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>Tính trên các đơn hàng đã đặt</div>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>TỔNG ĐƠN HÀNG</span>
                <span style={{ padding: '0.4rem', borderRadius: '8px', background: '#eff6ff', color: '#1d4ed8' }}><ShoppingBag size={20} /></span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1d4ed8', marginTop: '0.5rem' }}>
                {stats.totalOrders} đơn
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>Bao gồm đơn online và tại quầy</div>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>MẶT HÀNG KINH DOANH</span>
                <span style={{ padding: '0.4rem', borderRadius: '8px', background: '#fffbeb', color: '#d97706' }}><Package size={20} /></span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#d97706', marginTop: '0.5rem' }}>
                {stats.totalProducts} sản phẩm
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>Trải đều trên {categories.length} danh mục thời trang</div>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>KHÁCH HÀNG ĐĂNG KÝ</span>
                <span style={{ padding: '0.4rem', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed' }}><Users size={20} /></span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#7c3aed', marginTop: '0.5rem' }}>
                {stats.totalCustomers} tài khoản
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>Khách hàng thân thiết DUYDENIM</div>
            </div>
          </div>

          {/* Quick Orders Overview Table */}
          <div
            style={{
              background: '#ffffff',
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Đơn hàng gần đây nhất</h3>
              <button
                className="btn-outline"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                onClick={() => setActiveTab('orders')}
              >
                Xem tất cả {orders.length} đơn →
              </button>
            </div>

            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((o) => (
                    <tr key={o.id_hoadon}>
                      <td><strong style={{ color: '#1d4ed8' }}>#{o.id_hoadon}</strong></td>
                      <td style={{ fontWeight: 600 }}>{o.ten_khachhang || 'Khách vãng lai'}</td>
                      <td>{o.sdt_giao || '-'}</td>
                      <td style={{ fontWeight: 800, color: '#dc2626' }}>{formatCurrency(o.tong_tien)}</td>
                      <td>
                        <span
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background:
                              o.trang_thai === 'Đã hoàn thành'
                                ? '#ecfdf5'
                                : o.trang_thai === 'Đã hủy'
                                ? '#fef2f2'
                                : o.trang_thai === 'Đang giao hàng'
                                ? '#eff6ff'
                                : '#fffbeb',
                            color:
                              o.trang_thai === 'Đã hoàn thành'
                                ? '#059669'
                                : o.trang_thai === 'Đã hủy'
                                ? '#dc2626'
                                : o.trang_thai === 'Đang giao hàng'
                                ? '#1d4ed8'
                                : '#d97706',
                            border: '1px solid currentColor'
                          }}
                        >
                          {o.trang_thai}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{o.ngay_dat_hang}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => setSelectedOrder(o)}
                        >
                          <Eye size={14} /> Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
      {activeTab === 'products' && (
        <div>
          {/* Controls Bar: Search & Filter */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '600px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm theo tên..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>

              <select
                className="form-select"
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                style={{ width: '200px' }}
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id_loai} value={c.id_loai}>{c.ten_loai}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} sản phẩm
            </div>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại hàng</th>
                  <th>Giá niêm yết</th>
                  <th>Giá khuyến mãi</th>
                  <th>Kho</th>
                  <th>Nổi bật</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id_hanghoa}>
                    <td>
                      <img
                        src={p.hinh_anh}
                        alt=""
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop';
                        }}
                      />
                    </td>
                    <td style={{ fontWeight: 700, maxWidth: 280, color: '#0f172a' }}>
                      {p.ten_hanghoa}
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>ID: #{p.id_hanghoa}</div>
                    </td>
                    <td>
                      <span style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '0.85rem' }}>{p.ten_loai || '-'}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(p.gia)}</td>
                    <td>
                      {p.gia_khuyen_mai > 0 && p.gia_khuyen_mai < p.gia ? (
                        <span style={{ color: '#dc2626', fontWeight: 800 }}>
                          {formatCurrency(p.gia_khuyen_mai)}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: p.so_luong < 10 ? '#dc2626' : p.so_luong < 30 ? '#d97706' : '#059669'
                        }}
                      >
                        {p.so_luong}
                      </span>
                    </td>
                    <td>
                      {p.noi_bat ? (
                        <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.8rem' }}>⭐ Nổi bật</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Thường</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="btn-icon"
                          style={{ width: 34, height: 34 }}
                          onClick={() => openEditProduct(p)}
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit size={15} color="#1d4ed8" />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: 34, height: 34, color: '#dc2626' }}
                          onClick={() => handleDeleteProduct(p.id_hanghoa, p.ten_hanghoa)}
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
      {activeTab === 'orders' && (
        <div>
          {/* Controls Bar: Search & Status Filter */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '600px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn (#12), tên khách hoặc SĐT..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>

              <select
                className="form-select"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Hiển thị <strong>{filteredOrders.length}</strong> / {orders.length} đơn hàng
            </div>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng & SĐT</th>
                  <th>Địa chỉ giao hàng</th>
                  <th>Tổng món</th>
                  <th>Tổng thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Đổi trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id_hoadon}>
                    <td>
                      <strong style={{ color: '#1d4ed8', fontSize: '0.95rem' }}>#{o.id_hoadon}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{o.ngay_dat_hang}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{o.ten_khachhang || 'Khách lẻ'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.sdt_giao || '-'}</div>
                    </td>
                    <td style={{ maxWidth: 220, fontSize: '0.84rem', color: '#475569' }}>
                      {o.dia_chi_giao}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#1e40af' }}>
                        {(o.items || []).reduce((acc, it) => acc + (it.so_luong || 1), 0)} món
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.95rem' }}>
                      {formatCurrency(o.tong_tien)}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background:
                            o.trang_thai === 'Đã hoàn thành'
                              ? '#ecfdf5'
                              : o.trang_thai === 'Đã hủy'
                              ? '#fef2f2'
                              : o.trang_thai === 'Đang giao hàng'
                              ? '#eff6ff'
                              : '#fffbeb',
                          color:
                            o.trang_thai === 'Đã hoàn thành'
                              ? '#059669'
                              : o.trang_thai === 'Đã hủy'
                              ? '#dc2626'
                              : o.trang_thai === 'Đang giao hàng'
                              ? '#1d4ed8'
                              : '#d97706',
                          border: '1px solid currentColor'
                        }}
                      >
                        {o.trang_thai}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
                        value={o.trang_thai}
                        onChange={(e) => handleUpdateOrderStatus(o.id_hoadon, e.target.value)}
                      >
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã hoàn thành">Đã hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          onClick={() => setSelectedOrder(o)}
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye size={14} /> Chi tiết
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: 32, height: 32 }}
                          onClick={() => handlePrintInvoice(o)}
                          title="In hóa đơn"
                        >
                          <Printer size={15} color="#1e40af" />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: 32, height: 32, color: '#dc2626' }}
                          onClick={() => handleDeleteOrder(o.id_hoadon)}
                          title="Xóa đơn hàng"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CATEGORIES MANAGEMENT ================= */}
      {activeTab === 'categories' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Quản lý các nhóm danh mục sản phẩm của hệ thống (Hiển thị trực tiếp trên Mega Menu)
            </div>
            <button className="btn-primary" onClick={openAddCategory}>
              <Plus size={18} /> Thêm Danh Mục Mới
            </button>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Mã ID</th>
                  <th>Tên loại hàng</th>
                  <th>Mô tả danh mục</th>
                  <th>Số sản phẩm</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id_loai}>
                    <td><strong style={{ color: '#1d4ed8' }}>#{c.id_loai}</strong></td>
                    <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                      {c.ten_loai}
                    </td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: 350 }}>
                      {c.mo_ta || 'Chưa có mô tả'}
                    </td>
                    <td>
                      <span style={{ color: '#1d4ed8', fontWeight: 800, fontSize: '0.92rem' }}>
                        {c.so_san_pham || 0}
                      </span> mặt hàng
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className="btn-icon"
                          style={{ width: 34, height: 34 }}
                          onClick={() => openEditCategory(c)}
                          title="Chỉnh sửa danh mục"
                        >
                          <Edit size={15} color="#1d4ed8" />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: 34, height: 34, color: '#dc2626' }}
                          onClick={() => handleDeleteCategory(c.id_loai, c.ten_loai, c.so_san_pham || 0)}
                          title="Xóa danh mục"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: CUSTOMERS MANAGEMENT ================= */}
      {activeTab === 'customers' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ position: 'relative', width: '380px' }}>
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Tìm khách hàng theo tên, email, SĐT..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Tổng cộng <strong>{filteredCustomers.length}</strong> tài khoản người dùng
            </div>
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Mã ID</th>
                  <th>Họ và tên</th>
                  <th>Email đăng nhập</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ nhận hàng</th>
                  <th>Ngày đăng ký</th>
                  <th>Tổng đơn</th>
                  <th>Tổng chi tiêu</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((k) => (
                  <tr key={k.id_khachhang}>
                    <td><strong style={{ color: '#7c3aed' }}>#{k.id_khachhang}</strong></td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{k.ten_khachhang}</td>
                    <td style={{ color: '#1d4ed8' }}>{k.email}</td>
                    <td>{k.dien_thoai || '-'}</td>
                    <td style={{ maxWidth: 220, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {k.dia_chi || 'Chưa cung cấp'}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      {k.ngay_dang_ky || '-'}
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#1e40af' }}>{k.so_don_hang || 0}</span> đơn
                    </td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>
                      {formatCurrency(k.tong_chi_tieu || 0)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon"
                        style={{ width: 34, height: 34, color: '#dc2626' }}
                        onClick={() => handleDeleteCustomer(k.id_khachhang, k.ten_khachhang)}
                        title="Xóa tài khoản khách hàng"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: SECURITY & PASSWORD CHANGE ================= */}
      {activeTab === 'security' && (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <KeyRound size={28} color="#1e40af" />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Đổi Mật Khẩu Quản Trị Viên
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
                Thay đổi mật khẩu đăng nhập cho tài khoản Admin hiện tại để tăng cường tính bảo mật.
              </p>
            </div>

            {passwordError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}
              >
                <AlertCircle size={18} /> {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#059669',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600
                }}
              >
                <CheckCircle size={18} /> {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Tài khoản quản trị hiện tại</label>
                <input
                  type="text"
                  disabled
                  value={adminUser ? adminUser.username : 'admin'}
                  className="form-input"
                  style={{ background: '#f8fafc', color: '#64748b', fontWeight: 700 }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Mật khẩu cũ *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu hiện tại"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Mật khẩu mới (tối thiểu 6 ký tự) *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu mới"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
              >
                {loading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL THÊM / SỬA SẢN PHẨM ================= */}
      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsProductModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-body">
              <div className="form-group">
                <label className="form-label">Tên sản phẩm thời trang *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Ví dụ: Áo Thun Nam Cotton Compact Trắng"
                  value={productForm.ten_hanghoa}
                  onChange={(e) => setProductForm({ ...productForm, ten_hanghoa: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Giá niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="1000"
                    placeholder="350000"
                    value={productForm.gia}
                    onChange={(e) => setProductForm({ ...productForm, gia: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giá khuyến mãi (VNĐ - nếu có)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    placeholder="299000"
                    value={productForm.gia_khuyen_mai}
                    onChange={(e) => setProductForm({ ...productForm, gia_khuyen_mai: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Thuộc loại hàng (Danh mục) *</label>
                  <select
                    className="form-select"
                    required
                    value={productForm.id_loai}
                    onChange={(e) => setProductForm({ ...productForm, id_loai: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id_loai} value={c.id_loai}>{c.ten_loai}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Số lượng trong kho</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="0"
                    value={productForm.so_luong}
                    onChange={(e) => setProductForm({ ...productForm, so_luong: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Đường dẫn hình ảnh (URL)</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="url"
                    className="form-input"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.hinh_anh}
                    onChange={(e) => setProductForm({ ...productForm, hinh_anh: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  {productForm.hinh_anh && (
                    <img
                      src={productForm.hinh_anh}
                      alt="Preview"
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #cbd5e1' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả chi tiết sản phẩm</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Mô tả form dáng, chất liệu (Cotton Compact, co giãn 4 chiều, siêu nhẹ...)"
                  value={productForm.mo_ta}
                  onChange={(e) => setProductForm({ ...productForm, mo_ta: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="noi_bat"
                  checked={productForm.noi_bat === 1}
                  onChange={(e) => setProductForm({ ...productForm, noi_bat: e.target.checked ? 1 : 0 })}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <label htmlFor="noi_bat" style={{ fontSize: '0.92rem', cursor: 'pointer', fontWeight: 600 }}>
                  Đánh dấu là Sản phẩm nổi bật (Ưu tiên hiển thị tại trang chủ)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  <Save size={18} /> {loading ? 'Đang lưu...' : 'Lưu Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL THÊM / SỬA DANH MỤC ================= */}
      {isCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h3>
              <button className="modal-close-btn" onClick={() => setIsCategoryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="modal-body">
              <div className="form-group">
                <label className="form-label">Tên danh mục hàng *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Ví dụ: Áo Thun Nam, Quần Jean..."
                  value={categoryForm.ten_loai}
                  onChange={(e) => setCategoryForm({ ...categoryForm, ten_loai: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả danh mục</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Mô tả ngắn về dòng sản phẩm..."
                  value={categoryForm.mo_ta}
                  onChange={(e) => setCategoryForm({ ...categoryForm, mo_ta: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  <Save size={18} /> {loading ? 'Đang lưu...' : 'Lưu Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CHI TIẾT ĐƠN HÀNG ================= */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShoppingBag size={22} color="#1d4ed8" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Chi Tiết Đơn Hàng #{selectedOrder.id_hoadon}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
              {/* Order Info Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  background: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    NGƯỜI NHẬN HÀNG
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                    {selectedOrder.ten_khachhang || 'Khách vãng lai'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: '#475569', marginTop: '0.2rem' }}>
                    <Phone size={14} color="#1d4ed8" /> {selectedOrder.sdt_giao || 'Không có số điện thoại'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.88rem', color: '#475569', marginTop: '0.4rem' }}>
                    <MapPin size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: 3 }} /> {selectedOrder.dia_chi_giao || 'Nhận tại cửa hàng'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    THÔNG TIN ĐƠN HÀNG
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '0.3rem' }}>
                    Ngày đặt: <strong>{selectedOrder.ngay_dat_hang}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.88rem', color: '#475569' }}>Trạng thái:</span>
                    <select
                      className="form-select"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
                      value={selectedOrder.trang_thai}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id_hoadon, e.target.value)}
                    >
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Đã hoàn thành">Đã hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                  {selectedOrder.ghi_chu && (
                    <div style={{ fontSize: '0.84rem', color: '#d97706', background: '#fffbeb', padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid #fde68a' }}>
                      <strong>Ghi chú:</strong> {selectedOrder.ghi_chu}
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  DANH SÁCH SẢN PHẨM TRONG ĐƠN
                </h4>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Sản phẩm</th>
                        <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>Size</th>
                        <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>Số lượng</th>
                        <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Đơn giá</th>
                        <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).map((it, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#0f172a' }}>
                            {it.ten_hanghoa}
                          </td>
                          <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', fontWeight: 700, color: '#1d4ed8' }}>
                            {it.size || 'M'}
                          </td>
                          <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', fontWeight: 700 }}>
                            {it.so_luong}
                          </td>
                          <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', color: '#475569' }}>
                            {formatCurrency(it.don_gia)}
                          </td>
                          <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                            {formatCurrency(it.so_luong * it.don_gia)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Phí vận chuyển: <strong style={{ color: '#059669' }}>Miễn phí toàn quốc</strong></div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>Phương thức: <strong>Thanh toán khi nhận hàng (COD)</strong></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>TỔNG THANH TOÁN</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#dc2626' }}>
                    {formatCurrency(selectedOrder.tong_tien)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Printer size={16} color="#1d4ed8" /> In Phiếu Giao Hàng
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
