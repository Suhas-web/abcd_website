import React, { useEffect, useState } from "react";
import FormContainer from "./FormContainer";
import { useGetClassicPlanListQuery } from "../slices/plansApiSlice";
import Loader from "./Loader";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const ClassicPlan = () => {
	const { data, isError, isLoading } = useGetClassicPlanListQuery();
	const [list, setList] = useState([]);

	useEffect(() => {
		if (data && data.files) {
			console.log("Data: ", data);
			setList(data.files);
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
							<ListGroup.Item>{plan.name}</ListGroup.Item>
						</Link>
					))}
				</ListGroup>
			)}
		</FormContainer>
	);
};

export default ClassicPlan;
