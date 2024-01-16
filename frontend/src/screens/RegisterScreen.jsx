import { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
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
	useRegisterMutation,
	useCheckExistingMobileMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import {
	useSendOTPSMSMutation,
	useVerifyOTPMutation,
} from "../slices/otpSlice";

const RegisterScreen = () => {
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitted, SetIsSubmitted] = useState(false);
	const [OTP, setOTP] = useState("");
	const [isOtpSent, setIsOtpSent] = useState(false);
	const [isOtpVerified, setIsOtpVerified] = useState(false);

	const [sendOTP, { isError }] = useSendOTPSMSMutation();
	const [verifyOTP] = useVerifyOTPMutation();

	const [checkExistingUser] = useCheckExistingMobileMutation();

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
		e.preventDefault();
		try {
			const res = await register({ name, mobile, email, password }).unwrap();
			dispatch(setCredentials({ ...res }));
		} catch (err) {
			console.log(err?.data);
			toast.error(err?.data?.message || err.error);
		}
	};

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

	const performValidation = async (e) => {
		e.preventDefault();
		const validEmail = validateEmail(email);
		const validPhone = validateIndianPhoneNumber(mobile);
		const validPassword = validatePassword(password);
		console.log("Validation: ", validEmail, validPassword, validPhone);
		if (validEmail && validPhone && validPassword) {
			const existingUser = await checkExistingUser(mobile);
			console.log(existingUser);
			if (existingUser && existingUser.data.isExistingMobile) {
				toast.error(
					"This mobile number is already registered, login with your mobile number"
				);
				navigate("/login");
			} else {
				SetIsSubmitted(true);
				toast.success("Verify OTP on your mobile to register");
			}
		} else if (!validEmail) {
			toast.error("Enter valid email");
		} else if (!validPassword) {
			toast.error("Enter valid password between 6 and 15 characters");
		} else if (!validPhone) {
			toast.error("Enter valid mobile number");
		} else {
			toast.error("Enter valid detail");
			SetIsSubmitted(false);
		}
	};

	function validateEmail(email) {
		var re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	function validateIndianPhoneNumber(phoneNumber) {
		var re = /^[6-9]\d{9}$/;
		return re.test(phoneNumber);
	}

	function validatePassword(password) {
		return password && password.length > 6 && password.length < 15;
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
								{/* <Form.Control.Feedback type="invalid">
									Name must be less than 30 characters.
								</Form.Control.Feedback> */}
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
								{/* <Form.Control.Feedback type="invalid">
									Please enter a valid mobile number.
								</Form.Control.Feedback> */}
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
								{/* <Form.Control.Feedback type="invalid">
									Password must be less than 15 characters.
								</Form.Control.Feedback> */}
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
					<>
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
					</>
				)}
			</FormContainer>
		</>
	);
};

export default RegisterScreen;
