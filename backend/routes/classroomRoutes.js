import express from 'express'
import {protect, protectKid, admin} from '../middleware/authMiddleware.js'
import {
  getClassrooms,
  getClassroomById,
  createClassroom,
  deleteClassroom,
  updateClassroom,
  getClassroomKids,
  addKidToClassroom,
  removeKidFromClassroom,
  getTeacherClassrooms,
  getKidClassrooms
} from '../controllers/classroomController.js'
const router = express.Router()

router.route('/').get(admin, getClassrooms).post(protect, createClassroom)
router.route('/teacher').get(protect, getTeacherClassrooms)
router.route('/kids').get(protectKid, getKidClassrooms)
router.route('/:id/kids').get(protect, getClassroomKids).post(protect, addKidToClassroom).delete(protect, removeKidFromClassroom)
router.route('/:id').get(getClassroomById).put(protect, updateClassroom).delete(protect, deleteClassroom)

export default router