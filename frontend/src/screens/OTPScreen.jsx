import { React, useRef } from "react";
import { useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import {
	useGetOTPMethodQuery,
	useSendOTPMutation,
	useVerifyOTPMutation,
} from "../slices/otpSlice";
import { useCheckExistingUserMutation } from "../slices/usersApiSlice";
import { validateEmail, validateIndianPhoneNumber } from "../utils/helper";
import Loader from "../components/Loader";

const OTPScreen = ({
	phone = null,
	mail = null,
	checkExisting = false,
	onCheckOtp,
}) => {
	const [otpSource, setOtpSource] = useState("NONE"); // none, mobile, email, both
	const OTP = useRef("");
	const [isOtpSent, setIsOtpSent] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState(null);
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [userId, setUserId] = useState("");

	const [sendOTP, { isLoading: isLoadingSend, isError: isErrorSend }] =
		useSendOTPMutation();
	const [verifyOTP, { isLoading: isLoadingVerify, isError: isErrorVerify }] =
		useVerifyOTPMutation();
	const { data } = useGetOTPMethodQuery();
	const [checkExistingUser] = useCheckExistingUserMutation();

	const [title, setTitle] = useState("");
	useEffect(() => {
		if (data && data.method) {
			setOtpSource(data.method);
			setTitle("Verify your contact through OTP");
			if (otpSource === "BOTH") {
				setMobile(phone);
				setEmail(mail);
			} else if (mail && otpSource === "EMAIL") {
				setEmail(mail);
			} else if (phone && otpSource === "SMS") {
				setMobile(phone);
				console.log("mobile, phone: ", mobile, phone);
			}
		} else {
			setOtpSource("NONE");
			setTitle("Contact Admin for updating your information");
		}
	}, [data, mobile, phone, mail, otpSource]);

	const sendOTPHandler = async (e, source) => {
		if (e) {
			e.preventDefault();
		}
		console.log("checkExisting", checkExisting);
		if (checkExisting) {
			const existingUser = await checkExistingUser({ mobile, email });
			if (existingUser && existingUser?.data?.isExistingUser) {
				setUserId(existingUser.data.userId);
			} else {
				toast.error("Contact does not exist");
				setSelectedMethod(null);
				return;
			}
		}

		const res = await sendOTP({
			source,
			mobile,
			email,
		});
		console.log("Send OTP response: ", res);
		if (res && res.data) {
			if (!res.data.alreadySent) {
				console.log(res.data.alreadySent);
				toast.success("OTP sent successfully");
			} else if (res.data.alreadySent) {
				toast.success("OTP sent already! Try again after 15 minutes");
			}
			setIsOtpSent(true);
		} else if (isErrorSend) {
			toast.error("Server error");
		} else {
			toast.error("Unable to send OTP. Try again");
		}
	};

	const verifyOTPHandler = async (e) => {
		e.preventDefault();
		const res = await verifyOTP({
			mobileNumber: mobile,
			email,
			enteredOTP: OTP.current,
			selectedMethod,
		});
		console.log("Verify OTP response: ", res);
		if (res && res.data) {
			if (res.data.isOtpSent && res.data.isVerified) {
				toast.success("Verified OTP!");
				if (checkExisting) {
					onCheckOtp({ status: true, userId });
				} else {
					onCheckOtp({ status: true });
				}
			} else if (!res.data.isOtpSent) {
				toast.error("OTP expired! Send OTP again");
				setIsOtpSent(false);
			} else if (!res.data.isVerified) {
				toast.error("Incorrect OTP");
			}
		} else if (isErrorVerify) {
			toast.error("Server error");
		} else {
			toast.error("Server error. Try again");
			onCheckOtp({ status: false });
		}
	};

	const Send = () => {
		return (
			<>
				{!isOtpSent && selectedMethod && (
					<FormContainer>
						{(otpSource === "SMS" || otpSource === "BOTH") && (
							<Form onSubmit={(e) => sendOTPHandler(e, "SMS")}>
								<Form.Group controlId="Mobile Number" className="my-3">
									<Form.Label>Mobile Number</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Mobile Number"
										value={mobile}
										onChange={(e) => setMobile(e.target.value)}
										required
										pattern="^[6-9]\d{9}$"
									></Form.Control>
								</Form.Group>
								<Button type="submit">Send OTP to mobile</Button>
							</Form>
						)}

						{(otpSource === "EMAIL" || otpSource === "BOTH") && (
							<Form onSubmit={(e) => sendOTPHandler(e, "EMAIL")}>
								<Form.Group controlId="email" className="my-3">
									<Form.Label>Email</Form.Label>
									<Form.Control
										type="email"
										placeholder="Enter email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									></Form.Control>
								</Form.Group>
								<Button type="submit">Send OTP to email</Button>
							</Form>
						)}
					</FormContainer>
				)}
			</>
		);
	};

	const Verify = () => {
		return (
			<Form onSubmit={verifyOTPHandler}>
				<Row>
					<Col md={6}>
						<Form.Group name="verifyOTP" className="my-2">
							<Form.Control
								placeholder="Enter OTP"
								type="text"
								defaultValue={OTP.current} // Use defaultValue instead of value
								onChange={(e) => (OTP.current = e.target.value)} // Update the ref value on change
								required
							></Form.Control>
						</Form.Group>

						<Button
							type="submit"
							className="my-2"
							variant="primary"
							disabled={!isOtpSent}
						>
							Verify
						</Button>
					</Col>
				</Row>
			</Form>
		);
	};

	const SelectOtpMethod = () => {
		return (
			<>
				{otpSource && (otpSource === "BOTH" || otpSource === "SMS") && (
					<Button onClick={handleSelectSMS}>Send SMS</Button>
				)}
				{otpSource && (otpSource === "BOTH" || otpSource === "EMAIL") && (
					<Button onClick={handleSelectMail}>Send Email</Button>
				)}
			</>
		);
	};

	const handleSelectSMS = (e) => {
		e.preventDefault();
		setSelectedMethod("SMS");
		console.log("mobile: ", mobile);
		if (mobile && mobile.length > 0) {
			if (validateIndianPhoneNumber(mobile)) {
				sendOTPHandler(e, "SMS");
			} else {
				toast.error("Invalid mobile number");
				setSelectedMethod(null);
			}
		}
	};

	const handleSelectMail = (e) => {
		e.preventDefault();
		setSelectedMethod("EMAIL");
		if (email && email.length > 0) {
			if (validateEmail(email)) {
				sendOTPHandler(e, "EMAIL");
			} else {
				toast.error("Invalid email");
				setSelectedMethod(null);
			}
		}
	};

	return (
		<>
			<FormContainer className="my-3">
				<h3 className="mt-3">{title}</h3>
				{/* <Image src={otp_image} fluid></Image> */}
				{otpSource && otpSource !== "NONE" && (
					<>
						{!selectedMethod ? (
							<SelectOtpMethod />
						) : !isOtpSent && !phone && !mail ? (
							<Send />
						) : (
							<Verify />
						)}
					</>
				)}
				{(isLoadingSend || isLoadingVerify) && <Loader />}
			</FormContainer>
		</>
	);
};

export default OTPScreen;
