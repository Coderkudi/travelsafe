export interface SafetyDataType {
    location: string;
    crimeIndex: number;
    safetyIndex: number;
    travelAdvisory: string;
    advisoryLevel: number;
    weather: {
        condition: string;
        temperature: number;
        forecast: string;
    };
    healthAdvisories: string[];
    recentIncidents: {
        type: string;
        location: string;
        description: string;
    }[];

    emergencyContacts: {
        police: string;
        ambulance: string;
        fireService: string;
        emergencyHotline: string;
    };
    nearbyHospitals: {
        name: string;
        distance: string;
    }[];

    aiGeneratedTips: string;
}
