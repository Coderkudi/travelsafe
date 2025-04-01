"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertTriangle,
    CloudRain,
    AlertCircle,
    Hospital,
    Phone,
    Search,
} from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
import { useLazyFetchSafetyDataQuery } from "@/lib/user";
import { SafetyDataType } from "@/types/SafetyData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SafetyDashboard() {
    const [destination, setDestination] = useState("Paris, France");
    const [safetyData, setSafetyData] = useState<SafetyDataType>({
        location: "Paris, France",
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
    });
    const [loading, setLoading] = useState(false);
    const [locationInfo, { data, error, isLoading }] = useLazyFetchSafetyDataQuery();
    const handleSearch = (e: any) => {
        e.preventDefault();
        locationInfo(destination);
    };
    useEffect(() => {
        setLoading(isLoading);
        console.log(data, error, isLoading);
        try {
            if (data) {
                // @ts-ignore
                setSafetyData(data);
            }
        } catch (error) {
            toast({
                title: "Error fetching safety data",
                description: "Please try again later or check your destination name.",
                variant: "destructive",
            });
        } finally {
            setLoading(isLoading);
        }
    }, [data, error, isLoading]);
    const getSafetyColor = (index: number) => {
        if (index >= 80) return "text-green-500";
        if (index >= 60) return "text-emerald-500";
        if (index >= 40) return "text-amber-500";
        if (index >= 20) return "text-orange-500";
        return "text-red-500";
    };
    const getAdvisoryBadge = (level: number) => {
        const levels: Record<
            number,
            {
                label: string;
                variant: "default" | "destructive" | "outline" | "secondary";
            }
        > = {
            1: { label: "Exercise normal precautions", variant: "outline" },
            2: { label: "Exercise increased caution", variant: "secondary" },
            3: { label: "Reconsider travel", variant: "destructive" },
            4: { label: "Do not travel", variant: "destructive" },
        };
        return levels[level] || levels[2];
    };

    const advisoryBadge = getAdvisoryBadge(safetyData.advisoryLevel);
    return (
        <div className="w-full max-w-6xl mx-auto mt-8">
            <form
                onSubmit={handleSearch}
                className="flex w-full max-w-lg mx-auto mb-8 gap-2"
            >
                <div className="flex-1">
                    <Label htmlFor="destination" className="sr-only">
                        Destination
                    </Label>
                    <Input
                        id="destination"
                        placeholder="Enter destination (city, country)"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full"
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : <Search className="h-4 w-4 mr-2" />}
                    Search
                </Button>
            </form>

            {/*  safety index , weather condition  */}
            {/* weather api -> open api map .  */}
            {/* fix theme from here */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl">Safety Index</CardTitle>
                        <CardDescription>
                            Overall safety rating for {safetyData?.location as string}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-center justify-center py-4">
                            <div className="relative h-40 w-40">
                                <svg className="h-full w-full" viewBox="0 0 100 100">
                                    <circle
                                        className="text-muted-foreground stroke-current"
                                        strokeWidth="10"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                    />
                                    <circle
                                        className={`${getSafetyColor(
                                            safetyData.safetyIndex,
                                        )} stroke-current`}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        fill="transparent"
                                        r="40"
                                        cx="50"
                                        cy="50"
                                        strokeDasharray={`${
                                            safetyData.safetyIndex * 2.51
                                        } 251.2`}
                                        strokeDashoffset="0"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p
                                            className={`text-4xl font-bold ${getSafetyColor(
                                                safetyData.safetyIndex,
                                            )}`}
                                        >
                                            {safetyData.safetyIndex}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            out of 100
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Badge
                            variant={advisoryBadge.variant}
                            className="w-full justify-center py-1.5"
                        >
                            {advisoryBadge.label}
                        </Badge>
                    </CardFooter>
                </Card>

                {/* Weather card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <CloudRain className="h-5 w-5" />
                            Weather Conditions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center py-4">
                            <div className="text-5xl font-bold mb-2">
                                {safetyData.weather.temperature}°C
                            </div>
                            <div className="text-lg mb-4">
                                {safetyData.weather.condition}
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                {safetyData.weather.forecast}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Recent Incidents
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {safetyData.recentIncidents.map((incident, i) => (
                                <div
                                    key={i}
                                    className="border-l-4 border-amber-500 pl-4 py-2"
                                >
                                    <div className="font-medium">{incident.type}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {incident.location}
                                    </div>
                                    <div className="text-sm mt-1">
                                        {incident.description}normal
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="health" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="health">Health Advisories</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                    <TabsTrigger value="tips">Safety Tips</TabsTrigger>
                </TabsList>
                <TabsContent value="health" className="space-y-4 mt-6">
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Health Information</AlertTitle>
                        <AlertDescription>
                            Current health advisories for {safetyData.location}
                        </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                        {safetyData.healthAdvisories.map((advisory, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                                <p>{advisory}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="emergency" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-primary" />
                                    Emergency Numbers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Police:</span>
                                        <span className="font-bold">
                                            {safetyData.emergencyContacts.police}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ambulance:</span>
                                        <span className="font-bold">
                                            {safetyData.emergencyContacts.ambulance}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Fire Service:</span>
                                        <span className="font-bold">
                                            {safetyData.emergencyContacts.fireService}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Emergency Hotline:</span>
                                        <span className="font-bold">
                                            {safetyData.emergencyContacts.emergencyHotline}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Hospital className="h-5 w-5 text-primary" />
                                    Nearby Hospitals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {safetyData.nearbyHospitals.map((hospital, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center"
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {hospital.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {hospital.distance}
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Directions
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="tips" className="space-y-4 mt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Safety Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc pl-5">
                                    <li>Keep your valuables secure and out of sight</li>
                                    <li>
                                        Stay aware of your surroundings, especially in
                                        crowded areas
                                    </li>
                                    <li>Use reputable transportation services</li>
                                    <li>Keep digital copies of important documents</li>
                                    <li>Share your itinerary with someone you trust</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Location-Specific Advice</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 list-disc pl-5">
                                    <li>Be cautious of pickpockets in tourist areas</li>
                                    <li>Avoid demonstrations and political gatherings</li>
                                    <li>
                                        Use extra caution when visiting nightlife
                                        districts
                                    </li>
                                    <li>Be aware of common scams targeting tourists</li>
                                    <li>Consider purchasing travel insurance</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}