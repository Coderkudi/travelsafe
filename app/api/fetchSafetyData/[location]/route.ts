import { genAI, generateForecast, getWeather } from "@/lib/utils";
import { SafetyDataType, safetyScore } from "@/types/SafetyData";
import type { GenerateContentResult } from "@google/generative-ai";

import { NextRequest, NextResponse } from "next/server";
import * as React from "react";
import { json } from "stream/consumers";
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ location: string }> },
) {
    try {
        const { location } = await context.params;
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
            const result: GenerateContentResult = await model.generateContent([prompt]);
            const weather = await getWeather(location);
            if (result && weather) {
                try {
                    const forcast = generateForecast({
                        condition: weather.condition,
                        temperature: weather.temperature,
                        humidity: weather.humidity,
                        windSpeed: weather.windSpeed,
                        windDirection: weather.windDirection,
                        location: weather.location,
                        forecast: weather.forecast,
                    });

                    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
                    const jsonString = jsonMatch ? jsonMatch[0] : null;
                    let jsonObject;
                    jsonObject = JSON.parse(jsonString as string);
                    jsonObject.weather = {
                        condition: weather.condition,
                        temperature: Math.floor(weather.temperature),
                        forecast: forcast,
                    };
                    jsonObject.safetyIndex = sumOfSafetyScore;
                    jsonObject.coordinates = {
                        lat: weather.coordinates.lat,
                        lon: weather.coordinates.lon,
                    };

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

async function getSafetyData(location: string) {
    if (location) {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
        please provide a comprehensive safety score for ${location}. Include:
        1. Public Safety
        2. Health Safety
        3. Nature Risk
        4. Culture and Legal Awareness
        5. Tech Safety
        Each category should be rated on a scale of 0-4, where 0 is very poor and 4 is excellent and all data should be relevant to the current date.

        Format the response as a JSON object with the following structure:
        {
    publicSafety: {
        crimeRate: number out of 4;
        emergencyResponse: number out of 4; 
        policePresence: number out of 4;
        NeighborhoodSafety: number out of 4;
        NighttimeSafety: number out of 4;
    };
    healthSafety: {
        airQuality: number out of 4;
        waterQuality: number out of 4;
        foodHygiene: number out of 4;
        accessToHealthcare: number out of 4;;
        diseasePrevalence: number out of 4;;
    };
    natureRisk: {
        naturalDisasters: number out of 4;
        wildlifeEncounters: number out of 4;;
        environmentalHazards: number out of 4;;
        climateChangeImpact: number out of 4;;
        uvIndex: number out of 4;
    };
    CultureAndLegalAwareness: {
        lawsAndRegulations: number out of 4;
        culturalNorms: number out of 4;
        localCustoms: number out of 4;
        languageBarrier: number out of 4;
        legalAssistance: number out of 4;
    };
    techSafety: {
        dataPrivacy: number out of 4;
        cyberSecurity: number out of 4;;
        digitalFraud: number out of 4;;
        onlineHarassment: number out of 4;;
        techSupport: number out of 4;
    };
} `;
        const result: GenerateContentResult = await model.generateContent([prompt]);
        const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : null;
        let safetyData: safetyScore;

        if (jsonString) {
            try {
                safetyData = JSON.parse(jsonString);
                return safetyData;
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    return null;
                }
            }
        }
    }
}
