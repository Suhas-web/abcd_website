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
	getClassicPlan,
} from "../controllers/plansController.js";

const router = express.Router();

router
	.route("/upload")
	.post(userAuthentication, adminAuthentication, uploadFile, uploadPlan);

router.route("/retrieveFile/:id").post(userAuthentication, getPlan);
router.route("/classic").get(userAuthentication, getClassicPlan);
router.route("/history").get(userAuthentication, getPlanList);
export default router;
