// /pages/api/getMealPlan.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { availableFoodOptions, selectedFoodOptions } = req.body;

            // Prepare the payload for the Python API
            const payload = {
                availableFoodOptions,
                selectedFoodOptions
            };

            // TODO: Replace with actual API URL
            const pythonApiUrl = 'http://your-python-api-url/api/get_meal_plan';

            // Send the POST request to the Python API
            const response = await fetch(pythonApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // Check if the response is OK
            if (!response.ok) {
                throw new Error('Failed to fetch meal plan from Python API');
            }

            // Parse the response from the Python API
            const data = await response.json();

            // Send the meal plan as a response to the frontend
            res.status(200).json({ mealPlan: data.mealPlan });
        } catch (error) {
            console.error("Error generating meal plan:", error);
            res.status(500).json({ error: "Failed to generate meal plan" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
