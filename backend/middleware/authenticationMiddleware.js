import jwt from "jsonwebtoken";
import errorHandler from "./errorHandler.js";
import User from "../models/userModel.js";

const userAuthentication = errorHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.jwtSecret);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Unauthorized: token failed");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized: no token");
  }
});

const adminAuthentication = errorHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Unauthorized: Not admin");
  }
});

export { userAuthentication, adminAuthentication };
