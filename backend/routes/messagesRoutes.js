import express from "express";
import {
  userAuthentication,
  adminAuthentication,
} from "../middleware/authenticationMiddleware.js";
import { setup, sendMail } from "../controllers/emailController.js";
import { sendOTP, verifyOTP } from "../controllers/smsController.js";
const router = express.Router();

router.route("/email").get(userAuthentication, sendMail);
router.route("/sms").post(userAuthentication, sendOTP);
router.route("/verify").post(userAuthentication, verifyOTP);
export default router;
