AI Travel Planner

About the Project
AI Travel Planner is a web application that uses AI to generate personalized travel itineraries based on the user's destination, trip duration, travel purpose, companions, budget, interests, and preferences.

Features
- Generate personalized, day-by-day travel itineraries.
- Choose travel companions, trip purpose, and budget.
- Select interests and add custom preferences.
- View AI-generated travel suggestions.
- Copy the generated itinerary.
- Responsive design for desktop and mobile devices.
- Loading indicators and error handling.

Technologies Used
- Next.js
- React
- JavaScript
- Tailwind CSS
- Google Gemini API
- React Markdown

Getting Started

Prerequisites
- Node.js and npm
- A Google Gemini API key

Installation
1. Clone or download this repository.
2. Open the project folder in your terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and add:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser.

Environment Variables
The application requires `GEMINI_API_KEY` to communicate with the Gemini API. Keep your API key private and never commit it to GitHub.

Project Purpose
This project was developed as an AI-powered travel planning application to demonstrate frontend development, API integration, responsive UI design, and AI-assisted application functionality.