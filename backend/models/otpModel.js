import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema(
	{
		mobileNumber: {
			type: Number,
			unique: true, // Ensure no duplicate mobileNumber exists
		},
		email: {
			type: String,
			unique: true,
			sparse: true,
		},
		otpNumber: {
			type: String,
			required: true,
			sparse: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			expires: 900, // This will remove the document after 15 minutes
		},
	},
	{ timestamps: true }
);

otpSchema.methods.matchOTP = async function (enteredOTP) {
	return await bcrypt.compare(enteredOTP, this.otpNumber);
};

otpSchema.pre("save", async function (next) {
	if (!this.isModified("otpNumber")) {
		next();
	}
	console.log("typeOf otpNumber", typeof this.otpNumber);
	const salt = await bcrypt.genSalt(10);
	this.otpNumber = await bcrypt.hash(String(this.otpNumber), salt);
});

const OTP = new mongoose.model("OTP", otpSchema);
export default OTP;
