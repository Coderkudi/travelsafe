import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getWeather(location: string) {
    try {
        const res = await fetch(
            `https://pro.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
        );
        const json = await res.json();
        if (json.cod !== 200) {
            throw new Error(json.message);
        }
        const weather = {
            condition: json.weather[0].description,
            temperature: json.main.temp,
            forecast: json.weather[0].main,
            humidity: json.main.humidity,
            windSpeed: json.wind.speed,
            windDirection: json.wind.deg,
            visibility: json.visibility,
            pressure: json.main.pressure,
            sunrise: json.sys.sunrise,
            sunset: json.sys.sunset,
            location: json.name,
            country: json.sys.country,
            timezone: json.timezone,
            coordinates: {
                lat: json.coord.lat,
                lon: json.coord.lon,
            },
        };

        return weather;
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return null;
        }
    }
}

export function generateForecast({
    condition,
    temperature,
    humidity,
    windSpeed,
    windDirection,
    location,
    forecast,
}: {
    condition: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    location: string;
    forecast: string;
}) {
    const temp = Math.round(temperature);
    const windDirs = [
        "north",
        "northeast",
        "east",
        "southeast",
        "south",
        "southwest",
        "west",
        "northwest",
    ];
    const dirIndex = Math.round(windDirection / 45) % 8;
    const windDirText = windDirs[dirIndex];

    const conditionOptions = [
        `Expect ${forecast.toLowerCase()} skies in ${location}`,
        `Skies remain ${condition.toLowerCase()} over ${location}`,
        `Clear weather is likely in ${location}`,
        `Conditions stay ${forecast.toLowerCase()} today in ${location}`,
    ];

    const tempOptions = [
        `Highs around ${temp}°C`,
        `Temperature peaking near ${temp}°C`,
        `Expect a maximum of ${temp}°C`,
        `Daytime temps will hover near ${temp}°C`,
    ];

    const humidityOptions = [
        `Humidity levels stay around ${humidity}%`,
        `Air remains dry with ${humidity}% humidity`,
        `${humidity}% humidity expected throughout the day`,
    ];

    let windDesc = "light";
    if (windSpeed >= 15) windDesc = "strong";
    else if (windSpeed >= 8) windDesc = "moderate";

    const windOptions = [
        `Winds are ${windDesc}, blowing from the ${windDirText} at ${windSpeed} km/h`,
        `Expect ${windDesc} winds from the ${windDirText}`,
        `${
            windDesc.charAt(0).toUpperCase() + windDesc.slice(1)
        } winds coming in from the ${windDirText}`,
    ];

    const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    return `${rand(conditionOptions)}. ${rand(tempOptions)}. ${rand(
        humidityOptions,
    )}. ${rand(windOptions)}.`;
}
