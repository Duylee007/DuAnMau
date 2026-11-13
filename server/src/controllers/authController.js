import { db } from '../db/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_shopao_jwt_key_2026';

// Đăng ký khách hàng mới
export const register = (req, res) => {
  try {
    const { ten_khachhang, email, password, dien_thoai, dia_chi } = req.body;

    if (!ten_khachhang || !email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu' });
    }

    const checkUser = db.prepare('SELECT id_khachhang FROM khachhang WHERE email = ?').get(email);
    if (checkUser) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const insert = db.prepare(`
      INSERT INTO khachhang (ten_khachhang, email, password, dien_thoai, dia_chi)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insert.run(ten_khachhang, email, hashedPassword, dien_thoai || '', dia_chi || '');

    const newUser = db.prepare(`
      SELECT id_khachhang, ten_khachhang, email, dien_thoai, dia_chi, ngay_dang_ky
      FROM khachhang WHERE id_khachhang = ?
    `).get(result.lastInsertRowid);

    const token = jwt.sign(
      { id: newUser.id_khachhang, email: newUser.email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      user: { ...newUser, role: 'customer' },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

// Đăng nhập khách hàng
export const login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = db.prepare('SELECT * FROM khachhang WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(
      { id: user.id_khachhang, email: user.email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: { ...userWithoutPassword, role: 'customer' },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

// Đăng nhập Quản trị viên (Admin)
export const adminLogin = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }

    const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Tài khoản admin không đúng' });
    }

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu admin không đúng' });
    }

    const token = jwt.sign(
      { id: admin.id_admin, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập quản trị thành công',
      user: {
        id_admin: admin.id_admin,
        username: admin.username,
        ten_hien_thi: admin.ten_hien_thi,
        role: 'admin'
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

// Lấy thông tin user hiện tại qua Token
export const getMe = (req, res) => {
  try {
    const { id, role } = req.user;
    if (role === 'admin') {
      const admin = db.prepare('SELECT id_admin, username, ten_hien_thi FROM admin WHERE id_admin = ?').get(id);
      if (!admin) return res.status(404).json({ success: false, message: 'Không tìm thấy admin' });
      return res.json({ success: true, user: { ...admin, role: 'admin' } });
    }

    const customer = db.prepare(`
      SELECT id_khachhang, ten_khachhang, email, dien_thoai, dia_chi, ngay_dang_ky
      FROM khachhang WHERE id_khachhang = ?
    `).get(id);

    if (!customer) return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
    res.json({ success: true, user: { ...customer, role: 'customer' } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

// Admin: Lấy danh sách khách hàng kèm số đơn hàng và chi tiêu
export const getAllCustomers = (req, res) => {
  try {
    const customers = db.prepare(`
      SELECT k.id_khachhang, k.ten_khachhang, k.email, k.dien_thoai, k.dia_chi, k.ngay_dang_ky,
             COUNT(h.id_hoadon) AS so_don_hang,
             COALESCE(SUM(h.tong_tien), 0) AS tong_chi_tieu
      FROM khachhang k
      LEFT JOIN hoadon h ON k.id_khachhang = h.id_khachhang
      GROUP BY k.id_khachhang
      ORDER BY k.id_khachhang DESC
    `).all();
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

// Admin: Xóa khách hàng
export const deleteCustomer = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM khachhang WHERE id_khachhang = ?').run(id);
    res.json({ success: true, message: 'Đã xóa tài khoản khách hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};

// Admin: Đổi mật khẩu tài khoản quản trị
export const changeAdminPassword = (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ mật khẩu cũ và mới' });
    }
    const adminId = req.user.id;
    const admin = db.prepare('SELECT * FROM admin WHERE id_admin = ?').get(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản quản trị' });
    }

    if (!bcrypt.compareSync(oldPassword, admin.password)) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác' });
    }

    const hash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE admin SET password = ? WHERE id_admin = ?').run(hash, adminId);
    res.json({ success: true, message: 'Đổi mật khẩu quản trị thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
  }
};
