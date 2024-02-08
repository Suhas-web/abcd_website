import { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
	useRegisterMutation,
	useCheckExistingUserMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import {
	validateEmail,
	validateIndianPhoneNumber,
	validatePassword,
} from "../utils/helper";
import OTPScreen from "./OTPScreen";

const RegisterScreen = () => {
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [checkExistingUser] = useCheckExistingUserMutation();

	const { userInfo } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { search } = useLocation();
	const sp = new URLSearchParams(search);
	const redirect = sp.get("redirect") || "/";

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [userInfo, redirect, navigate]);

	const [register, { isLoading }] = useRegisterMutation();
	const submitHandler = async (e) => {
		if (e) {
			e.preventDefault();
		}
		try {
			const res = await register({ name, mobile, email, password }).unwrap();
			dispatch(setCredentials({ ...res }));
		} catch (err) {
			console.log(err?.data);
			toast.error(err?.data?.message || err.error);
		}
	};

	const performValidation = async (e) => {
		e.preventDefault();
		const validEmail = validateEmail(email);
		const validPhone = validateIndianPhoneNumber(mobile);
		const validPassword = validatePassword(password);
		console.log("Validation: ", validEmail, validPassword, validPhone);
		if (validEmail && validPhone && validPassword) {
			const existingUser = await checkExistingUser({ mobile, email });
			console.log(existingUser);
			if (existingUser && existingUser.data.isExistingUser) {
				toast.error(
					"This mobile number is already registered, login with your mobile number"
				);
				navigate("/login");
			} else {
				setIsSubmitted(true);
				toast.success("Verify OTP to register");
			}
		} else if (!validEmail) {
			toast.error("Enter valid email");
		} else if (!validPassword) {
			toast.error("Enter valid password between 6 and 15 characters");
		} else if (!validPhone) {
			toast.error("Enter valid mobile number");
		} else {
			toast.error("Enter valid detail");
			setIsSubmitted(false);
		}
	};

	function handleOtpStatus({ status }) {
		if (status === true) {
			submitHandler();
		} else {
			toast.error("Could not verify OTP. Try again");
			setIsSubmitted(false);
		}
	}

	return (
		<>
			<FormContainer>
				{!isSubmitted ? (
					<Col md={8} xs={12}>
						<h1>Register</h1>
						<Form onSubmit={performValidation}>
							<Form.Group controlId="name" className="my-3">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									maxLength="30"
								></Form.Control>
							</Form.Group>

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
							<Button type="submit" variant="primary" className="mt-2">
								Sign Up
							</Button>
							{isLoading && <Loader />}
						</Form>
						<Row className="py-3 text-center">
							<Col>
								Existing user? <Link to="/login">Login</Link>
							</Col>
						</Row>
					</Col>
				) : (
					<OTPScreen
						phone={mobile}
						mail={email}
						checkExisting={false}
						onCheckOtp={handleOtpStatus}
					/>
				)}
			</FormContainer>
		</>
	);
};

export default RegisterScreen;
