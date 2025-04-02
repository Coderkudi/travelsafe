// import { useEffect } from 'react';
// import Leaflet from 'leaflet';
// import * as ReactLeaflet from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// import styles from './Map.module.scss';

// const { MapContainer } = ReactLeaflet;

// const Map = ({ children, className, width, height, ...rest }) => {
//   let mapClassName = styles.map;

//   if ( className ) {
//     mapClassName = `${mapClassName} ${className}`;
//   }

//   useEffect(() => {
//     (async function init() {
//       delete Leaflet.Icon.Default.prototype._getIconUrl;
//       Leaflet.Icon.Default.mergeOptions({
//         iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
//         iconUrl: 'leaflet/images/marker-icon.png',
//         shadowUrl: 'leaflet/images/marker-shadow.png',
//       });
//     })();
//   }, []);

//   return (
//     <MapContainer className={mapClassName} {...rest}>
//       {children(ReactLeaflet, Leaflet)}
//     </MapContainer>
//   )
// }

// export default Map;

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
}

const DynamicMap = ({ children, className, ...rest }: DynamicMapProps) => {
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
        <MapContainer className={mapClassName} {...rest}>
            {children(ReactLeaflet, Leaflet)}
        </MapContainer>
    );
};

export default DynamicMap;
