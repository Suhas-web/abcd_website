import { useState, useEffect } from "react";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import otp_image from "../assets/otp_image.jpeg";

import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
	useCheckExistingMobileMutation,
	useUpdatePasswordMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import {
	useSendOTPSMSMutation,
	useVerifyOTPMutation,
} from "../slices/otpSlice";

const ResetScreen = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitted, SetIsSubmitted] = useState(false);
	const [OTP, setOTP] = useState("");
	const [isOtpSent, setIsOtpSent] = useState(false);
	const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [mobile, setMobile] = useState("");

	const navigate = useNavigate();

	const [checkExistingUser] = useCheckExistingMobileMutation();
	const [sendOTP, { isError }] = useSendOTPSMSMutation();
	const [verifyOTP] = useVerifyOTPMutation();
	const [updatePassword] = useUpdatePasswordMutation();

	const sendOTPHandler = async (e) => {
		e.preventDefault();
		const existingUser = checkExistingMobileHandler(e);
		if (existingUser) {
			const res = await sendOTP({ mobileNumber: mobile });
			console.log("Send OTP response: ", res);
			if (res && res.data) {
				if (!res.data.alreadySent) {
					console.log(res.data.alreadySent);
					toast.success("OTP sent successfully");
				} else if (res.data.alreadySent) {
					toast.success("OTP sent already! Try again after 15 minutes");
				}
				setIsOtpSent(true);
			} else {
				toast.error("Unable to send OTP. Try again");
			}
		}
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
		} else {
			const res = await updatePassword({ mobile, password });
			if (res) {
				toast.success("Updated password");
				navigate("/login");
			}
		}
	};

	const checkExistingMobileHandler = async (e) => {
		const existingUser = await checkExistingUser(mobile);
		e.preventDefault();
		if (existingUser && existingUser.data.isExistingMobile) {
			return true;
		} else {
			toast.error("This mobile is not registered");
			navigate("/register");
			return false;
		}
	};

	const verifyOTPHandler = async (e) => {
		e.preventDefault();
		const res = await verifyOTP({ mobileNumber: mobile, enteredOTP: OTP });
		console.log("Verify OTP response: ", res);
		if (res && res.data) {
			if (res.data.isOtpSent && res.data.isVerified) {
				setIsOtpVerified(true);
				toast.success("Verified OTP");
			} else if (!res.data.isOtpSent) {
				toast.error("OTP expired! Send OTP again");
			} else if (!res.data.isVerified) {
				toast.error("Incorrect OTP");
			}
		} else {
			toast.error("Server error. Try again");
		}
	};

	return isOtpVerified ? (
		<FormContainer>
			<Col md={8}>
				<Form onSubmit={submitHandler}>
					<Form.Group controlId="password" className="mt-2">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							maxLength="15"
							isInvalid={password.length > 15 || password.length < 6}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId="confirmPassword" className="mt-2">
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Re-enter password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							maxLength="15"
							isInvalid={
								confirmPassword.length > 15 || confirmPassword.length < 6
							}
						></Form.Control>
					</Form.Group>
					<Button type="submit" variant="primary" className="mt-2">
						Update password
					</Button>
				</Form>
			</Col>
		</FormContainer>
	) : (
		<FormContainer className="my-3">
			<h3 className="mt-3">Enter Your Mobile Number to recieve 4-digit OTP</h3>
			{/* <Image src={otp_image} fluid></Image> */}

			<Form onSubmit={verifyOTPHandler}>
				<Row>
					<Col md={6}>
						<Form.Group name="mobile" className="mt-2">
							<Form.Control
								placeholder="Enter mobile Number"
								type="text"
								required
								pattern="^[6-9]\d{9}$"
								onChange={(e) => setMobile(e.target.value)}
							></Form.Control>
						</Form.Group>
					</Col>
					<Col md={4}>
						<Button className="mt-2" onClick={sendOTPHandler} variant="primary">
							Send OTP
						</Button>
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<Form.Group name="verifyOTP" className="my-2">
							{/* <Form.Label>Enter OTP</Form.Label> */}
							<Form.Control
								placeholder="Enter OTP"
								type="text"
								onChange={(e) => setOTP(e.target.value)}
							></Form.Control>
						</Form.Group>
					</Col>
					<Col md={4}>
						<Button
							type="submit"
							className="my-2"
							variant="primary"
							disabled={!isOtpSent}
						>
							Verify OTP
						</Button>
					</Col>
				</Row>
			</Form>
		</FormContainer>
	);
};

export default ResetScreen;
