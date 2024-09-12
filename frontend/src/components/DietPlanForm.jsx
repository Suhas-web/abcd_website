import React, { useState } from "react";
import "../assets/styles/dietplanform.css";
import { Button } from "react-bootstrap";
import { FaTrash, FaLightbulb } from "react-icons/fa";
import Loader from "./Loader";

const DietPlanForm = () => {
	const [isVegetarian, setIsVegetarian] = useState(false);
	const [ingredient, setIngredient] = useState("");
	const [ingredients, setIngredients] = useState([]);
	const [dietPlan, setDietPlan] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleAddIngredient = () => {
		if (ingredient && !ingredients.includes(ingredient)) {
			setIngredients([...ingredients, ingredient]);
			setIngredient(""); // Clear the input field
		}
	};

	const handleRemoveIngredient = (ingredientToRemove) => {
		setIngredients(
			ingredients.filter((ingredient) => ingredient !== ingredientToRemove)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		const response = await fetch("/.netlify/functions/generateDietPlan", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ isVegetarian, ingredients }),
		});
		const data = await response.json();
		if (response.status === 200) {
			const data = await response.json();
			setDietPlan(data);
		} else {
		}
		setIsLoading(false);
	};

	return (
		<div className="diet-plan-form">
			<h3>Custom AI generated diet plan</h3>
			<br></br>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>
						<input
							type="checkbox"
							checked={isVegetarian}
							onChange={() => setIsVegetarian(!isVegetarian)}
							className="mx-1"
						/>
						Vegetarian Diet?
					</label>
				</div>
				<div className="form-group">
					<label>
						<h5>Enter available Ingredients </h5>
						<input
							type="text"
							value={ingredient}
							onChange={(e) => setIngredient(e.target.value)}
							placeholder="Example 5 eggs"
							maxLength="30"
						/>
						<button type="button" onClick={handleAddIngredient}>
							Add
						</button>
					</label>
					<ul>
						{ingredients.map((ing, index) => (
							<li key={index}>
								{ing}{" "}
								<Button
									className="btn-sm mx-2"
									variant="danger"
									onClick={() => handleRemoveIngredient(ing)}
								>
									<FaTrash />
								</Button>
							</li>
						))}
					</ul>
				</div>
				<button type="submit" className="submit-button">
					Get Diet Plan
				</button>
			</form>
			{isLoading && (
				<div className="loading-indicator">
					<Loader />
					<FaLightbulb className="loading-icon" />
					<p>Generating diet plan...</p>
				</div>
			)}
			{!isLoading && dietPlan && (
				<div className="diet-plan-result-row">
					<div className="diet-plan-result">
						<pre>{JSON.stringify(dietPlan, null, 2)}</pre>
					</div>
				</div>
			)}
		</div>
	);
};

export default DietPlanForm;
