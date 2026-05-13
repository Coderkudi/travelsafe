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


import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const xai = createXai({ apiKey: process.env.XAI_API_KEY });

// export const runtime = "edge";
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ location: string }> },
) {
    try {
        const { location } = await context.params;
        if (location) {
            const prompt = `
          Using accurate and up-to-date of Current Year information, provide a detailed list of important landmarks near ${location}, categorized into:

1. Safety landmarks (e.g., police stations, fire departments)
2. Medical facilities (e.g., hospitals, clinics)
3. Recent or notable incidents (e.g., protests, crimes, natural events)

Use verified or realistic data with real-world latitude and longitude coordinates.

Return the result strictly as a valid JSON array, where each object has the following structure:

[
  {
    "id": "unique-identifier-1",
    "name": "Landmark or Event Name",
    "location": [latitude, longitude], // Real-world coordinates
    "type": "safety" | "hospital" | "incident",
    "description": "Short but informative description including relevant details (e.g., services, dates for incidents)"
  }
]

Only return the JSON, with no explanation or markdown formatting. Ensure location coordinates are accurate and plausible for the ${location} specified.
 `;

            const { text } = await generateText({
                model: xai.responses("openai/gpt-oss-120b"),
                system: "You are a helpful AI assistant. Always respond with valid JSON only, no explanation or markdown formatting.",
                prompt,
            });

            const jsonMatch = text.match(/\[\s*{[\s\S]*?}\s*\]/);
            const jsonString = jsonMatch ? jsonMatch[0] : null;
            let jsonObject;
            jsonObject = JSON.parse(jsonString as string);
            return NextResponse.json(jsonObject, { status: 200 });
        }
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }
}
