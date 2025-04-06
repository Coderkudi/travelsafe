"use client";
import type React from "react";
import { useEffect } from "react";
import Leaflet from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";
const { MapContainer } = ReactLeaflet;

interface DynamicMapProps {
    children: (ReactLeaflet: any, Leaflet: any) => React.ReactNode;
    className?: string;
    width?: number;
    height?: number;
    center: [number, number];
    zoom: number;
    whenCreated?: (mapInstance: any) => void;
}

const DynamicMap = ({ children, className, whenCreated, ...rest }: DynamicMapProps) => {
    let mapClassName = "w-full h-full";
    if (className) {
        mapClassName = `${mapClassName} ${className}`;
    }

    useEffect(() => {
        (async function init() {
            // @ts-ignore
            delete Leaflet.Icon.Default.prototype._getIconUrl;
            Leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                shadowUrl:
                    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            });
        })();
    }, []);

    return (
        <MapContainer
            className={mapClassName}
            {...rest}
            ref={
                whenCreated
                    ? (map) => {
                          if (map) whenCreated(map);
                      }
                    : undefined
            }
        >
            {children(ReactLeaflet, Leaflet)}
        </MapContainer>
    );
};

export default DynamicMap;
