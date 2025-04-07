import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import { WeatherData } from './types/weather';

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
    const [minuteOffset, setMinuteOffset] = useState(0);
    const [weatherCondition, setWeatherCondition] = useState<WeatherData["current"]["weather"]["condition"]>("clear");
    const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
    const [isAutoMode, setIsAutoMode] = useState(false);

    const conditions: WeatherData["current"]["weather"]["condition"][] = [
        "thunderstorm",
        "clear",
        "cloudy",
        "rainy",
        "snowy",
        "foggy",
        "partly-cloudy",
    ];

    useEffect(() => {
        if (!isAutoMode || !isTestPanelOpen) return;

        let intervalId: number;
        let conditionIndex = 0;
        let timeProgress = -720;

        const runAutoLoop = () => {
            intervalId = window.setInterval(() => {
                setMinuteOffset(Math.round(timeProgress));
                timeProgress += 10;
                if (timeProgress > 720) {
                    timeProgress = -720;
                    conditionIndex = (conditionIndex + 1) % conditions.length;
                    setWeatherCondition(conditions[conditionIndex]);
                }
            }, 100);
        };

        runAutoLoop();
        return () => clearInterval(intervalId);
    }, [isAutoMode, isTestPanelOpen]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                setIsTestPanelOpen((prev) => !prev);
                if (isAutoMode) setIsAutoMode(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isAutoMode]);

    const offsetSeconds = minuteOffset * 60;

    const dynamicWeatherData: WeatherData = {
        ...baseWeatherData,
        current: {
            ...baseWeatherData.current,
            dt: baseWeatherData.current.dt + offsetSeconds,
            temp: 48 + Math.round(((minuteOffset / 60) < 14 ? (minuteOffset / 60) : 24 - (minuteOffset / 60)) * 1.2),
            uv_index: Math.min(4.5, Math.max(0, 4.5 * Math.sin(((minuteOffset / 60) - 6) * Math.PI / 12))),
            precip: (minuteOffset / 60) >= 14 && (minuteOffset / 60) <= 17 ? 0.05 : 0,
            weather: {
                ...baseWeatherData.current.weather,
                condition: weatherCondition,
                main: weatherCondition === "thunderstorm" ? "Thunderstorm" : weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1),
                description: `${weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1)} with a side of sass`,
                icon: {
                    thunderstorm: minuteOffset < 387 || minuteOffset > 1171 ? "11n" : "11d",
                    clear: minuteOffset < 387 || minuteOffset > 1171 ? "01n" : "01d",
                    cloudy: minuteOffset < 387 || minuteOffset > 1171 ? "03n" : "03d",
                    rainy: minuteOffset < 387 || minuteOffset > 1171 ? "10n" : "10d",
                    snowy: minuteOffset < 387 || minuteOffset > 1171 ? "13n" : "13d",
                    foggy: minuteOffset < 387 || minuteOffset > 1171 ? "50n" : "50d",
                    "partly-cloudy": minuteOffset < 387 || minuteOffset > 1171 ? "02n" : "02d",
                }[weatherCondition],
            },
        },
        hourly: baseWeatherData.hourly.map((hour) => {
            const hourOffset = hour.dt + offsetSeconds;
            return {
                ...hour,
                dt: hourOffset,
                weather: {
                    ...hour.weather,
                    condition: weatherCondition,
                    main: weatherCondition === "thunderstorm" ? "Thunderstorm" : weatherCondition.charAt(0).toUpperCase() + weatherCondition.slice(1),
                    description: hourOffset < baseWeatherData.current.sunset ? `${weatherCondition} vibes` : `${weatherCondition} night`,
                    icon: {
                        thunderstorm: hourOffset < baseWeatherData.current.sunrise || hourOffset > baseWeatherData.current.sunset ? "11n" : "11d",
                        clear: hourOffset < baseWeatherData.current.sunrise || hourOffset > baseWeatherData.current.sunset ? "01n" : "01d",
                        cloudy: hourOffset < baseWeatherData.current.sunrise || hourOffset > baseWeatherData.current.sunset ? "03n" : "03d",
                        rainy: hourOffset < baseWeatherData.current.sunrise || hourOffset > baseWeatherData.current.sunset ? "10n" : "10d",
                        snowy: hourOffset < baseWeatherData.current.sunrise || hourOffset > baseWeatherData.current.sunset ? "13n" : "13d",
                        foggy: hourOffset < baseWeatherData.current.sunrise || hourOffset > baseWeatherData.current.sunset ? "50n" : "50d",
                        "partly-cloudy": hourOffset < baseWeatherData.current.sunrise || hourOffset > baseWeatherData.current.sunset ? "02n" : "02d",
                    }[weatherCondition],
                },
            };
        }),
        daily: baseWeatherData.daily.map((day) => ({
            ...day,
            dt: day.dt + offsetSeconds,
        })),
    };

    const formatOffset = (minutes: number) => {
        const hours = Math.floor(Math.abs(minutes) / 60);
        const mins = Math.abs(minutes) % 60;
        const sign = minutes >= 0 ? "+" : "-";
        return `${sign}${hours}h ${mins}m`;
    };

    return (
        <div className="App relative min-h-screen bg-gray-900 text-white">
            <Landing weatherData={dynamicWeatherData} />
            {isTestPanelOpen && (
                <div className="fixed top-4 left-4 right-400 z-50 p-6 glass rounded-xl bg-gray-800/80 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-yellow-400">Weather Test Party (Press Tab to Close)</h2>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-bold">
                                Time Offset: {formatOffset(minuteOffset)}
                            </label>
                            <input
                                type="range"
                                min={-720}
                                max={720}
                                step={1}
                                value={minuteOffset}
                                onChange={(e) => setMinuteOffset(parseInt(e.target.value))}
                                disabled={isAutoMode}
                                className="custom-slider w-full"
                            />
                            <p className="text-xs opacity-80">
                                Simulated Time: {new Date((baseWeatherData.current.dt + offsetSeconds) * 1000).toLocaleTimeString('en-US', {
                                timeZone: 'America/New_York',
                            })}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Weather Condition:</label>
                            <select
                                value={weatherCondition}
                                onChange={(e) =>
                                    setWeatherCondition(e.target.value as WeatherData["current"]["weather"]["condition"])
                                }
                                disabled={isAutoMode}
                                className="w-full p-2 bg-gray-700 rounded-lg text-white"
                            >
                                {conditions.map((cond) => (
                                    <option key={cond} value={cond}>
                                        {cond.replace("-", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold">Auto Mode:</label>
                            <button
                                onClick={() => setIsAutoMode((prev) => !prev)}
                                className={`w-full p-2 rounded-lg ${isAutoMode ? 'bg-red-500' : 'bg-green-500'} text-white font-semibold`}
                            >
                                {isAutoMode ? 'Stop Auto Loop' : 'Start Auto Loop'}
                            </button>
                            {isAutoMode && <p className="text-xs opacity-80 mt-1">Cycling conditions + time fast!</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
