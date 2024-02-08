import { useState } from "react";
import { Col, Button, Form } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import {
	useCreateNewUserMutation,
	useCheckExistingUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateNewUser = () => {
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");
	const [email, setEmail] = useState("");
	const [isAdmin, setIsAdmin] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const [checkExistingUser] = useCheckExistingUserMutation();
	const [createUser, { isLoading }] = useCreateNewUserMutation();
	const { userInfo } = useSelector((state) => state.auth);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const res = await createUser({
				name,
				mobile,
				email,
				password,
				isAdmin,
			}).unwrap();
			toast.success("Created user: ", name);
			navigate("/admin/userList");
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
		if (validEmail && validPhone && validPassword) {
			const existingUser = await checkExistingUser({ mobile, email });
			if (existingUser && existingUser.data.isExistingUser) {
				toast.error("This contact is already registered.");
			} else {
				submitHandler(e);
			}
		} else if (!validEmail) {
			toast.error("Enter valid email");
		} else if (!validPassword) {
			toast.error("Enter valid password between 6 and 15 characters");
		} else if (!validPhone) {
			toast.error("Enter valid mobile number");
		} else {
			toast.error("Enter valid detail");
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
				{userInfo && userInfo.isAdmin ? (
					<Col md={8} xs={12}>
						<h1>Create User</h1>
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
							<Form.Group controlId="isAdmin" className="my-2">
								<Form.Check
									type="checkbox"
									label="isAdmin"
									checked={Boolean(isAdmin)}
									value={isAdmin}
									onChange={(e) => setIsAdmin(e.target.checked)}
								></Form.Check>
							</Form.Group>
							<Button type="submit" variant="primary" className="mt-2">
								Create user
							</Button>
							{isLoading && <Loader />}
						</Form>
					</Col>
				) : (
					<h2>No access</h2>
				)}
			</FormContainer>
		</>
	);
};

export default CreateNewUser;
