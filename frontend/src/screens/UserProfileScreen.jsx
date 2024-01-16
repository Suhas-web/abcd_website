import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../slices/usersApiSlice";
import {
	useSendOTPSMSMutation,
	useVerifyOTPMutation,
} from "../slices/otpSlice";
import { setCredentials } from "../slices/authSlice";
import FormContainer from "../components/FormContainer";
import MembershipScreen from "./MembershipScreen";
import { useNavigate } from "react-router-dom";

const UserProfileScreen = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [OTP, setOTP] = useState("");
	const [isOtpSent, setIsOtpSent] = useState(false);
	const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [needsProfileUpdate, setNeedsProfileUpdate] = useState(false);
	const navigate = useNavigate();

	const [updateProfile] = useUpdateProfileMutation();
	const [sendOTP, { isLoading, isError }] = useSendOTPSMSMutation();
	const [
		verifyOTP,
		{ isLoading: isVerifyOTPLoading, isError: isVerifyOTPError },
	] = useVerifyOTPMutation();
	const dispatch = useDispatch();

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
		} else {
			try {
				const res = await updateProfile({
					_id: userInfo._id,
					name,
					mobile,
					email,
					password,
				}).unwrap();
				dispatch(setCredentials(res));
				toast.success("Profile updated successfully.");
				navigate("/");
			} catch (err) {
				console.log(err);
				toast.error(err?.data?.message || err?.error);
			}
		}
	};

	useEffect(() => {
		if (userInfo) {
			setName(userInfo.name);
			setMobile(userInfo.mobile);
			setEmail(userInfo.email);
		}
	}, [userInfo.name, userInfo.mobile, userInfo, setName, setMobile]);

	const sendOTPHandler = async (e) => {
		e.preventDefault();
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
	};

	const verifyOTPHandler = async (e) => {
		e.preventDefault();
		const res = await verifyOTP({ mobileNumber: mobile, enteredOTP: OTP });
		console.log("Verify OTP response: ", res);
		if (res && res.data) {
			if (res.data.isOtpSent && res.data.isVerified) {
				setIsOtpVerified(true);
				toast.success("Verified OTP!");
				submitHandler(e);
			} else if (!res.data.isOtpSent) {
				toast.error("OTP expired! Send OTP again");
			} else if (!res.data.isVerified) {
				toast.error("Incorrect OTP");
			}
		} else {
			toast.error("Server error. Try again");
		}
	};

	return (
		<div className="mt-3">
			<FormContainer>
				<Row>
					{!needsProfileUpdate ? (
						<Col md={6}>
							<Form onSubmit={submitHandler}>
								<Form.Group name="name" className="my-2">
									<Form.Label>Name</Form.Label>
									<Form.Control
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group name="mobile" className="my-2">
									<Form.Label>Mobile Number</Form.Label>
									<Form.Control
										type="text"
										value={mobile}
										onChange={(e) => setMobile(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group name="email" className="my-2">
									<Form.Label>Email</Form.Label>
									<Form.Control
										type="text"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group name="password" className="my-2">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="text"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group name="confirmPassword" className="my-2">
									<Form.Label>ConfirmPassword</Form.Label>
									<Form.Control
										type="text"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Button
									type="submit"
									onClick={() => setNeedsProfileUpdate(true)}
									className="my-2"
									variant="primary"
									disabled={needsProfileUpdate}
								>
									Update profile
								</Button>
							</Form>
						</Col>
					) : (
						<Col className="mt-3" md={4}>
							{userInfo && !userInfo.isAdmin && userInfo.membershipPlan && (
								<MembershipScreen />
							)}
							<Container>
								{!isOtpVerified && (
									<Form onSubmit={verifyOTPHandler}>
										<h3>Verify OTP to update profile</h3>
										<Button
											onClick={sendOTPHandler}
											className="my-2"
											variant="primary"
										>
											Send OTP
										</Button>
										<Form.Group name="verifyOTP" className="my-2">
											<Form.Label>Enter OTP</Form.Label>
											<Form.Control
												type="text"
												onChange={(e) => setOTP(e.target.value)}
											></Form.Control>
										</Form.Group>
										<Button
											type="submit"
											className="my-2"
											variant="primary"
											disabled={!isOtpSent}
										>
											Verify OTP
										</Button>
									</Form>
								)}
							</Container>
						</Col>
					)}
				</Row>
			</FormContainer>
		</div>
	);
};

export default UserProfileScreen;
