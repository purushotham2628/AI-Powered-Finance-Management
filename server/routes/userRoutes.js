import express from 'express';
import {
  createOrUpdateUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createOrUpdateUser);
router.get('/:uid', getUserProfile);
router.put('/:uid', updateUserProfile);
router.delete('/:uid', deleteUser);

export default router;
