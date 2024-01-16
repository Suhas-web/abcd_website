import express from "express";
import {
	userAuthentication,
	adminAuthentication,
} from "../middleware/authenticationMiddleware.js";
import { sendEmail } from "../controllers/emailController.js";
import { sendOTP, verifyOTP } from "../controllers/smsController.js";
const router = express.Router();

router.route("/email").post(userAuthentication, sendEmail);
router.route("/sms").post(sendOTP);
router.route("/verify").post(verifyOTP);
export default router;
