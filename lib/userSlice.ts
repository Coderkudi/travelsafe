import { SafetyDataType } from "@/types/SafetyData";
import { createSelector, createSlice } from "@reduxjs/toolkit";
interface StateInterface {
    locationSearchBoxText: string;
    location: {
        name: string | null;
        lat: number;
        lon: number;
    };
    safetyData: SafetyDataType;
}
const initialState: StateInterface = {
    locationSearchBoxText: "paris,france",
    location: {
        name: null,
        lat: 0,
        lon: 0,
    },
    safetyData: {
        location: "Paris, France",
        coordinates: {
            lat: 48.8566,
            lon: 2.3522,
        },
        crimeIndex: 42,
        safetyIndex: 58,

        travelAdvisory: "Exercise increased caution",
        advisoryLevel: 2,
        weather: {
            condition: "Partly Cloudy",
            temperature: 22,
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
            { name: "Hôpital Saint-Antoine", distance: "2.3 km" },
            { name: "Hôpital Hôtel-Dieu", distance: "3.1 km" },
        ],
        aiGeneratedTips: "",
    },
};
const locationData = createSlice({
    name: "locationInformation",
    initialState,
    reducers: {
        setLocationInformation: (
            state: StateInterface,
            action: {
                payload: Pick<StateInterface, "location">;
            },
        ) => {
            state.location = action.payload.location;
        },
        setLocationSearchBoxText: (
            state: StateInterface,
            action: {
                payload: Pick<StateInterface, "locationSearchBoxText">;
            },
        ) => {
            state.locationSearchBoxText = action.payload.locationSearchBoxText;
        },
        setSafetyData: (
            state: StateInterface,
            action: {
                payload: Pick<StateInterface, "safetyData">;
            },
        ) => {
            state.safetyData = action.payload.safetyData;
        },
    },
});

export const { setLocationInformation } = locationData.actions;
export default locationData.reducer;

export const selectLocationState = (state: any) => state.locationInformation;
export const selectLocationSearchBoxText = createSelector(
    selectLocationState,
    (state: StateInterface) => state.locationSearchBoxText,
);
export const selectLocation = createSelector(
    selectLocationState,
    (state: StateInterface) => state.location,
);
export const selectsafetyData = createSelector(
    selectLocationState,
    (state: StateInterface) => state.safetyData,
);
