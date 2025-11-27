//
import { Router } from 'express';
import {
  createUserProfileController,
  getUserProfileController,
  updateUserProfileController,
  deleteUserProfileController,
} from '../controller/userProfileController';

const userProfileRouter = Router();

/**
 * POST   /api/user_profiles           -> create profile
 * GET    /api/user_profiles/:userId   -> get profile by user id
 * PUT    /api/user_profiles/:userId   -> update profile by user id
 * DELETE /api/user_profiles/:userId   -> delete profile by user id
 */

userProfileRouter.post('/', createUserProfileController);
userProfileRouter.get('/:userId', getUserProfileController);
userProfileRouter.put('/:userId', updateUserProfileController);
userProfileRouter.delete('/:userId', deleteUserProfileController);

export default userProfileRouter;