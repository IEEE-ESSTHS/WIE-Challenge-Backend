import express from 'express'
import {admin} from '../middleware/authMiddleware.js'
import {
  getTrees,
  getTreeBySpecie,
  createTree,
  deleteTree,
  updateTree
} from '../controllers/treeController.js'
const router = express.Router()

router.route('/').get(getTrees).post(admin, createTree)
router.route('/:specie').get(getTreeBySpecie).put(admin, updateTree).delete(admin, deleteTree)

export default router