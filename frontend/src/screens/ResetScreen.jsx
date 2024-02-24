import { useState } from "react";
import { Col, Button, Form } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { useUpdatePasswordMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import OTPScreen from "./OTPScreen";
import { validatePassword } from "../utils/helper";

const ResetScreen = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [userId, setUserId] = useState(null);

	const navigate = useNavigate();
	const [updatePassword, { error, isError }] = useUpdatePasswordMutation();

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
		} else if (!validatePassword(password)) {
			toast.error("Password must be atleast 6 characters ");
		} else {
			const res = await updatePassword({ userId, password });
			if (res && !isError) {
				toast.success("Updated password");
				navigate("/login");
			} else {
				toast.error("Unable to update password. Contact Admin");
				console.log(error);
			}
		}
	};

	const handleOtpStatus = ({ status, userId }) => {
		if (status) {
			setIsOtpVerified(true);
			setUserId(userId);
		} else {
			console.log("YYY");
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
		<OTPScreen checkExisting={true} onCheckOtp={handleOtpStatus} />
	);
};

export default ResetScreen;
