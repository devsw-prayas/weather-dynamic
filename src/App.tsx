import React, {useState, useEffect, useCallback} from 'react';
import Landing from './components/Landing';
import { WeatherData } from './types/weather';
import {fetchWeatherData} from "./backend/weatherBackend.tsx";
import {AnimatePresence, motion} from "framer-motion";

const baseWeatherData: WeatherData = {
    location: {
        city: "New York",
        country: "USA",
        timezone: "America/New_York",
        lat: 40.7128,
        lon: -74.0060,
    },
    current: {
        dt: Math.floor(new Date('2025-04-07T00:00:00-04:00').getTime() / 1000),
        temp: 48,
        feels_like: 45,
        precip: 0,
        wind_speed: 7,
        wind_deg: 290,
        wind_gust: 12,
        sunrise: Math.floor(new Date('2025-04-07T06:27:00-04:00').getTime() / 1000),
        sunset: Math.floor(new Date('2025-04-07T19:31:00-04:00').getTime() / 1000),
        humidity: 65,
        pressure: 1018,
        dew_point: 37,
        aqi: 30,
        uv_index: 0,
        weather: {
            main: "Clear",
            description: "Clear and crisp, with sass",
            icon: "01n",
            condition: "clear",
        },
    },
    hourly: Array.from({ length: 24 }, (_, i) => ({
        dt: Math.floor(new Date('2025-04-07T00:00:00-04:00').getTime() / 1000) + i * 3600,
        temp: 48 + Math.round((i < 14 ? i : 24 - i) * 1.2),
        precip: i >= 14 && i <= 17 ? 0.05 : 0,
        wind_speed: 7 + Math.round(Math.sin(i * Math.PI / 24) * 5),
        wind_deg: 290 + (i % 10),
        wind_gust: 12 + (i % 4),
        humidity: 65 - Math.round((i < 12 ? i : 24 - i) * 1.5),
        pressure: 1018 - Math.floor(i / 8),
        dew_point: 37 + Math.round((i < 14 ? i : 24 - i) * 0.8),
        pop: i >= 14 && i <= 17 ? 0.4 : 0,
        uv_index: Math.min(4.5, Math.max(0, 4.5 * Math.sin((i - 6) * Math.PI / 12))),
        weather: {
            main: i >= 14 && i <= 17 ? "Rain" : "Clear",
            description: i >= 14 && i <= 17 ? "Light spring shower" : "Clear with attitude",
            icon: i >= 14 && i <= 17 ? "10d" : i < 6 || i > 19 ? "01n" : "01d",
            condition: i >= 14 && i <= 17 ? "rainy" : "clear",
        },
    })),
    daily: Array.from({ length: 7 }, (_, i) => ({
        dt: Math.floor(new Date('2025-04-07T00:00:00-04:00').getTime() / 1000) + i * 86400,
        temp: { min: 44 + i * 2, max: 62 + i * 3 },
        precip: i === 0 ? 0.15 : i === 1 ? 0.05 : 0,
        wind_speed_max: 10 + i,
        wind_gust_max: 15 + i * 2,
        sunrise: Math.floor(new Date('2025-04-07T06:27:00-04:00').getTime() / 1000) - i * 62,
        sunset: Math.floor(new Date('2025-04-07T19:31:00-04:00').getTime() / 1000) + i * 64,
        humidity_min: 55 + (i % 5),
        humidity_max: 70 + (i % 5),
        pressure: 1018 - i * 0.5,
        moon_phase: ["Waxing Gibbous", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Waning Gibbous", "Last Quarter", "Waning Crescent"][i],
        summary: i === 0 ? "Mild with afternoon showers" : i === 1 ? "Clearing up" : "Sunny and smug",
        uv_index: 4.5 + Math.min(i * 0.5, 1.5),
        weather: {
            main: i === 0 ? "Rain" : "Clear",
            description: i === 0 ? "Wet then dry" : "Sunny with sass",
            icon: i === 0 ? "10d" : "01d",
            condition: i === 0 ? "rainy" : "clear",
        },
    })),
    alerts: [
        {
            title: "Afternoon Showers Possible",
            description: "Bring an umbrella or just get wet—your call!",
        },
    ],
    pollen: "Moderate",
    last_updated: Math.floor(new Date('2025-04-07T00:00:00-04:00').getTime() / 1000),
};

const App: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isTestMode, setIsTestMode] = useState(false);
    const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [coords, setCoords] = useState({ lat: 40.7128, lon: -74.0060 });
    const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false);
    const [tempLocation, setTempLocation] = useState(coords);
    const [minuteOffset, setMinuteOffset] = useState(0);
    const [weatherCondition, setWeatherCondition] = useState<WeatherData["current"]["weather"]["condition"]>("clear");
    const [isAutoMode, setIsAutoMode] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const conditions: WeatherData["current"]["weather"]["condition"][] = [
        "thunderstorm", "clear", "cloudy", "rainy", "snowy", "foggy", "partly-cloudy"
    ];

    const searchLocations = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
                {
                    headers: {
                        'User-Agent': 'YourWeatherApp/1.0 (your@email.com)' // Required
                    }
                }
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const fetchRealData = useCallback(async (lat: number, lon: number) => {
        setIsLoading(true);
        try {
            const data = await fetchWeatherData(lat, lon);
            setWeatherData({
                ...data,
                location: {
                    ...data.location,
                    lat, // Force the new lat
                    lon, // Force the new lon
                    city: searchQuery || data.location.city, // Use search query if available
                },
            });
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to fetch weather data. Guess the clouds are on vacation.');
            setIsTestMode(true); // Fallback to test mode, because why not?
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]); // Dependency on searchQuery for city name

    // Generate test weather data
    const generateTestData = useCallback(() => {
        const offsetSeconds = minuteOffset * 60;
        return {
            ...baseWeatherData,
            location: {
                ...baseWeatherData.location,
                lat: coords.lat,
                lon: coords.lon
            },
            current: {
                ...baseWeatherData.current,
                dt: baseWeatherData.current.dt + offsetSeconds,
                weather: {
                    ...baseWeatherData.current.weather,
                    condition: weatherCondition,
                    icon: getWeatherIcon(
                        weatherCondition,
                        baseWeatherData.current.dt + offsetSeconds,
                        baseWeatherData.current.sunrise,
                        baseWeatherData.current.sunset
                    )
                }
            },
            hourly: baseWeatherData.hourly.map(hour => ({
                ...hour,
                dt: hour.dt + offsetSeconds,
                weather: {
                    ...hour.weather,
                    condition: weatherCondition,
                    icon: getWeatherIcon(
                        weatherCondition,
                        hour.dt + offsetSeconds,
                        baseWeatherData.current.sunrise,
                        baseWeatherData.current.sunset
                    )
                }
            })),
            daily: baseWeatherData.daily.map(day => ({
                ...day,
                dt: day.dt + offsetSeconds,
                weather: {
                    ...day.weather,
                    condition: weatherCondition,
                    icon: getWeatherIcon(
                        weatherCondition,
                        day.dt + offsetSeconds,
                        day.sunrise,
                        day.sunset
                    )
                }
            }))
        };
    }, [minuteOffset, weatherCondition, coords.lat, coords.lon]);

    const handleLocationSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const newCoords = {
                lat: tempLocation.lat,
                lon: tempLocation.lon,
            };
            setCoords(newCoords);

            if (!isTestMode) {
                await fetchRealData(newCoords.lat, newCoords.lon);
            } else {
                const testData = generateTestData();
                setWeatherData({
                    ...testData,
                    location: {
                        ...testData.location,
                        lat: newCoords.lat,
                        lon: newCoords.lon,
                        city: searchQuery || testData.location.city,
                    },
                    hourly: [...testData.hourly], // Fresh array
                    daily: [...testData.daily],   // Fresh array
                });
            }

            setSearchQuery('');
            setSearchResults([]);
        } catch (err) {
            setError('Location update failed. Charts are laughing at us now.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsLocationPanelOpen(false);
        }
    }, [tempLocation, isTestMode, fetchRealData, generateTestData, searchQuery]);

    const getWeatherIcon = (
        condition: WeatherData["current"]["weather"]["condition"],
        dt: number,
        sunrise: number,
        sunset: number
    ): string => {
        const isDay = dt > sunrise && dt < sunset;

        const iconMap: Record<typeof condition, { day: string; night: string }> = {
            "thunderstorm": { day: "11d", night: "11n" },
            "clear": { day: "01d", night: "01n" },
            "cloudy": { day: "03d", night: "03n" },
            "rainy": { day: "10d", night: "10n" },
            "snowy": { day: "13d", night: "13n" },
            "foggy": { day: "50d", night: "50n" },
            "partly-cloudy": { day: "02d", night: "02n" }
        };

        return isDay ? iconMap[condition].day : iconMap[condition].night;
    };

    useEffect(() => {
        if (!coords) return;

        const updateData = async () => {
            try {
                if (isTestMode) {
                    const testData = generateTestData();
                    setWeatherData(() => {
                        const newData = {
                            ...testData,
                            location: {
                                ...testData.location,
                                lat: coords.lat,
                                lon: coords.lon,
                                city: searchQuery || testData.location.city,
                            },
                            hourly: [...testData.hourly], // Fresh array
                            daily: [...testData.daily],   // Fresh array
                        };
                        console.log('Test mode updated:', newData);
                        return newData;
                    });
                } else {
                    await fetchRealData(coords.lat, coords.lon);
                }
            } catch (err) {
                setError('Weather update failed. Graphs are sulking again.');
                console.error(err);
            }
        };

        updateData();
    }, [coords, isTestMode, generateTestData, fetchRealData, searchQuery]);

    // Update test data when parameters change
    useEffect(() => {
        if (isTestMode) {
            setWeatherData(generateTestData());
        }
    }, [isTestMode, generateTestData, coords]);

    // Auto mode effect
    useEffect(() => {
        if (!isAutoMode || !isTestMode) return;

        const interval = setInterval(() => {
            setMinuteOffset(prev => {
                const newOffset = prev + 10;
                if (newOffset > 720) {
                    setWeatherCondition(prevCond => {
                        const nextIndex = (conditions.indexOf(prevCond) + 1 % 7);
                        return conditions[nextIndex];
                    });
                    return -720;
                }
                return newOffset;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isAutoMode, isTestMode]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                setIsTestPanelOpen(prev => !prev); // Only toggle panel visibility
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Location panel handlers
    const openLocationPanel = useCallback(() => {
        setTempLocation(coords);
        setIsLocationPanelOpen(true);
    }, [coords]);

    return (
        <div className="App relative min-h-screen bg-gray-900 text-white">
            {/* Loading State */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-xl"
                        >
                            Loading weather data...
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error State */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded z-50"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            {weatherData && (
                <Landing
                    weatherData={weatherData}
                    onOpenLocationPanel={openLocationPanel}
                />
            )}

            {isLocationPanelOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="glass rounded-xl bg-gray-800/90 w-full max-w-md p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Search Location</h2>
                            <button
                                onClick={() => {
                                    setIsLocationPanelOpen(false);
                                    setSearchResults([]);
                                    setSearchQuery('');
                                }}
                                className="text-2xl hover:text-red-500"
                            >
                                ×
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search city or address..."
                                className="w-full glass p-3 rounded-xl bg-white/10 backdrop-blur-sm"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    searchLocations(e.target.value);
                                }}
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <div
                                        key={result.place_id}
                                        className="glass p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                                        onClick={() => {
                                            const newLat = parseFloat(result.lat);
                                            const newLon = parseFloat(result.lon);
                                            setTempLocation({lat: newLat, lon: newLon}); // Set tempLocation correctly
                                            setSearchQuery(result.display_name); // Update search query for city name
                                            setSearchResults([]); // Clear results after selection
                                        }}
                                    >
                                        <p className="font-medium">{result.display_name}</p>
                                        {result.address?.city && (
                                            <p className="text-sm opacity-80">{result.address.city}, {result.address.country}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={() => setIsLocationPanelOpen(false)}
                                className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLocationSubmit}
                                className="flex-1 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Test Controls Panel */}
            <AnimatePresence>
                {isTestPanelOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="glass p-6 rounded-xl bg-gray-800/90 w-full max-w-md"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Developer Controls</h2>
                                <button
                                    onClick={() => {
                                        setIsTestPanelOpen(false);
                                        if (isAutoMode) setIsAutoMode(false);
                                    }}
                                    className="text-2xl hover:text-yellow-400"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Data Mode Toggle - Moved INSIDE the panel */}
                                <div>
                                    <h3 className="font-semibold mb-2">Data Mode</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsTestMode(false)}
                                            className={`flex-1 p-2 rounded-lg ${!isTestMode ? 'bg-blue-500' : 'bg-gray-700'}`}
                                        >
                                            Live Data
                                        </button>
                                        <button
                                            onClick={() => setIsTestMode(true)}
                                            className={`flex-1 p-2 rounded-lg ${isTestMode ? 'bg-yellow-500' : 'bg-gray-700'}`}
                                        >
                                            Test Data
                                        </button>
                                    </div>
                                </div>

                                {/* Rest of your test controls... */}
                                {isTestMode && (
                                    <>
                                        <div>
                                            <h3 className="font-semibold mb-2">Time Offset</h3>
                                            <input
                                                type="range"
                                                min="-720"
                                                max="720"
                                                value={minuteOffset}
                                                onChange={(e) => setMinuteOffset(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-2">Weather Condition</h3>
                                            <select
                                                value={weatherCondition}
                                                onChange={(e) => setWeatherCondition(e.target.value as typeof weatherCondition)}
                                                className="w-full p-2 rounded-lg bg-gray-700"
                                            >
                                                {conditions.map(cond => (
                                                    <option key={cond} value={cond}>
                                                        {cond.replace("-", " ")}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <button
                                                onClick={() => setIsAutoMode(!isAutoMode)}
                                                className={`w-full p-2 rounded-lg ${isAutoMode ? 'bg-red-500' : 'bg-green-500'}`}
                                            >
                                                {isAutoMode ? 'Stop Auto Cycle' : 'Start Auto Cycle'}
                                            </button>
                                        </div>
                                    </>
                                )}

                                <div className="text-sm opacity-80 border-t border-gray-700 pt-3">
                                    <p>Press <kbd>Tab</kbd> to close this panel</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;