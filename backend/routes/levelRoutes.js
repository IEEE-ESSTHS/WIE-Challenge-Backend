import express from 'express'
import {protect, admin} from '../middleware/authMiddleware.js'
import {
  getLevels,
  getLevelById,
  createLevel,
  deleteLevel,
  updateLevel
} from '../controllers/levelController.js'
const router = express.Router()

router.route('/').get(protect, getLevels).post(protect, createLevel)
router.route('/admin').get(admin, getLevels)
router.route('/:id').get(getLevelById).put(protect, updateLevel).delete(admin, deleteLevel)

export default router