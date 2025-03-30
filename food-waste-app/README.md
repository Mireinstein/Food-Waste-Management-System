# FoodBack: Reducing Food Waste Through Conscious Eating

## 📌 Project Overview

FoodBack is a sustainability-focused web application designed to minimize food waste in college dining halls. Our platform empowers students to make informed meal choices by providing real-time menu insights, nutritional analysis, and food tracking. By fostering awareness and accountability, we aim to reduce unnecessary food waste and promote sustainable eating habits on campuses.

This project was developed for a sustainability hackathon, addressing the critical issue of food waste, which contributes significantly to environmental degradation and resource mismanagement.

## 🔍 Why FoodBack?

Research has shown that **conscious eaters in colleges waste less food**. However, many students lack the necessary tools to track and optimize their food consumption. FoodBack bridges this gap by:

- Encouraging mindful eating decisions.
- Providing a seamless way to track daily meal choices.
- Offering AI-powered meal suggestions based on previous selections and dining hall menus.
- Promoting sustainability through awareness and data-driven insights.

## 🚀 Features

- **📅 Daily Menu Insights:** Displays real-time dining hall menu items with nutritional information.
- **📸 Plate Tracking:** Allows users to upload images of their meals to analyze consumption habits.
- **🔍 Smart Meal Suggestions:** Uses AI to recommend meal portions based on past selections and sustainability goals.
- **📊 Food Waste Insights:** Provides personalized insights on individual and collective food waste trends.
- **🌍 Sustainability Focus:** Encourages users to be mindful of their food consumption and environmental impact.

## 🏗️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Next.js
- **AI & Recommendations:** OpenAI API / Custom ML Model (for meal planning and sustainability suggestions)

## 🔬 Research-Backed Approach

Our development process was guided by research on food waste behavior in college settings. Studies indicate that when students are **aware** of their food consumption patterns, they are **less likely to waste food**. By integrating visual feedback, real-time data, and smart recommendations, FoodBack fosters a culture of responsible eating on campus.

## 📖 How It Works

1. **View Dining Hall Menu** – Get real-time updates on available meals.
2. **Track Your Plate** – Upload a picture of your meal before eating.
3. **Receive Insights** – Get recommendations on portion sizes and sustainability impact.
4. **Optimize Your Choices** – Adjust meals based on AI-driven suggestions.

## 💡 Impact & Future Vision

Food waste is a global issue, but small, informed decisions can lead to significant change. With FoodBack, we envision a future where:

- College students actively **reduce their food waste** through conscious decision-making.
- Dining halls **optimize portion sizes** based on user feedback.
- Sustainability becomes an integral part of daily eating habits.

## 📥 Installation & Setup

1. Clone this repository:
   ```sh
   git clone https://github.com/AimeCesaireM/FoodBack.git
   cd FoodBack
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a file names `.env` in the `foood-waste-app` directory of the project.Add the following environment variables to the .env file
```
NEXT_PUBLIC_DINNER_MENU_API_URL="https://amherst.api.nutrislice.com/menu/api/weeks/school/valentine-hall/menu-type/dinner/2025/03/29/"

NEXT_PUBLIC_LUNCH_MENU_API_URL="https://amherst.api.nutrislice.com/menu/api/weeks/school/valentine-hall/menu-type/lunch/2025/03/29/"

NEXT_PUBLIC_BREAKFAST_MENU_API_URL="https://amherst.api.nutrislice.com/menu/api/weeks/school/valentine-hall/menu-type/breakfast/2025/03/29/"

NEXT_PUBLIC_MENU_API_URL="https://amherst.api.nutrislice.com/menu/api/weeks/school/valentine-hall/menu-type/dinner/2025/03/29/"

```
Note:Ask developers for api key and add it in .env file as OPENAI_API_KEY=provided_key

4. Start the development server:
   ```sh
   npm run dev
   ```
5. Open the app in your browser at `http://localhost:3000` or whatever port your server is running on.


## 🤝 Contributing

We welcome contributions to enhance FoodBack's functionality and impact. To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## 📜 License

This project is licensed under the MIT License.

## 🙌 Acknowledgments

- Hackathon organizers for providing the platform to develop this idea.
- Researchers and sustainability experts whose work guided our project.
- Open-source contributors and tools that made this possible.

## 📞 Contact

For any inquiries, feel free to reach out to:

- **Developers:** Aime Cesaire Mugishawayo, Admire Madyira, Miro Babin, Marius Cotorobai

---

FoodBack – Making Conscious Eating a Habit for a Sustainable Future 🌱

