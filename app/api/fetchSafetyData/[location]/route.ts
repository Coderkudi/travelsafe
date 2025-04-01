import { genAI } from "@/lib/utils";
import type { GenerateContentResult } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { location: string } },
) {
    try {
        const { location } = params;
        if (location) {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `
            Please provide realtime comprehensive safety and travel information for ${location}. Include:
1. Safety metrics (crime index and safety index on a scale of 0-100)
2. Current travel advisory status and level (1-4)
3. Weather conditions and forecast
4. Active health advisories
5. Recent security incidents (theft, protests, etc.)
6. Emergency contact numbers
7. Nearby medical facilities
8. Local safety tips

Format the response as a JSON object with the following structure:
{
  "location": string,
  "crimeIndex": number,
  "safetyIndex": number,
  "travelAdvisory": string,
  "advisoryLevel": number,
  "weather": {
    "condition": string,
    "temperature": number,
    "forecast": string
  },
  "healthAdvisories": string[],
  "recentIncidents": [
    {
      "type": string,
      "location": string,
      "description": string
    }
  ],
  "emergencyContacts": {
    "police": string,
    "ambulance": string,
    "fireService": string,
    "emergencyHotline": string
  },
  "nearbyHospitals": [
    {
      "name": string,
      "distance": string
    }
  ],
  "aiGeneratedTips": string
}
  Note: All news and weather condition should be realtime only`;
            const result: GenerateContentResult = await model.generateContent([prompt]);
            if (result) {
                try {
                    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
                    const jsonString = jsonMatch ? jsonMatch[0] : null;
                    let jsonObject;
                    jsonObject = JSON.parse(jsonString as string);
                    return NextResponse.json(jsonObject, {
                        status: 200,
                    });
                } catch (error) {
                    if (error instanceof Error) {
                        console.log(error.message);

                        return NextResponse.json("Got request but no location", {
                            status: 400,
                        });
                    }
                }
            }
            return NextResponse.json("Error getting ai Reponse", { status: 400 });
        } else {
            return NextResponse.json("Got request but no location", { status: 400 });
        }
    } catch (e) {
        if (e instanceof Error) {
            return NextResponse.json(e.message, { status: 500 });
        }
    }
}
