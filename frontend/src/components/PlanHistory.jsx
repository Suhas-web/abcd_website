import React, { useEffect, useState } from "react";
import FormContainer from "./FormContainer";
import {
	useGetClassicPlanListQuery,
	useGetPlanListQuery,
} from "../slices/plansApiSlice";
import Loader from "./Loader";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const PlanHistory = () => {
	const { data, isError, isLoading } = useGetPlanListQuery();
	const [list, setList] = useState([]);

	useEffect(() => {
		if (data && data.fileList) {
			console.log("Data: ", data);
			setList(data.fileList);
		}
	}, [data, list]);
	return (
		<FormContainer>
			<h2>Training plans: </h2>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<h3>Not found</h3>
			) : (
				<ListGroup>
					{list.map((plan) => (
						<Link to={`${plan.webViewLink}`}>
							<ListGroup.Item>{convertString(plan.name)}</ListGroup.Item>
						</Link>
					))}
				</ListGroup>
			)}
		</FormContainer>
	);
};

function convertString(a) {
	// Split the string at the underscore and select the second part
	const parts = a.split("_");
	if (parts.length > 1) {
		return parts[1];
	} else {
		// If no underscore is found, return the original string
		return a;
	}
}

export default PlanHistory;
