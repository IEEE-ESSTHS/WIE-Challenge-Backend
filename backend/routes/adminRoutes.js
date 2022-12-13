import express from 'express'
import {admin} from '../middleware/authMiddleware.js'
import {
  authAdmin,
  registerAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAdmins,
  deleteAdmin,
  getAdminById
} from '../controllers/adminController.js'
const router = express.Router()

router.route('/').post(registerAdmin).get(admin, getAdmins)
router.post('/login', authAdmin)
router.route('/profile').get(admin, getAdminProfile).put(admin, updateAdminProfile)
router.route('/:id').get(admin, getAdminById).delete(admin, deleteAdmin)

export default router