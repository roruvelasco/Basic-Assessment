import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Custom purple marker icon using SVG
 */
const createPurpleIcon = () => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" fill="#8B5CF6"/>
                <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" fill="url(#gradient)"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
                <defs>
                    <linearGradient id="gradient" x1="16" y1="0" x2="16" y2="42" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#A78BFA"/>
                        <stop offset="1" stop-color="#7C3AED"/>
                    </linearGradient>
                </defs>
            </svg>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
    });
};

const purpleIcon = createPurpleIcon();

/**
 * Location Map Props Interface
 */
interface LocationMapProps {
    latitude: number | null;
    longitude: number | null;
    city: string;
    country: string;
    ip: string;
}

/**
 * Component to recenter map when coordinates change
 */
const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    
    return null;
};

/**
 * Location Map Component
 * Displays an interactive Leaflet map with a purple marker at the specified coordinates
 */
const LocationMap: React.FC<LocationMapProps> = ({
    latitude,
    longitude,
    city,
    country,
    ip,
}) => {
    // Handle invalid coordinates
    if (latitude === null || longitude === null) {
        return (
            <div className="w-full h-[300px] md:h-[400px] bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center">
                <p className="text-slate-400">Unable to display map - Invalid coordinates</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl border border-slate-700">
            <MapContainer
                center={[latitude, longitude]}
                zoom={10}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ borderRadius: '12px' }}
            >
                {/* OpenStreetMap Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Recenter map when coordinates change */}
                <MapRecenter lat={latitude} lng={longitude} />
                
                {/* Location Marker with custom purple icon */}
                <Marker position={[latitude, longitude]} icon={purpleIcon}>
                    <Popup>
                        <div className="text-sm">
                            <p className="font-bold text-gray-900">{ip}</p>
                            <p className="text-gray-600">{city}, {country}</p>
                            <p className="text-gray-500 text-xs mt-1">
                                {latitude.toFixed(4)}, {longitude.toFixed(4)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LocationMap;
