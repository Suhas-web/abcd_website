import errorHandler from "../middleware/errorHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateTokenUtil.js";

// desc: Auth
// endpoint: POST /api/users/login
// Access: public
const authUser = errorHandler(async (req, res) => {
  const { contact, password } = req.body;
  const user = await User.findOne({ contact: contact });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      contact: user.contact,
      isAdmin: user.isAdmin,
      membershipPlan: user.membershipPlan,
      validTill: user.validTill,
      isTrainingPlanAvailable: user.isTrainingPlanAvailable,
    });
  } else {
    res.status(401);
    throw new Error("Invalid contact or contact not found");
  }
});

// desc: Create user
// endpoint: POST /api/users
// Access: public
const registerUser = errorHandler(async (req, res) => {
  const { name, contact, password } = req.body;
  const userExist = await User.findOne({ contact });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({ name, contact, password });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      contact: user.contact,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// desc: Logout user / clear cookie
// endpoint: POST /api/users/logout
// Access: private
const logoutUser = errorHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// desc: GET user profile
// endpoint: GET /api/users/profile
// Access: private
const getUserProfile = errorHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      contact: user.contact,
      isAdmin: user.isAdmin,
      membershipPlan: user.membershipPlan,
      validTill: user.validTill,
    });
  } else {
    res.status(404);
    throw new Error("Not found user data");
  }
});

// desc: Update user profile
// endpoint: PUT /api/users/profile
// Access: private
const updateUserProfile = errorHandler(async (req, res) => {
  const user = await User.findById(req.body._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.contact = req.body.contact || user.contact;
    if (req.body.password) {
      user.password = req.body.password;
    }
    try {
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        contact: updatedUser.contact,
        isAdmin: updatedUser.isAdmin,
      });
    } catch (error) {
      console.log(error);
      res.status(500);
      throw new Error("Error updating user");
    }
  } else {
    res.status(404);
    throw new Error("Not found user data");
  }
});

// desc: GET users
// endpoint: GET /api/users
// Access: private/admin
const getUsers = errorHandler(async (req, res) => {
  res.status(200).json(await User.find({}, { password: 0 }));
});

// desc: GET user by id
// endpoint: GET /api/users/:id
// Access: private/admin
const getUserById = errorHandler(async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// desc: PUT users
// endpoint: PUT /api/users/:id
// Access: private/admin
const updateUser = errorHandler(async (req, res) => {
  const user = await User.findById({ _id: req.body._id });
  if (user) {
    user.name = req.body.name || user.name;
    user.contact = req.body.contact || user.contact;
    user.isAdmin = Boolean(req.body.isAdmin);
    user.membershipPlan = req.body.membershipPlan || user.membershipPlan;
    user.validTill = user.validTill;

    try {
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        contact: updatedUser.contact,
        isAdmin: updatedUser.isAdmin,
        membershipPlan: updateUser.membershipPlan,
        validTill: updatedUser.validTill,
      });
    } catch (err) {
      res.status(500);
      console.log(err);
      throw new Error("Error updating user");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// desc: DELETE users
// endpoint: DELETE /api/users/:id
// Access: private/admin
const deleteUserProfile = errorHandler(async (req, res) => {
  console.log("DELETE USER");
  const user = await User.findById(req.params.id);
  if (user) {
    try {
      await User.deleteOne({ _id: user._id });
      res.status(200).send("Deleted successfully");
    } catch (err) {
      res.status(500);
      console.log(err);
      throw new Error("Error deleting user");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUserProfile,
};
