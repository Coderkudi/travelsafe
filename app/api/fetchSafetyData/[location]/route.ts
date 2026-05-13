// import { genAI, generateForecast, getWeather } from "@/lib/utils";
// import { safetyScore } from "@/types/SafetyData";
// import type { GenerateContentResult } from "@google/generative-ai";
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
//             Please provide realtime comprehensive safety and travel information for ${location}. Include:
// 1. Safety metrics (crime index and safety index on a scale of 0-100)
// 2. Current travel advisory status and level (1-4)
// 3. Weather conditions and forecast
// 4. Active health advisories
// 5. Recent security incidents (theft, protests, etc.)
// 6. Emergency contact numbers
// 7. Nearby medical facilities
// 8. Local safety tips

// Format the response as a JSON object with the following structure:
// {
//   "location": string,
//   "crimeIndex": number,
//   "safetyIndex": number,
//   "travelAdvisory": string,
//   "advisoryLevel": number,
//   "weather": {
//     "condition": string,
//     "temperature": number,
//     "forecast": string
//   },
//   "healthAdvisories": string[],
//   "recentIncidents": [
//     {
//       "type": string,
//       "location": string,
//       "description": string
//     }
//   ],
//   "emergencyContacts": {
//     "police": string,
//     "ambulance": string,
//     "fireService": string,
//     "emergencyHotline": string
//   },
//   "nearbyHospitals": [
//     {
//       "name": string,
//       "distance": string
//     }
//   ],
//   "aiGeneratedTips": string
// }
//   Note: All news and weather condition should be realtime only`;
//             const safetyData = await getSafetyData(location);
//             if (!safetyData) {
                
//                 throw new Error("Failed to fetch safety data");
//             }
//             let sumOfSafetyScore = 0;
//             if (safetyData) {
//                 sumOfSafetyScore =
//                     safetyData?.publicSafety.crimeRate +
//                     safetyData?.publicSafety.emergencyResponse +
//                     safetyData?.publicSafety.policePresence +
//                     safetyData?.publicSafety.NeighborhoodSafety +
//                     safetyData?.publicSafety.NighttimeSafety +
//                     safetyData?.healthSafety.airQuality +
//                     safetyData?.healthSafety.waterQuality +
//                     safetyData?.healthSafety.foodHygiene +
//                     safetyData?.healthSafety.accessToHealthcare +
//                     safetyData?.healthSafety.diseasePrevalence +
//                     safetyData?.natureRisk.naturalDisasters +
//                     safetyData?.natureRisk.wildlifeEncounters +
//                     safetyData?.natureRisk.environmentalHazards +
//                     safetyData?.natureRisk.climateChangeImpact +
//                     safetyData?.natureRisk.uvIndex +
//                     safetyData?.CultureAndLegalAwareness.lawsAndRegulations +
//                     safetyData?.CultureAndLegalAwareness.culturalNorms +
//                     safetyData?.CultureAndLegalAwareness.localCustoms +
//                     safetyData?.CultureAndLegalAwareness.languageBarrier +
//                     safetyData?.CultureAndLegalAwareness.legalAssistance +
//                     safetyData?.techSafety.dataPrivacy +
//                     safetyData?.techSafety.cyberSecurity +
//                     safetyData?.techSafety.digitalFraud +
//                     safetyData?.techSafety.onlineHarassment +
//                     safetyData?.techSafety.techSupport;
//             }
//             const result: GenerateContentResult = await model.generateContent([prompt]);
//             const weather = await getWeather(location);
//             if (result && weather) {
//                 try {
//                     const forcast = generateForecast({
//                         condition: weather.condition,
//                         temperature: weather.temperature,
//                         humidity: weather.humidity,
//                         windSpeed: weather.windSpeed,
//                         windDirection: weather.windDirection,
//                         location: weather.location,
//                         forecast: weather.forecast,
//                     });

//                     const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
//                     const jsonString = jsonMatch ? jsonMatch[0] : null;
//                     let jsonObject;
//                     jsonObject = JSON.parse(jsonString as string);
//                     jsonObject.weather = {
//                         condition: weather.condition,
//                         temperature: Math.floor(weather.temperature),
//                         forecast: forcast,
//                     };
//                     jsonObject.safetyIndex = sumOfSafetyScore;
//                     jsonObject.coordinates = {
//                         lat: weather.coordinates.lat,
//                         lon: weather.coordinates.lon,
//                     };
//                     jsonObject.safetyScore = safetyData;
//                     return NextResponse.json(jsonObject, {
//                         status: 200,
//                     });
//                 } catch (error) {
//                     if (error instanceof Error) {
//                         return NextResponse.json("Got request but no location", {
//                             status: 400,
//                         });
//                     }
//                 }
//             }
//             return NextResponse.json("Error getting ai Reponse", { status: 400 });
//         } else {
//             return NextResponse.json("Got request but no location", { status: 400 });
//         }
//     } catch (e) {
//         console.error(e)
//         if (e instanceof Error) {
//             return NextResponse.json(e.message, { status: 500 });
//         }
//     }
// }

