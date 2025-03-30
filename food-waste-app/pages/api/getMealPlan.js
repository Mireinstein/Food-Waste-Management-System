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
            and the selected food options: ${selectedFoodOptions.join(", ")}, let me know if this is a balanced meal plan. If it is not, give me some suggestions as to what to remove, add, or replace.
            Limit to 111 words please.
            Separate the food options and/or suggestions with a |. Don't use new lines.
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
