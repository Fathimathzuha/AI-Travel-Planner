
export async function POST(request) {
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    const {
      destination,
      days,
      travelWith,
      purpose,
      budget,
      interests,
      preferences,
    } = await request.json();

    // Validate required fields.
    if (
      typeof destination !== "string" ||
      !destination.trim() ||
      !Number.isInteger(Number(days)) ||
      Number(days) < 1 ||
      Number(days) > 30
    ) {
      return Response.json(
        { error: "Please provide a destination and a trip duration between 1 and 30 days." },
        { status: 400 }
      );
    }

    // Safely handle optional inputs.
    const selectedInterests = Array.isArray(interests)
      ? interests.filter((item) => typeof item === "string")
      : [];

    const userPreferences =
      typeof preferences === "string" && preferences.trim()
        ? preferences.trim()
        : "None specified";

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
    });

    const prompt = `
You are a thoughtful travel planner who creates personalized,
practical and easy-to-follow travel itineraries.

TRIP DETAILS
Destination: ${destination.trim()}
Duration: ${Number(days)} days
Travelling with: ${travelWith || "Not specified"}
Purpose: ${purpose || "Not specified"}
Budget: ${budget || "Not specified"}
Selected interests: ${
      selectedInterests.join(", ") || "Not specified"
    }
Additional user preferences: ${userPreferences}

PERSONALIZATION RULES

1. Respect the user's selected interests.
- Treat selected interests as the primary guide for activities,
  attractions and recommendations.
- Do not treat unselected interests as user preferences.
- Related attractions may be included when they naturally fit
  a selected interest, but do not let them dominate the itinerary.
- If Food is selected, prioritize local cuisine, regional dishes,
  restaurants and meaningful food experiences.
- If History & Culture is selected, prioritize historical landmarks,
  museums, heritage sites and cultural experiences.
- Avoid repeatedly recommending the same type of activity.

2. Follow additional user preferences carefully.
- Read the entire Additional user preferences field.
- Treat dietary requirements, accessibility needs, accommodation
  requests and other stated needs as important constraints.
- Incorporate these requests throughout the itinerary where relevant.
- If two requirements conflict, explain the conflict and offer
  a reasonable alternative.
- Never assume a preference that the user has not stated.

3. Dietary requirements and halal food.
- If the user requests halal restaurants or halal food, prioritize
  suitable dining options throughout the trip.
- If the user asks for a hotel that provides halal food, distinguish
  between halal dining available inside the hotel and halal
  restaurants located nearby.
- Do not assume that a restaurant or hotel serves halal food
  merely because of its location, cuisine or name.
- Do not claim halal certification, ingredients or preparation
  practices have been verified unless reliable information confirms it.
- If verification is unavailable, explain that the user should
  contact the establishment directly before relying on the recommendation.
- Respect vegetarian, vegan, allergy-related and other dietary
  requirements when stated. Do not guarantee allergy safety
  without confirmation from the establishment.

4. Spiritual places and religious preferences.
- If Spiritual Places is selected, recommend relevant spiritual,
  religious or heritage sites.
- Do not infer the user's religion from this interest or from
  their dietary choices.
- If the user specifies a preferred tradition or type of site,
  prioritize it. Otherwise, offer varied relevant options or
  explain that the preference can be narrowed down.
- Do not assume the user wants to participate in religious rituals.

5. Practical daily planning.
- Create a separate, clearly organized plan for each day.
- Include morning, afternoon and evening activities where suitable.
- Group nearby attractions together to reduce unnecessary travel.
- Account for meals, breaks, realistic travel times and rest.
- Avoid overcrowding each day with too many destinations.
- Mark activities as optional when time is limited.
- Account for arrival and departure times when supplied.
- If business is the trip purpose, leave flexible time for meetings
  and work. Do not assume meetings are scheduled unless provided.
- Adapt recommendations to the selected travel group, budget
  and trip duration.
- Avoid repetitive activities and unnecessary detours.

6. Accommodation recommendations.
- Suggest 2-3 suitable neighborhoods or areas when useful.
- Explain each area's advantages and approximate suitability.
- Suggest accommodation types appropriate to the budget and
  travelling group.
- Provide approximate nightly cost ranges in local currency,
  clearly labelled as estimates.
- Explain what users should check before booking, including
  transport access, safety, cancellation terms and proximity
  to planned activities.
- Consider stated accommodation preferences, including dietary
  needs, when relevant.
- Clearly distinguish on-site facilities from nearby services.
- Do not invent specific hotel availability, confirmed amenities,
  live prices or booking details.
- If specific properties are suggested, distinguish general
  suggestions from information that has actually been verified.

7. Budget and factual accuracy.
- Give a reasonable estimated budget for food, local transport,
  activities and accommodation where relevant.
- Explain what is included and excluded from the estimate.
- Use the destination's local currency.
- Do not invent exact prices, current opening hours or live availability.
- Do not claim a venue is open at a particular time unless its
  hours have been verified.
- Identify important details the user should verify before travelling.
- If reliable current information is unavailable, state the uncertainty
  instead of presenting guesses as confirmed facts.

 
- Use consistent accommodation estimates throughout the response.
- Calculate the estimated trip total using the number of nights,
  food, transport, and activities.
- Clearly state whether the total is per person or for the
  entire travelling group.
- Show the assumptions used in the calculation.
- Avoid adding the same expense twice.
- Label all estimates clearly and do not present them as live prices.
 

OUTPUT FORMAT

Use clear headings and readable Markdown.

Include:
1. A brief trip overview.
2. Where to stay, with suitable areas and estimated costs.
3. A practical day-by-day itinerary.
4. Food recommendations that respect stated dietary requirements.
5. Approximate budget guidance.
6. Useful transport, safety and booking tips.
7. Important details that need verification.

Geographical accuracy and route planning
- Verify that every recommended place is in the stated destination or clearly label it as an optional excursion.
- Group nearby attractions on the same day.
- Do not schedule distant destinations on a day that already includes several activities.
- Account for realistic travel time between locations and explain when a private vehicle or ferry is needed.
- Never recommend a place in another city as though it were a local attraction.
- If a destination covers a large region, choose a practical base and prioritize nearby attractions instead of trying to cover the entire region.
- When location details or travel times are uncertain, state that they need verification rather than inventing specifics.

Concise and user-friendly output
- Keep the entire itinerary concise, practical, and easy to scan.
- Aim for 500-800 words for a 4-day trip, adjusting the length to the trip duration and complexity.
- Use short paragraphs and bullet points instead of long explanations.
- Limit each day to 3-5 meaningful activities, grouped by morning, afternoon, and evening where appropriate.
- Avoid repeating the same advice across multiple sections.
- Keep accommodation recommendations, food suggestions, transport guidance, and budget breakdowns brief but useful.
- Prioritize actionable information over generic descriptions and promotional language.
- Never remove important safety, dietary, accessibility, or factual-uncertainty notes merely to meet the word limit.

Respectful personalization and factual accuracy
- Personalize recommendations using the user's explicitly stated interests and preferences, without inferring religion, identity, or beliefs.
- If the user requests mosques or halal food, use those preferences directly without labeling the user.
- Do not invent or guess attraction names, mosque names, historical facts, restaurant details, or visitor policies.
- If a place or detail cannot be verified, clearly state that verification is needed or recommend a more general activity.
- Separate optional excursions from the main itinerary and explain their approximate travel time.
- Ensure the budget includes the activities actually recommended, and identify any costs excluded from the total.

Budget and trip-duration consistency
- Match accommodation, food, transport, and activity estimates to the selected budget tier.
- State the assumed number of travelers and nights.
- Calculate the total using the listed expense estimates and check the arithmetic.
- Clearly distinguish the trip total from per-person costs.
- If arrival or departure times are unknown, state the assumptions used for the first and last days.
- Do not describe an estimate as a live price or guaranteed cost.

- Verify that every attraction is in the stated city or clearly label it as a day trip.
- Never describe an attraction in another city as a nearby local stop.
- Group activities by geographic area and account for realistic travel time.
- On arrival and departure days, plan activities around the user's actual flight times.
- Match the activity budget to the specific attractions and excursions recommended.
- Clearly distinguish estimated prices from verified current prices.
- Ensure every selected interest is meaningfully addressed without overloading the itinerary.

Make the itinerary specific to the user's inputs rather than
producing a generic destination guide.

Keep recommendations realistic, useful, concise and personalized.
Clearly distinguish estimates, suggestions and verified information.
`;

    const result = await model.generateContent(prompt);
    const itinerary = result.response.text();

    return Response.json({ itinerary });
  } catch (error) {
    console.error("Trip generation error:", error);

    const status = error.status || error.statusCode;

    if (status === 503 || status === 429) {
      return Response.json(
        {
          error:
            status === 503
              ? "Gemini is temporarily busy. Please wait a moment and try again."
              : "You've reached the current API usage limit. Please try again after it resets.",
        },
        { status }
      );
    }

    return Response.json(
      { error: "Unable to generate your trip. Please try again." },
      { status: 500 }
    );
  }
}
