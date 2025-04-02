// "use client";

// import { useEffect, useRef, useState } from "react";
// import { MapPin } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";

// interface MapWithLandmarkProps {
//     className?: string;
//     initialLocation?: [number, number];
//     zoom?: number;
//     landmarks?: Array<{
//         id: string;
//         name: string;
//         location: [number, number];
//         description?: string;
//     }>;
// }

// export default function MapWithLandmark({
//     className,
//     initialLocation = [51.505, -0.09], // London by default
//     zoom = 13,
//     landmarks = [
//         {
//             id: "landmark-1",
//             name: "London Eye",
//             location: [51.503, -0.119],
//             description:
//                 "A famous Ferris wheel on the South Bank of the River Thames in London.",
//         },
//         {
//             id: "landmark-2",
//             name: "Tower Bridge",
//             location: [51.5055, -0.075],
//             description:
//                 "A combined bascule and suspension bridge in London, built between 1886 and 1894.",
//         },
//     ],
// }: MapWithLandmarkProps) {
//     const mapRef = useRef<HTMLDivElement>(null);
//     const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);
//     const [mapLoaded, setMapLoaded] = useState(false);
//     const leafletMapRef = useRef<any>(null);

//     useEffect(() => {
//         // Dynamic import of Leaflet to avoid SSR issues
//         const loadMap = async () => {
//             if (
//                 typeof window !== "undefined" &&
//                 mapRef.current &&
//                 !leafletMapRef.current
//             ) {
//                 try {
//                     const L = (await import("leaflet")).default;

//                     // Import Leaflet CSS
//                     await import("leaflet/dist/leaflet.css");

//                     // Initialize map
//                     const map = L.map(mapRef.current).setView(initialLocation, zoom);
//                     leafletMapRef.current = map;

//                     // Add tile layer (OpenStreetMap)
//                     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//                         attribution:
//                             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//                     }).addTo(map);

//                     // Add landmarks
//                     landmarks.forEach((landmark) => {
//                         const marker = L.marker(landmark.location)
//                             .addTo(map)
//                             .bindPopup(
//                                 `<b>${landmark.name}</b>${
//                                     landmark.description
//                                         ? `<br>${landmark.description}`
//                                         : ""
//                                 }`,
//                             );

//                         marker.on("click", () => {
//                             setSelectedLandmark(landmark.id);
//                         });
//                     });

//                     setMapLoaded(true);
//                 } catch (error) {
//                     console.error("Error loading map:", error);
//                 }
//             }
//         };

//         loadMap();

//         // Cleanup function
//         return () => {
//             if (leafletMapRef.current) {
//                 leafletMapRef.current.remove();
//                 leafletMapRef.current = null;
//             }
//         };
//     }, [initialLocation, zoom, landmarks]);

//     // Function to center map on a landmark
//     const centerOnLandmark = (landmarkId: string) => {
//         const landmark = landmarks.find((l) => l.id === landmarkId);
//         if (landmark && leafletMapRef.current) {
//             leafletMapRef.current.setView(landmark.location, zoom + 2);
//             setSelectedLandmark(landmarkId);

//             // Open popup for the landmark
//             const markers = Object.values(leafletMapRef.current._layers).filter(
//                 (layer: any) =>
//                     layer._latlng &&
//                     layer._latlng.lat === landmark.location[0] &&
//                     layer._latlng.lng === landmark.location[1],
//             );

//             if (markers.length > 0) {
//                 markers[0].openPopup();
//             }
//         }
//     };

//     return (
//         <Card className={cn("overflow-hidden", className)}>
//             <CardHeader>
//                 <CardTitle>Interactive Map</CardTitle>
//                 <CardDescription>Explore landmarks on the map</CardDescription>
//             </CardHeader>
//             <CardContent className="p-0">
//                 <div className="relative">
//                     <div
//                         ref={mapRef}
//                         className="h-[400px] w-full z-10"
//                         aria-label="Map with landmarks"
//                         role="application"
//                     />
//                     {!mapLoaded && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
//                             <div className="text-muted-foreground">Loading map...</div>
//                         </div>
//                     )}
//                 </div>
//             </CardContent>
//             <CardFooter className="flex flex-wrap gap-2 p-4">
//                 {landmarks.map((landmark) => (
//                     <Button
//                         key={landmark.id}
//                         variant={selectedLandmark === landmark.id ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => centerOnLandmark(landmark.id)}
//                         className="flex items-center gap-1"
//                     >
//                         <MapPin className="h-3 w-3" />
//                         {landmark.name}
//                     </Button>
//                 ))}
//             </CardFooter>
//         </Card>
//     );
// }
