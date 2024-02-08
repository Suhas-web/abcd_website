import axios from "axios";
import errorHandler from "../middleware/errorHandler.js";
import OTP from "../models/otpModel.js";
import { sendEmail } from "./emailController.js";

const sendOTPSMS = errorHandler(async (req, res) => {
	const mobile = req.body.mobile;
	if (!mobile) {
		return res.status(500);
	}
	const randomDigits = Math.floor(1000 + Math.random() * 9000);
	const existingOTP = await OTP.find({ mobileNumber: mobile });

	if (existingOTP.length == 0) {
		saveOTP(mobile, randomDigits).then((savedDB) => {
			if (savedDB) {
				try {
					const data = new URLSearchParams();
					data.append("variables_values", randomDigits);
					data.append("route", "otp");
					data.append("numbers", mobile);
					axios({
						method: "post",
						url: "https://www.fast2sms.com/dev/bulkV2",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							authorization: process.env.FAST2SMS_API_KEY,
						},
						data: data.toString(),
					}).then((response) => {
						console.log("Fast2SMS response: ", response);
						return res.status(200).json({
							isError: false,
							alreadySent: false,
							message: "Success",
						});
					});
				} catch (error) {
					if (error.response) {
						// The API responded with a non-2xx status code
						const { status } = error.response;
						return res.status(status).json({
							isError: true,
							alreadySent: false,
							message: `API request failed with status ${status}`,
						});
					} else if (error.request) {
						// The request was made, but no response was received
						return res.status(500).json({
							isError: true,
							alreadySent: false,
							message: `No response from SMS service`,
						});
					} else {
						// Other errors occurred
						return res.status(500).json({
							isError: true,
							alreadySent: false,
							message: `Error occured from SMS service`,
						});
					}
				}
			} else {
				return res.status(500).json({
					isError: true,
					alreadySent: false,
					message: `Error occured when saving OTP in DB`,
				});
			}
		});
	} else {
		res.status(200).json({
			isError: false,
			alreadySent: true,
			message: "OTP already sent. Try again after 15 minutes",
		});
	}
});

const saveOTP = async (mobile, otpNumber, email) => {
	if (mobile) {
		const mobileNumber = Number(mobile);
		try {
			const otp = new OTP({ mobileNumber, otpNumber });
			const res = await otp.save();
			console.log("OTP created successfully:", otp);
			return res;
		} catch (error) {
			console.error("Error creating OTP:", error);
		}
	}
	if (email) {
		try {
			const otp = new OTP({ email, otpNumber });
			const res = await otp.save();
			console.log("OTP created successfully:", otp);
			return res;
		} catch (error) {
			console.error("Error creating OTP:", error);
		}
	}
};

const verifyOTP = errorHandler(async (req, res) => {
	const { mobileNumber, email, enteredOTP, selectedMethod } = req.body;
	const existingOTP =
		selectedMethod === "SMS"
			? await OTP.findOne({ mobileNumber: mobileNumber })
			: await OTP.findOne({ email: email });
	console.log("existingOTP: ", existingOTP);
	if (existingOTP && (await existingOTP.matchOTP(enteredOTP))) {
		res.status(200).json({ isOtpSent: true, isVerified: true });
	} else if (existingOTP) {
		res.status(200).json({ isOtpSent: true, isVerified: false });
	} else {
		res.status(200).json({ isOtpSent: false, isVerified: false });
	}
});

const getOTPMethod = errorHandler(async (req, res) => {
	let type = "NONE";
	if (process.env.OTP_METHOD) {
		if (
			process.env.OTP_METHOD === "EMAIL" ||
			process.env.OTP_METHOD === "SMS" ||
			process.env.OTP_METHOD === "NONE" ||
			process.env.OTP_METHOD === "BOTH"
		) {
			type = process.env.OTP_METHOD;
		}
	}
	return res.status(200).json({ method: type });
});

const sendOTPHandler = errorHandler(async (req, res) => {
	if (req.body.source) {
		if (req.body.source === "SMS") {
			sendOTPSMS(req, res);
		} else if (req.body.source === "EMAIL") {
			sendEmailHandler(req, res);
		} else {
			res.status(500);
		}
	} else {
		return res.status(400).send("Bad request");
	}
});

const sendEmailHandler = errorHandler(async (req, res) => {
	const email = req.body.email;
	if (!email) {
		return res.status(500);
	}
	const randomDigits = Math.floor(1000 + Math.random() * 9000);
	const existingOTP = await OTP.find({ email: email });
	if (existingOTP.length == 0) {
		const sub = "Verify OTP for ABCD";
		const emailBody = `Please use ${randomDigits} to verify OTP`;
		try {
			const mailResponse = await sendEmail(sub, email, emailBody);
			if (mailResponse) {
				saveOTP(null, randomDigits, email).then((savedDB) => {
					if (savedDB) {
						return res.status(200).json({
							isError: false,
							alreadySent: false,
							message: "Success",
						});
					} else {
						return res.status(500).json({
							isError: true,
							alreadySent: false,
							message: `Error occured when saving OTP in DB`,
						});
					}
				});
			} else {
				return res.status(500).json({
					isError: true,
					alreadySent: false,
					message: "Error sending email",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				isError: true,
				alreadySent: false,
				message: "Error sending email",
			});
		}
	} else {
		res.status(200).json({
			isError: false,
			alreadySent: true,
			message: "OTP already sent. Try again after 15 minutes",
		});
	}
});

export { sendOTPSMS, verifyOTP, getOTPMethod, sendOTPHandler };
