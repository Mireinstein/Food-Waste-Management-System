import OpenAI from "openai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { availableFoodOptions, selectedFoodOptions } = req.body;

        // Initialize OpenAI client
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // Construct the prompt for OpenAI
        const prompt = `
            Given the available food options: ${availableFoodOptions.join(", ")}, 
            and the selected food options: ${selectedFoodOptions.join(", ")}, 
            generate a more well-balanced meal plan, suggesting what options from the selected ones to replace or what options to add. 
            If the selected options are already balanced enough (in terms of nutrients) then just let me know it's already good.
            I only need the final meal plan. Keep it under 100 words. 
        `;

        // Make a request to OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200
        });

        // Extract the response content
        const mealPlan = response.choices[0].message.content.trim();

        // Send the meal plan to the frontend
        res.status(200).json({ mealPlan });
    } catch (error) {
        console.error("Error generating meal plan:", error);
        res.status(500).json({ error: "Failed to generate meal plan" });
    }
}
