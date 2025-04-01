// "use server"

// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

// // This would be a real API call in a production app
// export async function getSafetyData(location: string) {
//   try {
//     // In a real app, we would fetch data from various APIs
//     // For demo purposes, we'll generate some mock data

//     // We could use AI to generate personalized safety tips
//     const aiResponse = await generateAISafetyTips(location)

//     return {
//       location,
//       crimeIndex: Math.floor(Math.random() * 60) + 20,
//       safetyIndex: Math.floor(Math.random() * 60) + 20,
//       travelAdvisory: "Exercise increased caution",
//       advisoryLevel: Math.floor(Math.random() * 3) + 1,
//       weather: {
//         condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
//         temperature: Math.floor(Math.random() * 30) + 5,
//         forecast: "Mild conditions expected for the next 3 days",
//       },
//       healthAdvisories: ["COVID-19: Masks recommended in crowded places", "Seasonal flu activity is elevated"],
//       recentIncidents: [
//         {
//           type: "Theft",
//           location: "Tourist areas",
//           description: "Pickpocketing reported in popular tourist spots",
//         },
//         {
//           type: "Protest",
//           location: "City Center",
//           description: "Scheduled demonstration on Saturday",
//         },
//       ],
//       emergencyContacts: {
//         police: "17",
//         ambulance: "15",
//         fireService: "18",
//         emergencyHotline: "112",
//       },
//       nearbyHospitals: [
//         { name: `${location} General Hospital`, distance: "2.3 km" },
//         { name: `${location} Medical Center`, distance: "3.1 km" },
//       ],
//       aiGeneratedTips: aiResponse,
//     }
//   } catch (error) {
//     console.error("Error fetching safety data:", error)
//     throw new Error("Failed to fetch safety data")
//   }
// }

// // Use AI to generate personalized safety tip
// async function generateAISafetyTips(location: string) {
//   try {
//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       prompt: `Provide 3 specific safety tips for travelers visiting ${location}. Focus on practical advice based on common issues in this location. Format as a bulleted list.`,
//       maxTokens: 200,
//     })

//     return text
//   } catch (error) {
//     console.error("Error generating AI safety tips:", error)
//     return "• Stay aware of your surroundings in tourist areas\n• Keep valuables secure and out of sight\n• Use official transportation services"
//   }
// }

import React from "react";

function getSafetyData(location: String) {
    return {
        location,
        crimeIndex: Math.floor(Math.random() * 60) + 20,
        safetyIndex: Math.floor(Math.random() * 60) + 20,
        travelAdvisory: "Exercise increased caution",
        advisoryLevel: Math.floor(Math.random() * 3) + 1,
        weather: {
            condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][
                Math.floor(Math.random() * 4)
            ],
            temperature: Math.floor(Math.random() * 30) + 5,
            forecast: "Mild conditions expected for the next 3 days",
        },
        healthAdvisories: [
            "COVID-19: Masks recommended in crowded places",
            "Seasonal flu activity is elevated",
        ],
        recentIncidents: [
            {
                type: "Theft",
                location: "Tourist areas",
                description: "Pickpocketing reported in popular tourist spots",
            },
            {
                type: "Protest",
                location: "City Center",
                description: "Scheduled demonstration on Saturday",
            },
        ],
        emergencyContacts: {
            police: "17",
            ambulance: "15",
            fireService: "18",
            emergencyHotline: "112",
        },
        nearbyHospitals: [
            { name: `${location} General Hospital`, distance: "2.3 km" },
            { name: `${location} Medical Center`, distance: "3.1 km" },
        ],
        aiGeneratedTips: "",
    };
}

export default getSafetyData;