// async function getSafetyData(location: string) {
//     try {
//         if (location) {
//             const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//             const prompt = `
//             please provide a comprehensive safety score for ${location}. Include:
//             1. Public Safety
//             2. Health Safety
//             3. Nature Risk
//             4. Culture and Legal Awareness
//             5. Tech Safety
//             Each category should be rated on a scale of 0-4, where 0 is very poor and 4 is excellent and all data should be relevant to the current date.
    
//             Format the response as a JSON object with the following structure:
//             {
//         publicSafety: {
//             crimeRate: number out of 4;
//             emergencyResponse: number out of 4; 
//             policePresence: number out of 4;
//             NeighborhoodSafety: number out of 4;
//             NighttimeSafety: number out of 4;
//         };
//         healthSafety: {
//             airQuality: number out of 4;
//             waterQuality: number out of 4;
//             foodHygiene: number out of 4;
//             accessToHealthcare: number out of 4;;
//             diseasePrevalence: number out of 4;;
//         };
//         natureRisk: {
//             naturalDisasters: number out of 4;
//             wildlifeEncounters: number out of 4;;
//             environmentalHazards: number out of 4;;
//             climateChangeImpact: number out of 4;;
//             uvIndex: number out of 4;
//         };
//         CultureAndLegalAwareness: {
//             lawsAndRegulations: number out of 4;
//             culturalNorms: number out of 4;
//             localCustoms: number out of 4;
//             languageBarrier: number out of 4;
//             legalAssistance: number out of 4;
//         };
//         techSafety: {
//             dataPrivacy: number out of 4;
//             cyberSecurity: number out of 4;;
//             digitalFraud: number out of 4;;
//             onlineHarassment: number out of 4;;
//             techSupport: number out of 4;
//         };
//     } `;
//             const result: GenerateContentResult = await model.generateContent([prompt]);
//             const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
//             const jsonString = jsonMatch ? jsonMatch[0] : null;
//             let safetyData: safetyScore;

//             if (jsonString) {
//                 try {
//                     safetyData = JSON.parse(jsonString);
//                     return safetyData;
//                 } catch (error) {
//                     if (error instanceof Error) {
//                         return null;
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error("This is error:- ",error.message)
//             return null;
//         }
//     }
// }

import Groq from "groq-sdk";
import { generateForecast, getWeather } from "@/lib/utils";
import { safetyScore } from "@/types/SafetyData";
import { NextRequest, NextResponse } from "next/server";

function getGroqClient() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    return new Groq({ apiKey });
}

