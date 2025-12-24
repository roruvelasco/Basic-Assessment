import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { geolocationService, isValidIPAddress } from '../../services/geolocationService';
import { historyService } from '../../services/historyService';
import { showError, showSuccess, showInfo } from '../../components/notifications/NotificationService';
import LocationCard from '../../components/LocationCard';
import type { IGeolocation } from '../../interfaces/IGeolocation';

/**
 * Home Screen Component
 * Displays IP geolocation data with search functionality
 */
const Home: React.FC = () => {
    const navigate = useNavigate();
    const [currentLocation, setCurrentLocation] = useState<IGeolocation | null>(null);
    const [displayedLocation, setDisplayedLocation] = useState<IGeolocation | null>(null);
    const [searchIP, setSearchIP] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [isShowingSearchResult, setIsShowingSearchResult] = useState(false);

    useEffect(() => {
        fetchCurrentLocation();
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
                await historyService.addHistory(trimmedIP, location);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

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
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                        Logout
                    </button>
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
                    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                isShowingSearchResult 
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                                {isShowingSearchResult ? 'Search Result' : 'Your Location'}
                            </span>
                        </div>

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
