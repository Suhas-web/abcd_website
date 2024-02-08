import React, { useEffect, useState, useCallback, useRef } from "react";
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
// Constants for OTP source
const OTP_SOURCE = {
	NONE: "NONE",
	BOTH: "BOTH",
	EMAIL: "EMAIL",
	SMS: "SMS",
};
const OTPScreen = ({
	phone = null,
	mail = null,
	checkExisting = false,
	onCheckOtp,
}) => {
	const [otpSource, setOtpSource] = useState(OTP_SOURCE.NONE); // none, mobile, email, both
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
			if (otpSource === OTP_SOURCE.BOTH) {
				setMobile(phone);
				setEmail(mail);
			} else if (mail && otpSource === OTP_SOURCE.EMAIL) {
				setEmail(mail);
			} else if (phone && otpSource === OTP_SOURCE.SMS) {
				setMobile(phone);
				console.log("mobile, phone: ", mobile, phone);
			}
		} else {
			setOtpSource(OTP_SOURCE.NONE);
			setTitle("Contact Admin for updating your information");
		}
	}, [data, mobile, phone, mail, otpSource]);

	const sendOTPHandler = useCallback(
		async (e, source) => {
			if (e) {
				e.preventDefault();
			}
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
			if (res && res.data) {
				if (!res.data.alreadySent) {
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
		},
		[checkExisting, mobile, email, sendOTP, isErrorSend, checkExistingUser]
	);

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
						{(otpSource === OTP_SOURCE.SMS || otpSource === OTP_SOURCE.BOTH) &&
							selectedMethod === OTP_SOURCE.SMS && (
								<Form onSubmit={(e) => sendOTPHandler(e, OTP_SOURCE.SMS)}>
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

						{(otpSource === OTP_SOURCE.EMAIL ||
							otpSource === OTP_SOURCE.BOTH) &&
							selectedMethod === OTP_SOURCE.EMAIL && (
								<Form onSubmit={(e) => sendOTPHandler(e, OTP_SOURCE.EMAIL)}>
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
				{otpSource &&
					(otpSource === OTP_SOURCE.BOTH || otpSource === OTP_SOURCE.SMS) && (
						<div className="mt-1">
							<Button
								className="btn-primary"
								style={{ width: "200px" }}
								onClick={handleSelectSMS}
							>
								Send SMS
							</Button>
						</div>
					)}
				{otpSource &&
					(otpSource === OTP_SOURCE.BOTH || otpSource === OTP_SOURCE.EMAIL) && (
						<div className="my-3">
							<Button
								className="btn-primary"
								style={{ width: "200px" }}
								onClick={handleSelectMail}
							>
								Send Email
							</Button>
						</div>
					)}
			</>
		);
	};

	const handleSelectSMS = (e) => {
		e.preventDefault();
		setSelectedMethod(OTP_SOURCE.SMS);
		console.log("mobile: ", mobile);
		if (mobile && mobile.length > 0) {
			if (validateIndianPhoneNumber(mobile)) {
				sendOTPHandler(e, OTP_SOURCE.SMS);
			} else {
				toast.error("Invalid mobile number");
				setSelectedMethod(null);
			}
		}
	};

	const handleSelectMail = (e) => {
		e.preventDefault();
		setSelectedMethod(OTP_SOURCE.EMAIL);
		if (email && email.length > 0) {
			if (validateEmail(email)) {
				sendOTPHandler(e, OTP_SOURCE.EMAIL);
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
				{otpSource && otpSource !== OTP_SOURCE.NONE && (
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
