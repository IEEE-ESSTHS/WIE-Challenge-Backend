import express from 'express'
import {protect, admin} from '../middleware/authMiddleware.js'
import {
  getTasks,
  getTaskById,
  createTask,
  deleteTask,
  updateTask
} from '../controllers/taskController.js'
const router = express.Router()

router.route('/').get(protect, getTasks).post(protect, createTask)
router.route('/admin').get(admin, getTasks)
router.route('/:id').get(getTaskById).put(protect, updateTask).delete(protect, deleteTask)

export default router