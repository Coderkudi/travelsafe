"use client";
import { useEffect, useRef, useState } from "react";
import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

import { useSelector } from "react-redux";
import { selectAllLandMarks, selectsafetyData } from "@/lib/userSlice";
import SearchBox from "@/components/ui/searchBox";
import { Landmark, SafetyDataType } from "@/types/SafetyData";

// Default coordinates for Paris, France
const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];

export default function SafetyMapPage() {
    const safetyDataFromRedux: SafetyDataType = useSelector(selectsafetyData);

    const [destination, setDestination] = useState(
        safetyDataFromRedux.location || "paris,france",
    );
    const [activeLayer, setActiveLayer] = useState("safety");
    const [mapCenter, setMapCenter] = useState<[number, number]>(
        safetyDataFromRedux.coordinates.lat !== 0 &&
            safetyDataFromRedux.coordinates.lon !== 0
            ? [safetyDataFromRedux.coordinates.lat, safetyDataFromRedux.coordinates.lon]
            : DEFAULT_CENTER,
    );
    const [zoom, setZoom] = useState(12);
    const mapRef = useRef<any>(null);
    const allLandMarks = useSelector(selectAllLandMarks);

    // Update landmarks when redux data changes
    useEffect(() => {
        if (allLandMarks && allLandMarks.length > 0) {
            setLandmarks(allLandMarks);
        }
    }, [allLandMarks]);

    // Default landmarks if none are provided from Redux
    const [landmarks, setLandmarks] = useState<Landmark[]>(
        allLandMarks && allLandMarks.length > 0
            ? allLandMarks
            : [
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
              ],
    );

    // Update map center when safety data changes
    useEffect(() => {
        if (
            safetyDataFromRedux.coordinates.lat !== 0 &&
            safetyDataFromRedux.coordinates.lon !== 0
        ) {
            setDestination(safetyDataFromRedux.location);
            setMapCenter([
                safetyDataFromRedux.coordinates.lat,
                safetyDataFromRedux.coordinates.lon,
            ]);
        }
    }, [safetyDataFromRedux]);

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

    // Get marker icon based on landmark type
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

    // Update map view when center or zoom changes
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(mapCenter, zoom);
        }
    }, [mapCenter, zoom]);

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

                <SearchBox />
                <div className="grid gap-6 lg:grid-cols-[1fr_300px] mt-6">
                    <Card className="overflow-hidden border-purple-900/50 bg-purple-950/30">
                        <div className="relative w-full h-[70vh]">
                            <Map
                                center={mapCenter}
                                zoom={zoom}
                                height={600}
                                whenCreated={(mapInstance: any) => {
                                    mapRef.current = mapInstance;
                                }}
                            >
                                {(ReactLeaflet: any, Leaflet: any) => {
                                    const { TileLayer, Marker, Popup } = ReactLeaflet;
                                    return (
                                        <>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
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
                                    );
                                }}
                            </Map>
                            {/* Map controls */}
                            <div className="absolute bottom-4 right-4 sm:flex flex-col gap-2 hidden">
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
                                                onClick={() => setActiveLayer("services")}
                                            >
                                                <Hospital className="h-4 w-4 mr-2" />
                                                Emergency Services
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
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
                        <div className="lg:flex flex-col gap-2 z-10 hidden md:flex">
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
                                <div className="space-y-2 max-h-[300px] overflow-y-auto overflow-x-hidden pr-1">
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
