// /pages/api/getMealPlan.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { availableFoodOptions, selectedFoodOptions } = req.body;

            // Log the input for debugging
            console.log("Available Food Options:", availableFoodOptions);
            console.log("Selected Food Options:", selectedFoodOptions);

            // TODO:For now, return the placeholder message
            res.status(200).json({
                mealPlan: "Generating meal plan"
            });
        } catch (error) {
            console.error("Error generating meal plan:", error);
            res.status(500).json({ error: "Failed to generate meal plan" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
