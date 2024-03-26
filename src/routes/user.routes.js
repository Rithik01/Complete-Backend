// Like express give you access of req.body similarly multer gives you access of req.files //
import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  deleteUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

// This below is using a middleware to handle file uploads before the route handler gets called. //
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },

    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/getUser").get(verifyJWT, getCurrentUser);

// Secured routes //
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/updateUser").patch(verifyJWT, updateUserDetails);
router.route("/changepassword").post(verifyJWT, changeCurrentPassword);
router.route("/deleteUser").delete(verifyJWT, deleteUser);

export default router;
