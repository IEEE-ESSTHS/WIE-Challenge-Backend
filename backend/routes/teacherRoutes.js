import express from 'express'
import {protect, admin} from '../middleware/authMiddleware.js'
import {
  authTeacher,
  registerTeacher,
  getTeacherProfile,
  updateTeacherProfile,
  getTeachers,
  deleteTeacher,
  getTeacherById
} from '../controllers/teacherController.js'
const router = express.Router()

router.route('/').post(registerTeacher).get(admin, getTeachers)
router.post('/login', authTeacher)
router.route('/profile').get(protect, getTeacherProfile).put(protect, updateTeacherProfile)
router.route('/:id').get(admin, getTeacherById).delete(admin, deleteTeacher)

export default router