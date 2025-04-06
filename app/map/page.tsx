"use client";
import { useState } from "react";
import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Layers, AlertTriangle, Hospital, Shield } from "lucide-react";
import dynamic from "next/dynamic";

// Import the Map component with dynamic import to avoid SSR issues with Leaflet
const Map = dynamic(() => import("../../components/Map"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    ),
});
import { toast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { selectLocationState } from "@/lib/userSlice";

// Default coordinates for Paris, France
const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];

interface Landmark {
    id: string;
    name: string;
    location: [number, number];
    type: "safety" | "hospital" | "incident";
    description?: string;
}

export default function SafetyMapPage() {
    const locationInformationFromRedux = useSelector(selectLocationState);
    const [destination, setDestination] = useState(
        locationInformationFromRedux.location.name || "paris,france",
    );
    const [activeLayer, setActiveLayer] = useState("safety");
    const [mapCenter, setMapCenter] = useState<[number, number]>(
        locationInformationFromRedux.location.lat !== 0 &&
            locationInformationFromRedux.location.lon !== 0
            ? [
                  locationInformationFromRedux.location.lat,
                  locationInformationFromRedux.location.lon,
              ]
            : DEFAULT_CENTER,
    );
    const [zoom, setZoom] = useState(12);
    const [landmarks, setLandmarks] = useState<Landmark[]>([
        {
            id: "landmark-1",
            name: "Tourist Area - Exercise Caution",
            location: [48.8584, 2.2945], // Eiffel Tower area
            type: "safety",
            description: "Pickpocketing reported in this tourist area",
        },
        {
            id: "landmark-2",
            name: "Hôpital Hôtel-Dieu",
            location: [48.8539, 2.3485], // Near Notre Dame
            type: "hospital",
            description: "Emergency medical services available 24/7",
        },
        {
            id: "landmark-3",
            name: "Recent Protest",
            location: [48.8738, 2.295], // Arc de Triomphe
            type: "incident",
            description: "Scheduled demonstration on Saturday",
        },
    ]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // In a real app, this would use a geocoding service
            // For demo purposes, we'll use some predefined locations
            if (destination.toLowerCase().includes("paris")) {
                setMapCenter([48.8566, 2.3522]);
                // Update landmarks for Paris
                setLandmarks([
                    {
                        id: "paris-1",
                        name: "Tourist Area - Exercise Caution",
                        location: [48.8584, 2.2945], // Eiffel Tower area
                        type: "safety",
                        description: "Pickpocketing reported in this tourist area",
                    },
                    {
                        id: "paris-2",
                        name: "Hôpital Hôtel-Dieu",
                        location: [48.8539, 2.3485], // Near Notre Dame
                        type: "hospital",
                        description: "Emergency medical services available 24/7",
                    },
                    {
                        id: "paris-3",
                        name: "Recent Protest",
                        location: [48.8738, 2.295], // Arc de Triomphe
                        type: "incident",
                        description: "Scheduled demonstration on Saturday",
                    },
                ]);
            } else if (destination.toLowerCase().includes("london")) {
                setMapCenter([51.5074, -0.1278]);
                // Update landmarks for London
                setLandmarks([
                    {
                        id: "london-1",
                        name: "Tourist Area - Exercise Caution",
                        location: [51.5081, -0.0759], // Tower of London
                        type: "safety",
                        description: "Crowded area, be aware of your surroundings",
                    },
                    {
                        id: "london-2",
                        name: "St Thomas' Hospital",
                        location: [51.4987, -0.1175], // Near London Eye
                        type: "hospital",
                        description: "Major trauma center and emergency services",
                    },
                    {
                        id: "london-3",
                        name: "Planned Strike",
                        location: [51.5074, -0.1278], // Central London
                        type: "incident",
                        description: "Transport workers strike planned for Friday",
                    },
                ]);
            } else if (destination.toLowerCase().includes("new york")) {
                setMapCenter([40.7128, -74.006]);
                // Update landmarks for New York
                setLandmarks([
                    {
                        id: "nyc-1",
                        name: "High Alert Area",
                        location: [40.758, -73.9855], // Times Square
                        type: "safety",
                        description: "Crowded tourist area, stay vigilant",
                    },
                    {
                        id: "nyc-2",
                        name: "NYU Langone Medical Center",
                        location: [40.7421, -73.974], // East side
                        type: "hospital",
                        description: "Full emergency services available",
                    },
                    {
                        id: "nyc-3",
                        name: "Construction Zone",
                        location: [40.7112, -74.0134], // Financial District
                        type: "incident",
                        description: "Major construction causing traffic disruptions",
                    },
                ]);
            } else {
                toast({
                    title: "Location not found",
                    description:
                        "Try searching for Paris, London, or New York for this demo",
                    variant: "destructive",
                });
            }

            setZoom(12); // Reset zoom level for new location
        } catch (error) {
            toast({
                title: "Error finding location",
                description: "Please try a different location or check your spelling",
                variant: "destructive",
            });
        }
    };

    // Filter landmarks based on active layer
    const getVisibleLandmarks = () => {
        if (activeLayer === "all") return landmarks;
        if (activeLayer === "safety") return landmarks.filter((l) => l.type === "safety");
        if (activeLayer === "incidents")
            return landmarks.filter((l) => l.type === "incident");
        if (activeLayer === "services")
            return landmarks.filter((l) => l.type === "hospital");
        return landmarks;
    };

    const getMarkerIcon = (type: string, Leaflet: any) => {
        const iconSize = [25, 41];
        const iconAnchor = [12, 41];
        const popupAnchor = [1, -34];

        let iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";

        // Custom icon colors based on type
        if (type === "safety") {
            iconUrl =
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
        } else if (type === "hospital") {
            iconUrl =
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";
        } else if (type === "incident") {
            iconUrl =
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png";
        }

        return new Leaflet.Icon({
            iconUrl,
            iconSize,
            iconAnchor,
            popupAnchor,
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        });
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#1a0d2c] to-[#0f051a]">
            <div className="container mx-auto px-4 py-8 ">
                {/* nav */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Safety Map</h1>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Shield className="h-4 w-4 text-purple-400" />
                            Download Offline Map
                        </Button>
                    </div>
                </div>
                {/* search bar */}
                <form onSubmit={handleSearch} className="flex gap-2 mt-10">
                    <div className="flex-1">
                        <Label htmlFor="map-destination" className="sr-only">
                            Destination
                        </Label>
                        <Input
                            id="map-destination"
                            placeholder="Search location (try Paris, London, or New York)"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button type="submit">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </form>

                <div className="grid gap-6 lg:grid-cols-[1fr_300px] mt-6">
                    <Card className="overflow-hidden border-purple-900/50 bg-purple-950/30">
                        <div className="relative w-full h-[70vh]">
                            {/* map loading */}
                            <>
                                <Map
                                    className="w-full h-full"
                                    width={800}
                                    height={600}
                                    center={mapCenter}
                                    zoom={zoom}
                                >
                                    {(
                                        { TileLayer, Marker, Popup, LayerGroup }: any,
                                        Leaflet: any,
                                    ) => (
                                        <>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                            {getVisibleLandmarks().map((landmark) => (
                                                <Marker
                                                    key={landmark.id}
                                                    position={landmark.location}
                                                    icon={getMarkerIcon(
                                                        landmark.type,
                                                        Leaflet,
                                                    )}
                                                >
                                                    <Popup>
                                                        <div>
                                                            <h3 className="font-bold">
                                                                {landmark.name}
                                                            </h3>
                                                            <p>{landmark.description}</p>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            ))}
                                        </>
                                    )}
                                </Map>
                                {/* Map controls */}
                                <div className="absolute bottom-4 right-4 sm:flex flex-col gap-2  hidden ">
                                    <Card className="w-auto border-purple-900/50 bg-purple-950/60 backdrop-blur">
                                        <CardContent className="p-2">
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    variant={
                                                        activeLayer === "all"
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    className="justify-start"
                                                    onClick={() => setActiveLayer("all")}
                                                >
                                                    <Layers className="h-4 w-4 mr-2" />
                                                    All Layers
                                                </Button>
                                                <Button
                                                    variant={
                                                        activeLayer === "safety"
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    className="justify-start"
                                                    onClick={() =>
                                                        setActiveLayer("safety")
                                                    }
                                                >
                                                    <Shield className="h-4 w-4 mr-2" />
                                                    Safety Alerts
                                                </Button>
                                                <Button
                                                    variant={
                                                        activeLayer === "incidents"
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    className="justify-start"
                                                    onClick={() =>
                                                        setActiveLayer("incidents")
                                                    }
                                                >
                                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                                    Recent Incidents
                                                </Button>
                                                <Button
                                                    variant={
                                                        activeLayer === "services"
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    className="justify-start"
                                                    onClick={() =>
                                                        setActiveLayer("services")
                                                    }
                                                >
                                                    <Hospital className="h-4 w-4 mr-2" />
                                                    Emergency Services
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <Card className="border-purple-900/50 bg-purple-950/30">
                            <CardContent className="p-4">
                                <h3 className="text-lg font-medium mb-2">Map Legend</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                        <span>Safety Alert Areas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                        <span>Recent Incidents</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                        <span>Hospitals & Medical Facilities</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className=" lg:flex flex-col gap-2 z-10 hidden md:flex ">
                            <Card className="w-auto border-purple-900/50 bg-purple-950/60 backdrop-blur">
                                <CardContent className="p-2">
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant={
                                                activeLayer === "all"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setActiveLayer("all")}
                                        >
                                            <Layers className="h-4 w-4 mr-2" />
                                            All Layers
                                        </Button>
                                        <Button
                                            variant={
                                                activeLayer === "safety"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setActiveLayer("safety")}
                                        >
                                            <Shield className="h-4 w-4 mr-2" />
                                            Safety Alerts
                                        </Button>
                                        <Button
                                            variant={
                                                activeLayer === "incidents"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setActiveLayer("incidents")}
                                        >
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Recent Incidents
                                        </Button>
                                        <Button
                                            variant={
                                                activeLayer === "services"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            className="justify-start"
                                            onClick={() => setActiveLayer("services")}
                                        >
                                            <Hospital className="h-4 w-4 mr-2" />
                                            Emergency Services
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-purple-900/50 bg-purple-950/30">
                            <CardContent className="p-4">
                                <h3 className="text-lg font-medium mb-2">
                                    Safety Information
                                </h3>
                                <p className="text-sm text-purple-200 mb-3">
                                    Current safety information for {destination}
                                </p>
                                <div className="space-y-2">
                                    {landmarks.map((landmark) => (
                                        <div
                                            key={landmark.id}
                                            className="p-2 border border-purple-800 rounded-md"
                                        >
                                            <div className="flex items-center gap-2">
                                                {landmark.type === "safety" && (
                                                    <Shield className="h-4 w-4 text-red-400" />
                                                )}
                                                {landmark.type === "hospital" && (
                                                    <Hospital className="h-4 w-4 text-blue-400" />
                                                )}
                                                {landmark.type === "incident" && (
                                                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                                                )}
                                                <span className="font-medium">
                                                    {landmark.name}
                                                </span>
                                            </div>
                                            <p className="text-xs text-purple-300 mt-1">
                                                {landmark.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
