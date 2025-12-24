import React, { useState, useEffect, useCallback } from 'react';
import { geolocationService, isValidIPAddress } from '../../services/geolocationService';
import { historyService, type HistoryEntry } from '../../services/historyService';
import { authService } from '../../services/authService';
import { showError, showSuccess, showInfo } from '../../components/notifications/NotificationService';
import LocationCard from '../../components/LocationCard';
import LocationMap from '../../components/LocationMap';
import HistoryList from '../../components/HistoryList';
import type { IGeolocation } from '../../interfaces/IGeolocation';

/**
 * Home Props
 */
interface HomeProps {
    onLogout: () => void;
}

/**
 * Home Screen Component
 */
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
        // Get user email from session
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
                // Save to history with IPinfo format
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
                // Trigger history list refresh
                setHistoryRefreshTrigger(prev => prev + 1);
                showSuccess('Search Complete', `Found location for ${trimmedIP}`);
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
        onLogout();
    };

    // Handle clicking a history item to re-display that location
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
        <div className="min-h-screen bg-slate-900 p-6 relative overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-30 -top-48 -right-24" />
                <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[100px] opacity-30 -bottom-36 -left-24" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-white">IP Geolocation</h1>
                        <p className="text-slate-400 mt-1">Search and view IP location data</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {userEmail && (
                            <span className="text-slate-400 text-sm hidden sm:block">{userEmail}</span>
                        )}
                        <span className="text-slate-600 hidden sm:block">|</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Enter IP address (e.g., 8.8.8.8)"
                                value={searchIP}
                                onChange={(e) => setSearchIP(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isSearching}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSearch}
                                disabled={isSearching || !searchIP.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                            >
                                {isSearching ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Search
                                    </>
                                )}
                            </button>
                            {isShowingSearchResult && (
                                <button
                                    onClick={handleClear}
                                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location Display */}
                {isLoading ? (
                    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-12 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-slate-400">Fetching your location...</p>
                        </div>
                    </div>
                ) : displayedLocation ? (
                    <>
                        {/* Location Info Card */}
                        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 mb-6 backdrop-blur-sm">

                            {/* IP Address Header */}
                            <div className="mb-6">
                                <p className="text-slate-400 text-sm mb-1">IP Address</p>
                                <p className="text-4xl font-mono font-bold text-white">{displayedLocation.ip}</p>
                            </div>

                            {/* Location Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <LocationCard icon="🏙️" label="City" value={displayedLocation.city} />
                                <LocationCard icon="📍" label="Region" value={displayedLocation.region} />
                                <LocationCard icon="🌍" label="Country" value={displayedLocation.country} />
                                <LocationCard icon="🧭" label="Coordinates" value={formatCoordinates(displayedLocation)} />
                                <LocationCard icon="🕐" label="Timezone" value={displayedLocation.timezone} />
                                <LocationCard icon="📮" label="Postal Code" value={displayedLocation.postal} />
                                <LocationCard icon="🏢" label="Organization" value={displayedLocation.org} className="sm:col-span-2 lg:col-span-3" />
                            </div>
                        </div>

                        {/* Interactive Map */}
                        <LocationMap
                            latitude={displayedLocation.latitude}
                            longitude={displayedLocation.longitude}
                            city={displayedLocation.city}
                            country={displayedLocation.country}
                            ip={displayedLocation.ip}
                        />

                        {/* Search History */}
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
