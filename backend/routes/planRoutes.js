import express from "express";
import {
	userAuthentication,
	adminAuthentication,
} from "../middleware/authenticationMiddleware.js";
import { uploadFile } from "../middleware/fileUpload.js";
import {
	uploadPlan,
	getPlan,
	getPlanList,
} from "../controllers/plansController.js";

const router = express.Router();

router
	.route("/upload")
	.post(userAuthentication, adminAuthentication, uploadFile, uploadPlan);

router.route("/retrieveFile/:id").post(userAuthentication, getPlan);

router.route("/history").get(userAuthentication, getPlanList);
export default router;
