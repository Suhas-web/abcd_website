import express from "express";
import { userAuthentication } from "../middleware/authenticationMiddleware.js";
import { sendEmail } from "../controllers/emailController.js";
import {
	sendOTPSMS,
	verifyOTP,
	getOTPMethod,
	sendOTPHandler,
} from "../controllers/smsController.js";
const router = express.Router();

router.route("/email").post(userAuthentication, sendEmail);
router.route("/sms").post(sendOTPSMS);
router.route("/send").post(sendOTPHandler);
router.route("/verify").post(verifyOTP);
router.get("/otp-method", getOTPMethod);

export default router;
