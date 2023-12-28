import express from "express";
import {
  userAuthentication,
  adminAuthentication,
} from "../middleware/authenticationMiddleware.js";
import uploadFile from "../middleware/fileUpload.js";
import { uploadPlan, getPlan } from "../controllers/plansController.js";

const router = express.Router();

router
  .route("/upload")
  .post(userAuthentication, adminAuthentication, uploadFile, uploadPlan);

router.route("/retrieveFile/:id").post(userAuthentication, getPlan);
export default router;
