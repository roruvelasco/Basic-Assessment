import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Custom purple marker icon using Lucide MapPin
 * Uses the MapPin icon path from lucide-react rendered as SVG for Leaflet
 */
const createPurpleIcon = () => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#8B5CF6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3" fill="white" stroke="#8B5CF6" stroke-width="1.5"/>
            </svg>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
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
