import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import FormContainer from "../components/FormContainer";
import { useNavigate } from "react-router-dom";
import OTPScreen from "./OTPScreen";
import {
	validateEmail,
	validateIndianPhoneNumber,
	validatePassword,
} from "../utils/helper";
import MembershipScreen from "./MembershipScreen";

const UserProfileScreen = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const navigate = useNavigate();

	const [updateProfile] = useUpdateProfileMutation();
	const dispatch = useDispatch();

	const submitHandler = async (e) => {
		if (e) {
			e.preventDefault();
		}
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

	function handleOtpStatus({ status }) {
		console.log("status", status);
		if (status) {
			return submitHandler();
		}
	}

	const handleSubmit = () => {
		let isValidRequest =
			name.length < 15 &&
			name.length > 0 &&
			validateEmail(email) &&
			validateIndianPhoneNumber(mobile);
		if (password) {
			isValidRequest = validatePassword(password);
		}
		if (isValidRequest) {
			setIsSubmitted(true);
		} else {
			toast.error("Invalid details");
		}
	};

	useEffect(() => {
		if (userInfo) {
			setName(userInfo.name);
			setMobile(userInfo.mobile);
			setEmail(userInfo.email);
		}
	}, [userInfo.name, userInfo.mobile, userInfo, setName, setMobile]);

	return (
		<div className="mt-3">
			<FormContainer>
				<Row>
					{!isSubmitted ? (
						<>
							<Col md={6}>
								<Form>
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
											disabled
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
										onClick={() => handleSubmit()}
										className="my-2"
										variant="primary"
										disabled={isSubmitted}
									>
										Update profile
									</Button>
								</Form>
							</Col>
							<Col>
								<MembershipScreen />
							</Col>
						</>
					) : (
						<Col className="mt-3" md={4}>
							<OTPScreen
								phone={mobile}
								mail={email}
								checkExisting={true}
								onCheckOtp={handleOtpStatus}
							/>
						</Col>
					)}
				</Row>
			</FormContainer>
		</div>
	);
};

export default UserProfileScreen;
