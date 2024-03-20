// Like express give you access of req.body similarly multer gives you access of req.files //
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

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

export default router;
