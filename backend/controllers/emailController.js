import nodemailer from "nodemailer";
import errorHandler from "../middleware/errorHandler.js";
import User from "../models/userModel.js";

const sendEmail = async (sub, receivers, emailBody, attachments = null) => {
	console.log("sub, recievers, emailBody: ", sub, receivers, emailBody);
	const transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.EMAIL_APP_PASSWORD,
		},
	});
	const mailOptions = attachments
		? {
				from: {
					name: "ABCD",
					address: process.env.USER_EMAIL,
				},
				bcc: receivers,
				subject: sub,
				text: emailBody,
				attachments: attachments,
		  }
		: {
				from: {
					name: "ABCD",
					address: process.env.USER_EMAIL,
				},
				to: receivers,
				subject: sub,
				text: emailBody,
		  };

	const sendMail = async (transporter, mailOptions) => {
		console.log("mailOptions: ", mailOptions);
		try {
			const mailResponse = await transporter.sendMail(mailOptions);
			return mailResponse;
		} catch (error) {
			console.log(error);
			throw new Error("Failed to send mail");
		}
	};

	const resp = await sendMail(transporter, mailOptions);
	return resp;
};

const sendPromotion = errorHandler(async (req, res) => {
	console.log("Running send promotion");
	const { subject, messageBody } = req.body; // Extracting data from request body

	// Check if attachments exist
	let attachedFiles = [];
	if (req.files && req.files.length > 0) {
		// If there are attachments
		attachedFiles = req.files.map((file) => ({
			filename: file.originalname,
			content: file.buffer,
		}));
	}
	const recievers = await getUsersEmails();

	try {
		await sendEmail(subject, recievers, messageBody, attachedFiles);
		res.status(200).json({ success: true, message: "Email sent successfully" });
	} catch (error) {
		console.error("Error sending email:", error);
		res.status(500).json({ success: false, message: "Failed to send email" });
	}
});

async function getUsersEmails() {
	try {
		const users = await User.find({ isAdmin: false }, "email"); // Retrieve all users' emails
		const uniqueEmails = [...new Set(users.map((user) => user.email))]; // Extract unique emails

		return uniqueEmails;
	} catch (error) {
		console.error("Error retrieving users emails:", error);
		throw new Error("Failed to retrieve users emails");
	}
}

export { sendEmail, sendPromotion };
