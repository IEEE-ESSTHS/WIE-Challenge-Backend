import express from 'express'
import {protect, protectKid, admin} from '../middleware/authMiddleware.js'
import {
  authKid,
  registerKid,
  getKidProfile,
  updateKidProfile,
  getKids,
  deleteKid,
  getKidById,
  changeKidLevel,
  addPoints,
  addTask,
  removeTask
} from '../controllers/kidController.js'
const router = express.Router()

router.route('/').post(registerKid).get(protect, getKids)
router.post('/login', authKid)
router.route('/admin').get(admin, getKids)
router.route('/profile').get(protectKid, getKidProfile).put(protectKid, updateKidProfile)
router.post('/:id/level', changeKidLevel)
router.post('/:id/points', addPoints)
router.route('/:id/tasks').post(protect, addTask).delete(protect, removeTask)
router.route('/:id/admin').get(admin, getKidById)
router.route('/:id').get(protect, getKidById).delete(admin, deleteKid)

export default router