// export const runtime = "edge";
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ location: string }> },
) {
    try {
        const groq = getGroqClient();
        if (!groq) {
            return NextResponse.json(
                { error: "Missing GROQ_API_KEY environment variable." },
                { status: 500 },
            );
        }

        const { location } = await context.params;
        if (location) {
            const prompt = `
Provide a comprehensive safety and travel briefing for ${location} based on your best knowledge of the region.

Include:
1. Safety metrics (crimeIndex and safetyIndex, each as a number 0-100; estimate from typical city profile)
2. Travel advisory status and level (1-4) — provide a plausible level based on general country/region conditions
3. Weather conditions and short forecast (general seasonal pattern for the location)
4. Health advisories (common ones for the region, e.g. mosquito-borne illness, air quality, water safety)
5. Recent or typical security incidents (theft, scams, protests, common crimes for the area)
6. Emergency contact numbers (use the country's standard emergency numbers)
7. Nearby medical facilities (real or plausible hospital names in the area with realistic distances)
8. Local safety tips relevant to the location

Return the response as a single valid JSON object with this exact structure:
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
    { "type": string, "location": string, "description": string }
  ],
  "emergencyContacts": {
    "police": string,
    "ambulance": string,
    "fireService": string,
    "emergencyHotline": string
  },
  "nearbyHospitals": [
    { "name": string, "distance": string }
  ],
  "aiGeneratedTips": string
}

STRICT RULES:
- Every field MUST be populated with a meaningful value.
- NEVER use null, "N/A", "Data not available", "Unknown", or empty arrays.
- If you don't have exact real-time data, provide your best estimate based on general knowledge of the location.
- Numbers must be actual numbers (not strings or null).
- Provide at least 2 healthAdvisories, 2 recentIncidents, and 2 nearbyHospitals.
- Return only the JSON object, no markdown, no commentary.`;

            const safetyData = await getSafetyData(location);
            if (!safetyData) {
                throw new Error("Failed to fetch safety data");
            }

            let sumOfSafetyScore = 0;
            if (safetyData) {
                sumOfSafetyScore =
                    safetyData?.publicSafety.crimeRate +
                    safetyData?.publicSafety.emergencyResponse +
                    safetyData?.publicSafety.policePresence +
                    safetyData?.publicSafety.NeighborhoodSafety +
                    safetyData?.publicSafety.NighttimeSafety +
                    safetyData?.healthSafety.airQuality +
                    safetyData?.healthSafety.waterQuality +
                    safetyData?.healthSafety.foodHygiene +
                    safetyData?.healthSafety.accessToHealthcare +
                    safetyData?.healthSafety.diseasePrevalence +
                    safetyData?.natureRisk.naturalDisasters +
                    safetyData?.natureRisk.wildlifeEncounters +
                    safetyData?.natureRisk.environmentalHazards +
                    safetyData?.natureRisk.climateChangeImpact +
                    safetyData?.natureRisk.uvIndex +
                    safetyData?.CultureAndLegalAwareness.lawsAndRegulations +
                    safetyData?.CultureAndLegalAwareness.culturalNorms +
                    safetyData?.CultureAndLegalAwareness.localCustoms +
                    safetyData?.CultureAndLegalAwareness.languageBarrier +
                    safetyData?.CultureAndLegalAwareness.legalAssistance +
                    safetyData?.techSafety.dataPrivacy +
                    safetyData?.techSafety.cyberSecurity +
                    safetyData?.techSafety.digitalFraud +
                    safetyData?.techSafety.onlineHarassment +
                    safetyData?.techSafety.techSupport;
            }

            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert travel safety analyst. You ALWAYS provide concrete, plausible answers based on your knowledge of world cities and regions — never refuse, never say data is unavailable, never use null. Output strictly a single valid JSON object. No markdown. No commentary.",
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
            console.log("=== GROQ API RESPONSE (fetchSafetyData) ===");
            console.log(text);

            const weather = await getWeather(location);

            if (text && weather) {
                try {
                    const forecast = generateForecast({
                        condition: weather.condition,
                        temperature: weather.temperature,
                        humidity: weather.humidity,
                        windSpeed: weather.windSpeed,
                        windDirection: weather.windDirection,
                        location: weather.location,
                        forecast: weather.forecast,
                    });

                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    const jsonString = jsonMatch ? jsonMatch[0] : null;
                    let jsonObject;
                    jsonObject = JSON.parse(jsonString as string);
                    jsonObject.weather = {
                        condition: weather.condition,
                        temperature: Math.floor(weather.temperature),
                        forecast,
                    };
                    jsonObject.safetyIndex = sumOfSafetyScore;
                    jsonObject.coordinates = {
                        lat: weather.coordinates.lat,
                        lon: weather.coordinates.lon,
                    };
                    jsonObject.safetyScore = safetyData;
                    return NextResponse.json(jsonObject, {
                        status: 200,
                    });
                } catch (error) {
                    if (error instanceof Error) {
                        return NextResponse.json("Got request but no location", {
                            status: 400,
                        });
                    }
                }
            }
            return NextResponse.json("Error getting ai Response", { status: 400 });
        } else {
            return NextResponse.json("Got request but no location", { status: 400 });
        }
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            return NextResponse.json(e.message, { status: 500 });
        }
    }
}

async function getSafetyData(location: string) {
    try {
        const groq = getGroqClient();
        if (!groq) return null;
        if (location) {
            const prompt = `
Provide a comprehensive safety score for ${location} based on your knowledge of the region.
Rate each metric on an integer scale 0-4 (0 = very poor, 4 = excellent).

Return ONLY a single valid JSON object with this exact structure (no comments, no trailing text):
{
  "publicSafety": {
    "crimeRate": number,
    "emergencyResponse": number,
    "policePresence": number,
    "NeighborhoodSafety": number,
    "NighttimeSafety": number
  },
  "healthSafety": {
    "airQuality": number,
    "waterQuality": number,
    "foodHygiene": number,
    "accessToHealthcare": number,
    "diseasePrevalence": number
  },
  "natureRisk": {
    "naturalDisasters": number,
    "wildlifeEncounters": number,
    "environmentalHazards": number,
    "climateChangeImpact": number,
    "uvIndex": number
  },
  "CultureAndLegalAwareness": {
    "lawsAndRegulations": number,
    "culturalNorms": number,
    "localCustoms": number,
    "languageBarrier": number,
    "legalAssistance": number
  },
  "techSafety": {
    "dataPrivacy": number,
    "cyberSecurity": number,
    "digitalFraud": number,
    "onlineHarassment": number,
    "techSupport": number
  }
}

STRICT RULES:
- Every field must be an integer 0-4. NEVER null, NEVER strings.
- Always provide your best assessment based on general knowledge of the location — do not refuse.`;

            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert travel safety analyst. You ALWAYS provide concrete numeric safety scores 0-4 for any location based on your knowledge. Never refuse, never use null. Output only a single valid JSON object.",
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
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : null;
            let safetyData: safetyScore;

            if (jsonString) {
                try {
                    safetyData = JSON.parse(jsonString);
                    return safetyData;
                } catch (error) {
                    if (error instanceof Error) {
                        return null;
                    }
                }
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("This is error:- ", error.message);
            return null;
        }
    }
}
