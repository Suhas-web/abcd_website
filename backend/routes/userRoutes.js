import express from "express";
import {
  userAuthentication,
  adminAuthentication,
} from "../middleware/authenticationMiddleware.js";

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router
  .route("/register")
  .post(registerUser)
  .get(userAuthentication, adminAuthentication, getUsers);
router.post("/logout", logoutUser);
router.post("/auth", authUser);
router
  .route("/profile")
  .get(userAuthentication, getUserProfile)
  .put(userAuthentication, updateUserProfile);
router
  .route("/:id")
  .delete(userAuthentication, adminAuthentication, deleteUserProfile)
  .get(userAuthentication, adminAuthentication, getUserById)
  .put(userAuthentication, adminAuthentication, updateUser);
router
  .route("/")
  .get(userAuthentication, adminAuthentication, getUsers)
  .delete(userAuthentication, adminAuthentication, deleteUserProfile);

export default router;
