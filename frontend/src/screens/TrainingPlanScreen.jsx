import React from "react";
import { pdfjs } from "react-pdf";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import PremiumPlan from "../components/PremiumPlan";
import ClassicPlan from "../components/ClassicPlan";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const TrainingPlanScreen = () => {
	const { userInfo } = useSelector((state) => state.auth);

	return userInfo.membershipPlan === "CLASSIC" ? (
		<ClassicPlan />
	) : userInfo.membershipPlan === "PREMIUM" ? (
		<PremiumPlan />
	) : (
		<Container className="mt-3">
			<h2>Gym membership not found</h2>
			<h3>Contact the admin to register your membership plan</h3>
		</Container>
	);
};

export default TrainingPlanScreen;
