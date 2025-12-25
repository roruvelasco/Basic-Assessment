import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Building2, MapPin, Globe, Compass, Clock, Mail, Building, LogOut } from 'lucide-react';
import { geolocationService, isValidIPAddress } from '../../services/geolocationService';
import { historyService, type HistoryEntry } from '../../services/historyService';
import { authService } from '../../services/authService';
import { showError, showSuccess, showInfo } from '../../components/notifications/NotificationService';
import LocationCard from '../../components/LocationCard';
import LocationMap from '../../components/LocationMap';
import HistoryList from '../../components/HistoryList';
import AnimatedBackground from '../../components/AnimatedBackground';
import type { IGeolocation } from '../../interfaces/IGeolocation';

interface HomeProps {
    onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ onLogout }) => {
    const [currentLocation, setCurrentLocation] = useState<IGeolocation | null>(null);
    const [displayedLocation, setDisplayedLocation] = useState<IGeolocation | null>(null);
    const [searchIP, setSearchIP] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isShowingSearchResult, setIsShowingSearchResult] = useState(false);
    const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
        fetchCurrentLocation();
        const user = authService.getCurrentUser();
        if (user?.email) {
            setUserEmail(user.email);
        }
    }, []);

    const fetchCurrentLocation = async () => {
        setIsLoading(true);
        try {
            const location = await geolocationService.getCurrentLocation();
            setCurrentLocation(location);
            setDisplayedLocation(location);
            setIsShowingSearchResult(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch location';
            showError('Location Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        const trimmedIP = searchIP.trim();

        if (!trimmedIP) {
            showError('Invalid Input', 'Please enter an IP address');
            return;
        }

        if (!isValidIPAddress(trimmedIP)) {
            showError('Invalid IP', 'Please enter a valid IPv4 address (e.g., 8.8.8.8)');
            return;
        }

        setIsSearching(true);
        try {
            const location = await geolocationService.getLocationByIP(trimmedIP);
            setDisplayedLocation(location);
            setIsShowingSearchResult(true);

            try {
                // save to history
                await historyService.addHistory({
                    ip: location.ip,
                    city: location.city,
                    region: location.region,
                    country: location.country,
                    loc: location.latitude && location.longitude 
                        ? `${location.latitude},${location.longitude}` 
                        : undefined,
                    org: location.org,
                    postal: location.postal,
                    timezone: location.timezone
                });
                setHistoryRefreshTrigger(prev => prev + 1);
                showSuccess('Search Complete', 'Location found');
            } catch {
                showInfo('Search Complete', 'Location found (history save failed)');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Search failed';
            showError('Search Failed', errorMessage);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setSearchIP('');
        setDisplayedLocation(currentLocation);
        setIsShowingSearchResult(false);
        showInfo('Cleared', 'Showing your current location');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSearching) {
            handleSearch();
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        showSuccess('Logged Out', 'Successfully logged out!');
        // small delay so user sees the notification
        setTimeout(() => {
            onLogout();
        }, 500);
    };

    // when user clicks a history item, show that location
    const handleSelectHistory = useCallback((entry: HistoryEntry) => {
        const location: IGeolocation = {
            ip: entry.ip,
            city: entry.city,
            region: entry.region,
            country: entry.country,
            latitude: entry.latitude,
            longitude: entry.longitude,
            org: entry.org,
            postal: entry.postal,
            timezone: entry.timezone,
        };
        setDisplayedLocation(location);
        setSearchIP(entry.ip);
        setIsShowingSearchResult(true);
        showInfo('History Loaded', `Showing location for ${entry.ip}`);
    }, []);

    const formatCoordinates = (location: IGeolocation): string => {
        if (location.latitude && location.longitude) {
            return `${location.latitude}, ${location.longitude}`;
        }
        return 'Unknown';
    };

    return (
        <div className="min-h-screen bg-slate-900 p-[clamp(1rem,4vw,1.5rem)] relative overflow-hidden">
            <AnimatedBackground />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* header - title and logout always on same row */}
                <div className="mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-[clamp(1.5rem,6vw,1.875rem)] font-semibold text-white">IP Geolocation</h1>
                            <p className="text-slate-400 mt-1 text-[clamp(0.75rem,3vw,1rem)]">Search and view IP location data</p>
                            {/* email shows below subtitle on mobile */}
                            {userEmail && (
                                <p className="text-slate-500 text-sm mt-1 sm:hidden">{userEmail}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {/* email shows beside logout on desktop */}
                            {userEmail && (
                                <span className="text-slate-400 text-sm hidden sm:block">{userEmail}</span>
                            )}
                            <span className="text-slate-600 hidden sm:block">|</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-red-500/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-all flex items-center gap-2 text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* search bar */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-[clamp(1rem,4vw,1.5rem)] mb-6 backdrop-blur-sm">
                    <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)]">
                        {/* clear button - left side, icon only on mobile */}
                        {isShowingSearchResult && (
                            <button
                                onClick={handleClear}
                                className="p-3 sm:px-4 sm:py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                                title="Clear"
                            >
                                <X className="w-5 h-5" />
                                <span className="hidden sm:inline">Clear</span>
                            </button>
                        )}
                        
                        {/* input - expands to fill space */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="e.g., 8.8.8.8"
                                value={searchIP}
                                onChange={(e) => setSearchIP(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isSearching}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                            />
                        </div>
                        
                        {/* search button - right side, icon only on mobile */}
                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !searchIP.trim()}
                            className="p-3 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                            title="Search"
                        >
                            {isSearching ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    <span className="hidden sm:inline">Search</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* location info */}
                {isLoading ? (
                    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-12 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-slate-400">Fetching your location...</p>
                        </div>
                    </div>
                ) : displayedLocation ? (
                    <>
                        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-[clamp(1rem,4vw,1.5rem)] mb-6 backdrop-blur-sm">

                            <div className="mb-6">
                                <p className="text-slate-400 text-sm mb-1">IP Address</p>
                                <p className="text-[clamp(1.25rem,5vw,2.25rem)] font-mono font-bold text-white break-all">{displayedLocation.ip}</p>
                            </div>

                            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[clamp(0.75rem,2vw,1rem)]">
                                <LocationCard icon={<Building2 className="w-5 h-5" />} label="City" value={displayedLocation.city} />
                                <LocationCard icon={<MapPin className="w-5 h-5" />} label="Region" value={displayedLocation.region} />
                                <LocationCard icon={<Globe className="w-5 h-5" />} label="Country" value={displayedLocation.country} />
                                <LocationCard icon={<Compass className="w-5 h-5" />} label="Coordinates" value={formatCoordinates(displayedLocation)} />
                                <LocationCard icon={<Clock className="w-5 h-5" />} label="Timezone" value={displayedLocation.timezone} />
                                <LocationCard icon={<Mail className="w-5 h-5" />} label="Postal Code" value={displayedLocation.postal} />
                            </div>
                            <div className="mt-[clamp(0.75rem,2vw,1rem)]">
                                <LocationCard icon={<Building className="w-5 h-5" />} label="Organization" value={displayedLocation.org} wrap />
                            </div>
                        </div>

                        {/* map */}
                        <LocationMap
                            latitude={displayedLocation.latitude}
                            longitude={displayedLocation.longitude}
                            city={displayedLocation.city}
                            country={displayedLocation.country}
                            ip={displayedLocation.ip}
                        />

                        {/* history */}
                        <HistoryList
                            refreshTrigger={historyRefreshTrigger}
                            onSelectHistory={handleSelectHistory}
                        />
                    </>
                ) : (
                    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-12 backdrop-blur-sm text-center">
                        <p className="text-slate-400">No location data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
