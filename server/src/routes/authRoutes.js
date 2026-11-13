import { Router } from 'express';
import {
  register,
  login,
  adminLogin,
  getMe,
  getAllCustomers,
  deleteCustomer,
  changeAdminPassword
} from '../controllers/authController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/me', verifyToken, getMe);

// Quản lý khách hàng (Admin)
router.get('/customers', verifyAdmin, getAllCustomers);
router.delete('/customers/:id', verifyAdmin, deleteCustomer);
router.put('/change-admin-password', verifyAdmin, changeAdminPassword);

export default router;
