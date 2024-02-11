import express from "express";
import {
	userAuthentication,
	adminAuthentication,
} from "../middleware/authenticationMiddleware.js";
import { uploadMultiple } from "../middleware/fileUpload.js";
import { sendPromotion } from "../controllers/emailController.js";

const router = express.Router();
router
	.route("/")
	.post(userAuthentication, adminAuthentication, uploadMultiple, sendPromotion);
export default router;
