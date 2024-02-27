import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { BsClockHistory, BsShieldLockFill } from "react-icons/bs";
import { CgGym } from "react-icons/cg";

const MembershipScreen = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const [membershipPlan, setMembershipPlan] = useState("");
	const [validTill, setValidTill] = useState("");

	useEffect(() => {
		if (userInfo) {
			setMembershipPlan(userInfo.membershipPlan);
			setValidTill(userInfo.validTill);
		}
	}, [userInfo]);

	return (
		<>
			{membershipPlan && (
				<Container className="mt-4 p-4 border rounded shadow">
					<h5 className="mb-4">Membership Details</h5>
					<Row className="mb-3">
						<Col>
							<CgGym className="mr-2" />
							<span className="font-weight-bold"> Active Plan:</span>{" "}
							{membershipPlan}
						</Col>
					</Row>
					<Row>
						<Col>
							<BsClockHistory className="mr-2" />
							<span className="font-weight-bold"> Plan Expiry:</span>{" "}
							{validTill
								? new Date(validTill).toLocaleDateString("en-IN")
								: "Not found"}
						</Col>
					</Row>
				</Container>
			)}
		</>
	);
};

export default MembershipScreen;
