import { google } from "googleapis";
import nodemailer from "nodemailer";
import errorHandler from "../middleware/errorHandler.js";
import apiKey from "../apiKey.json" assert { type: "json" };
const SCOPE = ["https://www.googleapis.com/auth/gmail.send"];

// const SERVICE_ACCOUNT_EMAIL = "YOUR_SERVICE_ACCOUNT_EMAIL";
// const PRIVATE_KEY = "YOUR_PRIVATE_KEY"; // This should be the private key from your service account credentials

// const authorize = async () => {
//   const jwtClient = new google.auth.JWT(
//     apiKey.client_email,
//     null,
//     apiKey.private_key,
//     SCOPE
//   );
//   await jwtClient.authorize();
//   return jwtClient;
// };

// // const jwtClient = new google.auth.JWT({
// //   email: SERVICE_ACCOUNT_EMAIL,
// //   key: PRIVATE_KEY,
// //   scopes: ["https://www.googleapis.com/auth/gmail.send"], // Scope for sending emails
// // });
// const sendEmail = errorHandler(async (req, res) => {
//   authorize().then(function (err, tokens) {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: SERVICE_ACCOUNT_EMAIL,
//         accessToken: tokens.access_token,
//       },
//     });

//     const mailOptions = {
//       from: `SENDER_NAME <${apiKey.client_email}>`,
//       to: "smssuhas2@gmail.com",
//       subject: "Hello from Node.js",
//       text: "Hello world!",
//       html: "<p>Hello world!</p>",
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//         res.status(500).send("Send email fail");
//       } else {
//         console.log("Email sent: " + info.response);
//         res.status(200).send("Send email success");
//       }
//     });
//   });
// });

// const sendEmail = errorHandler(async (req, res) => {
//   try {
//     const jwtClient = await authorize();
//     const tokens = await jwtClient.getAccessToken();
//     console.log("Token success", tokens);
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         // type: "OAuth2",
//         user: apiKey.client_email,
//         accessToken: tokens.token,
//       },
//     });
//     console.log("transporter", transporter);
//     const mailOptions = {
//       from: apiKey.client_email,
//       to: "smsuhas2@gmail.com",
//       subject: "Hello from Node.js",
//       text: "Hello world!",
//     };
//     console.log("Mail options", mailOptions);
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//         res.status(500).send("Send email fail");
//       } else {
//         console.log("Email sent: " + info.response);
//         res.status(200).send("Send email success");
//       }
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

const sendEmail = async (sub, receivers, emailBody) => {
	console.log("sub, recievers, emailBody: ", sub, receivers, emailBody);
	const transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.EMAIL_APP_PASSWORD,
		},
	});
	const mailOptions = {
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
		}
	};

	const resp = await sendMail(transporter, mailOptions);
	return resp;
};
export { sendEmail };
