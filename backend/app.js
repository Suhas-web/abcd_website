import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import { notFound, customErrorHandler } from "./middleware/errorMiddleware.js";
import connection from "./config/db.js";
connection();

let app = express();
//body parser midlleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie-parser middleware
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/OTP", messagesRoutes);
app.use("/api/promotion", promotionRoutes);

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
	//set static folder
	app.use(express.static(path.join(__dirname, "/frontend/build")));

	//any route not defined will be send to index.html
	app.use("*", (req, res) =>
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
	);
} else {
	app.get("/", (req, res) => {
		res.send("API running");
	});
}

app.use(notFound);
app.use(customErrorHandler);

export default app;
