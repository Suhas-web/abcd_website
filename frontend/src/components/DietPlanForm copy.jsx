import React, { useState } from "react";

const DietPlanForm = () => {
	const [isVegetarian, setIsVegetarian] = useState(false);
	const [ingredients, setIngredients] = useState("");
	const [dietPlan, setDietPlan] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch("/.netlify/functions/generateDietPlan", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ isVegetarian, ingredients }),
		});
		const data = await response.json();
		setDietPlan(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						<input
							type="checkbox"
							checked={isVegetarian}
							onChange={() => setIsVegetarian(!isVegetarian)}
						/>
						Vegetarian Diet?
					</label>
				</div>
				<div>
					<label>
						<h4>Available Ingredients: </h4>
						<textarea
							value={ingredients}
							onChange={(e) => setIngredients(e.target.value)}
						/>
					</label>
				</div>
				<button type="submit">Get Diet Plan</button>
			</form>
			{dietPlan && (
				<div>
					<h2>Diet Plan</h2>
					<pre>{JSON.stringify(dietPlan, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default DietPlanForm;
