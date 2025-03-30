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
            and the selected food options: ${selectedFoodOptions.join(", ")}, give me the most balanced meal plan with respective portion sizes in the following format: "food : portion".
            Also suggest options from the rest of the food options that could replace some selected food options and return it in the format "replace X with Y" or "add Y" where X is a food in the initial  
            plan and Y is a food in the rest of the foods. Do not return anything other than the two parts of the meal format clearly distinguishible through new lines.
             
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
