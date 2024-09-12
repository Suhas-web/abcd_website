import express from "express";
import fetch from "node-fetch";
const app = express();

app.use(json());

// Endpoint to generate diet plan
const generatePlan = errorHandler(async (req, res) => {
	const { isVegetarian, ingredients } = req.body;

	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: process.env.OPEN_KEY,
			},
			body: JSON.stringify({
				model: "text-davinci-003", // Example model name, adjust as needed
				messages: [
					{
						role: "user",
						content: `I want a diet plan${
							isVegetarian ? " for vegetarians" : ""
						} with ${ingredients
							.map((ing) => `${ing.name} (${ing.quantity})`)
							.join(", ")}.`,
					},
				],
			}),
		});

		const data = await response.json();
		// Handle response from ChatGPT API
		res.status(200).json({ dietPlan: data.choices[0].message.content });
	} catch (error) {
		console.error("Error generating diet plan:", error);
		res.status(500).json({ error: "Failed to generate diet plan" });
	}
});

export { generatePlan };
