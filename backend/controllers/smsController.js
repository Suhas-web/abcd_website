import axios from "axios";
import errorHandler from "../middleware/errorHandler.js";
import OTP from "../models/otpModel.js";

const sendOTP = errorHandler(async (req, res) => {
  const mobile = req.body.mobileNumber;
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const existingOTP = await OTP.find({ mobileNumber: mobile });

  if (existingOTP.length == 0) {
    saveOTP(mobile, randomDigits).then((savedDB) => {
      console.log("savedDB", savedDB);
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

const saveOTP = async (mobile, otpNumber) => {
  const mobileNumber = Number(mobile);
  console.log("TypeOf");
  console.log(typeof mobileNumber);
  console.log(typeof otpNumber);
  try {
    const otp = new OTP({ mobileNumber, otpNumber });
    const res = await otp.save();
    console.log("OTP created successfully:", otp);
    return res;
  } catch (error) {
    console.error("Error creating OTP:", error);
  }
};

const verifyOTP = errorHandler(async (req, res) => {
  const { mobileNumber, enteredOTP } = req.body;
  const existingOTP = await OTP.findOne({ mobileNumber: mobileNumber });
  if (existingOTP && (await existingOTP.matchOTP(enteredOTP))) {
    res.status(200).json({ isOtpSent: true, isVerified: true });
  } else if (OTP) {
    res.status(200).json({ isOtpSent: true, isVerified: false });
  } else {
    res.status(200).json({ isOtpSent: false, isVerified: false });
  }
});
export { sendOTP, verifyOTP };
