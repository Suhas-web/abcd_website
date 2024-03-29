import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import {
	useGetUserProfilesDetailQuery,
	useUpdateUserProfileMutation,
} from "../../slices/usersApiSlice";

const MEMBERSHIP_TYPE = {
	NONE: "NONE",
	CLASSIC: "CLASSIC",
	PREMIUM: "PREMIUM",
};

const UserEditScreen = () => {
	const { id: userId } = useParams();
	const [name, setName] = useState("");
	const [mobile, setMobile] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [isAdmin, setIsAdmin] = useState("");
	const [membershipPlan, setMembershipPlan] = useState("");
	const [validTill, setValidTill] = useState("");
	const {
		data: user,
		error,
		isLoading,
	} = useGetUserProfilesDetailQuery(userId);
	const [updateUser, { isLoading: loadingUpdateUser }] =
		useUpdateUserProfileMutation();
	const navigate = useNavigate();

	const submitHandler = async (e) => {
		e.preventDefault();
		const updatedUser = {
			_id: userId,
			name,
			mobile,
			email,
			password,
			isAdmin,
			membershipPlan,
			validTill,
		};
		try {
			const result = await updateUser(updatedUser).unwrap();
			if (result) {
				toast.success("Updated profile succcessfully");
				navigate("/admin/userList");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error updating profile");
		}
	};

	useEffect(() => {
		if (user) {
			setName(user.name);
			setMobile(user.mobile);
			setEmail(user.email);
			setIsAdmin(user.isAdmin);
			setMembershipPlan(user.membershipPlan);
		}
	}, [user]);

	return (
		<>
			<FormContainer>
				<Link to="/admin/userList">
					<Button className="btn-sm">Go back</Button>
				</Link>
				<h1 className="mt-3">Edit user</h1>
				{loadingUpdateUser && <Loader />}
				{isLoading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">{error?.data?.message}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId="name" className="my-2">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							></Form.Control>
						</Form.Group>
						<Form.Group controlId="mobile" className="my-2">
							<Form.Label>Mobile Number</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter mobile number"
								value={mobile}
								onChange={(e) => setMobile(e.target.value)}
								required
							></Form.Control>
						</Form.Group>
						<Form.Group controlId="emai" className="my-2">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="text"
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
								placeholder="Reset password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								maxLength="15"
								isInvalid={password.length > 15 || password.length < 6}
							></Form.Control>
						</Form.Group>
						<Form.Group
							controlId="activePlan"
							className="my-2"
							onChange={(e) => setMembershipPlan(e.target.value)}
						>
							<Form.Label>Membership Plan</Form.Label>
							<Form.Select aria-label="Default select">
								<option>{membershipPlan}</option>
								<option value={MEMBERSHIP_TYPE.CLASSIC}>CLASSIC</option>
								<option value={MEMBERSHIP_TYPE.PREMIUM}>PREMIUM</option>
								<option value={MEMBERSHIP_TYPE.NONE}>NONE</option>
							</Form.Select>
						</Form.Group>
						<Form.Group controlId="validTill" className="my-2">
							<Form.Label>Valid Till:</Form.Label>
							<Form.Control
								type="date"
								value={validTill}
								onChange={(e) => setValidTill(e.target.value)}
							/>
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
						<Button
							type="submit"
							variant="primary"
							className="mt-3"
							disabled={isLoading}
						>
							Update
						</Button>
						{isLoading && <Loader />}
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default UserEditScreen;
