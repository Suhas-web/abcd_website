import errorHandler from "../middleware/errorHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateTokenUtil.js";

// desc: Auth
// endpoint: POST /api/users/login
// Access: public
const authUser = errorHandler(async (req, res) => {
	const { mobile, password } = req.body;
	const user = await User.findOne({ mobile: mobile });
	if (user && (await user.matchPassword(password))) {
		generateToken(res, user._id);
		res.json({
			_id: user._id,
			name: user.name,
			mobile: user.mobile,
			email: user.email,
			isAdmin: user.isAdmin,
			membershipPlan: user.membershipPlan,
			validTill: user.validTill,
			isTrainingPlanAvailable: user.isTrainingPlanAvailable,
		});
	} else {
		res.status(401);
		throw new Error("Invalid mobile number ");
	}
});

// desc: Create user
// endpoint: POST /api/users
// Access: public
const registerUser = errorHandler(async (req, res) => {
	const { name, mobile, email, password } = req.body;
	const userExist = await User.findOne({ mobile });
	if (userExist) {
		res.status(400);
		throw new Error("User already exists");
	}
	const user = await User.create({ name, mobile, email, password });
	if (user) {
		generateToken(res, user._id);
		res.status(201).json({
			_id: user._id,
			name: user.name,
			mobile: user.mobile,
			email: user.email,
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

// desc: Check if mobile number is existing
// endpoint: GET /api/users/profile
// Access: private
const getExistingMobile = errorHandler(async (req, res) => {
	const user = await User.find({ mobile: req.body.mobile });
	if (user && user.length > 0) {
		res.status(200).json({
			isExistingMobile: true,
		});
	} else {
		res.status(200).json({
			isExistingMobile: false,
		});
	}
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
			mobile: user.mobile,
			email: user.email,
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
		user.mobile = req.body.mobile || user.mobile;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}
		try {
			const updatedUser = await user.save();
			res.status(200).json({
				_id: updatedUser._id,
				name: updatedUser.name,
				mobile: updatedUser.mobile,
				email: updateUser.email,
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

// desc: Reset user password
// endpoint: PUT /api/users/reset
// Access: any
const updateUserPassword = async (req, res) => {
	const user = await User.findOne({ mobile: req.body.mobile });
	if (user) {
		if (req.body.password) {
			user.password = req.body.password;
		} else {
			res.status(400);
			throw new Error("Bad request");
		}
		try {
			const updatedUser = await user.save();
			res.status(200).json({
				_id: updatedUser._id,
			});
		} catch (error) {
			console.log(error);
			res.status(500);
			throw new Error("Error reset password");
		}
	} else {
		res.status(404);
		throw new Error("Not found user data");
	}
};

// desc: GET users
// endpoint: GET /api/users
// Access: private/admin
const getUsers = errorHandler(async (req, res) => {
	const pageSize = Number(process.env.PAGINATION_LIMIT);
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword
		? { name: { $regex: req.query.keyword, $options: "i" } }
		: {};
	const totalUsers = await User.countDocuments({ ...keyword });

	const users = await User.find({ ...keyword }, { password: 0 })
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	res
		.status(200)
		.json({ users, page, pages: Math.ceil(totalUsers / pageSize) });
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
	const user = await User.findById({ _id: req.params.id });
	if (user) {
		const userExist = await User.findOne({ mobile: req.body.mobile });
		if (userExist && userExist.length > 0) {
			console.log(userExist);
			res.status(400);
			throw new Error("User already exists");
		} else {
			user.name = req.body.name || user.name;
			user.mobile = req.body.mobile || user.mobile;
			user.email = req.body.email || user.email;
			user.isAdmin = Boolean(req.body.isAdmin);
			user.membershipPlan = req.body.membershipPlan || user.membershipPlan;
			user.validTill = user.validTill;

			try {
				const updatedUser = await user.save();
				res.status(200).json({
					_id: updatedUser._id,
					name: updatedUser.name,
					mobile: updatedUser.mobile,
					email: updateUser.email,
					isAdmin: updatedUser.isAdmin,
					membershipPlan: updateUser.membershipPlan,
					validTill: updatedUser.validTill,
				});
			} catch (err) {
				res.status(500);
				console.log(err);
				throw new Error("Error updating user");
			}
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

// desc: Create user
// endpoint: POST /api/users
// Access: Admin
const createNewUser = errorHandler(async (req, res) => {
	const { name, mobile, email, password } = req.body;
	const userExist = await User.findOne({ mobile });
	if (userExist) {
		res.status(400);
		throw new Error("User already exists");
	}
	const isAdmin = Boolean(req.body.isAdmin) || false;
	const user = await User.create({ name, mobile, email, password, isAdmin });
	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			mobile: user.mobile,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
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
	getExistingMobile,
	updateUserPassword,
	createNewUser,
};
