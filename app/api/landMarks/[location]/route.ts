// import { genAI } from "@/lib/utils";
// import { NextRequest, NextResponse } from "next/server";

// // export const runtime = "edge";
// export async function GET(
//     req: NextRequest,
//     context: { params: Promise<{ location: string }> },
// ) {
//     try {
//         const { location } = await context.params;
//         if (location) {
//             const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//             const prompt = `
//           Using accurate and up-to-date of Current Year information, provide a detailed list of important landmarks near ${location}, categorized into:

// 1. Safety landmarks (e.g., police stations, fire departments)
// 2. Medical facilities (e.g., hospitals, clinics)
// 3. Recent or notable incidents (e.g., protests, crimes, natural events)

// Use verified or realistic data with real-world latitude and longitude coordinates.

// Return the result strictly as a valid JSON array, where each object has the following structure:

// [
//   {
//     "id": "unique-identifier-1",
//     "name": "Landmark or Event Name",
//     "location": [latitude, longitude], // Real-world coordinates
//     "type": "safety" | "hospital" | "incident",
//     "description": "Short but informative description including relevant details (e.g., services, dates for incidents)"
//   }
// ]

// Only return the JSON, with no explanation or markdown formatting. Ensure location coordinates are accurate and plausible for the ${location} specified.
//  `;
//             const result = await model.generateContent([prompt]);
//             const jsonMatch = result.response.text().match(/\[\s*{[\s\S]*?}\s*\]/);
//             const jsonString = jsonMatch ? jsonMatch[0] : null;
//             let jsonObject;
//             jsonObject = JSON.parse(jsonString as string);
//             return NextResponse.json(jsonObject, { status: 200 });
//         }
//     } catch (err) {
//         if (err instanceof Error) {
//             return NextResponse.json({ error: err.message }, { status: 500 });
//         }
//     }
// }


import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

// export const runtime = "edge";
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ location: string }> },
) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing GROQ_API_KEY environment variable." },
                { status: 500 },
            );
        }

        const groq = new Groq({ apiKey });

        const { location } = await context.params;
        if (!location) {
            return NextResponse.json(
                { error: "Location is required" },
                { status: 400 },
            );
        }

        const prompt = `
Provide a detailed list of important landmarks in and around ${location}, based on your knowledge of the area. Include real, well-known places when possible; if unsure, provide plausible realistic entries.

Categorize into:
1. Safety landmarks (police stations, fire departments) — type: "safety"
2. Medical facilities (hospitals, clinics) — type: "hospital"
3. Notable incidents or events (protests, crime hotspots, natural events) — type: "incident"

Use real-world latitude and longitude coordinates for ${location}.

Return ONLY a valid JSON object with a single key "landmarks" that is an array, where each item has this exact structure:
{
  "landmarks": [
    {
      "id": "unique-identifier-1",
      "name": "Landmark or Event Name",
      "location": [latitude, longitude],
      "type": "safety" | "hospital" | "incident",
      "description": "Short but informative description"
    }
  ]
}

STRICT RULES:
- Provide at least 8 entries total covering all three categories.
- Coordinates must be real numbers near ${location}.
- NEVER refuse, NEVER use null or "Data not available".
- Return only the JSON object, no markdown, no commentary.
 `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert local geography and safety analyst. You ALWAYS provide concrete landmark data for any location based on your knowledge. Never refuse. Output only a single valid JSON object.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.4,
            response_format: { type: "json_object" },
        });

        const text = completion.choices[0]?.message?.content || "";
        console.log("=== GROQ API RESPONSE (landMarks) ===");
        console.log(text);

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch {
            return NextResponse.json(
                { error: "AI returned invalid JSON", raw: text },
                { status: 500 },
            );
        }

        const landmarksArray = Array.isArray(parsed)
            ? parsed
            : parsed.landmarks || parsed.data || [];

        return NextResponse.json(landmarksArray, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "AI generation failed" },
            { status: 500 },
        );
    }
}
