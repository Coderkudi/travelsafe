export interface SafetyDataType {
    location: string;
    coordinates: {
        lat: number;
        lon: number;
    };
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
    safetyScore?: safetyScore;
}

export interface safetyScore {
    publicSafety: {
        crimeRate: number;
        emergencyResponse: number;
        policePresence: number;
        NeighborhoodSafety: number;
        NighttimeSafety: number;
    };
    healthSafety: {
        airQuality: number;
        waterQuality: number;
        foodHygiene: number;
        accessToHealthcare: number;
        diseasePrevalence: number;
    };
    natureRisk: {
        naturalDisasters: number;
        wildlifeEncounters: number;
        environmentalHazards: number;
        climateChangeImpact: number;
        uvIndex: number;
    };
    CultureAndLegalAwareness: {
        lawsAndRegulations: number;
        culturalNorms: number;
        localCustoms: number;
        languageBarrier: number;
        legalAssistance: number;
    };
    techSafety: {
        dataPrivacy: number;
        cyberSecurity: number;
        digitalFraud: number;
        onlineHarassment: number;
        techSupport: number;
    };
}

export interface Landmark {
    id: string;
    name: string;
    location: [number, number];
    type: "safety" | "hospital" | "incident";
    description?: string;
}
