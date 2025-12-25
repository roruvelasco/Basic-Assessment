import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { ImLocation } from 'react-icons/im';
import { renderToString } from 'react-dom/server';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// use react-icons location pin
const createRedIcon = () => {
    const iconHtml = renderToString(
        <ImLocation size={36} color="#DC2626" />
    );
    
    return L.divIcon({
        className: 'custom-marker',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });
};

const redIcon = createRedIcon();

interface LocationMapProps {
    latitude: number | null;
    longitude: number | null;
    city: string;
    country: string;
    ip: string;
}

// helper to recenter map when coords change
const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    
    React.useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    
    return null;
};

const LocationMap: React.FC<LocationMapProps> = ({
    latitude,
    longitude,
    city,
    country,
    ip,
}) => {
    // can't show map without valid coords
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
                attributionControl={false} 
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapRecenter lat={latitude} lng={longitude} />
                
                <Marker position={[latitude, longitude]} icon={redIcon}>
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
