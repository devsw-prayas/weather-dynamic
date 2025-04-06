import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import { WeatherData } from './types/weather';

const App: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    useEffect(() => {
        const mockData: WeatherData = {
            location: {
                city: 'New York',
                country: 'US',
                timezone: 'America/New_York',
                lat: 40.7128,
                lon: -74.0060
            },
            current: {
                temp: 22,
                feels_like: 24,
                precip: 1.5,
                wind_speed: 15,
                wind_deg: 320,
                wind_gust: 20,
                sunrise: Date.now() / 1000 - 18000,
                sunset: Date.now() / 1000 + 5400,
                humidity: 65,
                pressure: 1012,
                dew_point: 16,
                aqi: 42,
                dt: Date.now() / 1000,
                weather: {
                    main: 'Clear',
                    description: 'clear sky',
                    icon: '01d',
                    condition: 'thunderstorm'
                },
            },
            hourly: Array.from({ length: 24 }, (_, i) => ({
                dt: Date.now() / 1000 + 3600 * (i + 1),
                temp: 22 - i * 0.5,
                precip: i > 12 ? Math.random() * 3 : 0,
                wind_speed: 10 + Math.random() * 10,
                wind_deg: 300 + Math.random() * 40,
                wind_gust: 15 + Math.random() * 10,
                humidity: 50 + Math.random() * 30,
                pop: i > 12 ? Math.random() * 0.7 : 0,
                pressure: 1010 + Math.random() * 5,
                dew_point: 14 + Math.random() * 2,
                weather: {
                    main: i > 12 ? 'Rain' : 'Clear',
                    description: i > 12 ? 'light rain' : 'clear sky',
                    icon: i > 12 ? '10d' : '01d',
                    condition: i > 12 ? 'rainy' : 'clear'
                },
            })),
            daily: [
                {
                    dt: Date.now() / 1000 + 86400,
                    temp: { min: 18, max: 25 },
                    precip: 2,
                    wind_speed_max: 18,
                    wind_gust_max: 25,
                    sunrise: Date.now() / 1000 + 68400,
                    sunset: Date.now() / 1000 + 91800,
                    humidity_min: 55,
                    humidity_max: 75,
                    pressure: 1013,
                    moon_phase: 'Waxing Crescent',
                    summary: 'Sunny but sneaky showers',
                    weather: {
                        main: 'Rain',
                        description: 'light rain',
                        icon: '10d',
                        condition: 'rainy'
                    }
                },
                // Additional days...
            ],
            alerts: [{
                title: 'Thunderstorm Warning',
                description: 'Hide your cats—storms incoming!'
            }],
            pollen: 'High',
            last_updated: Date.now() / 1000 - 300,
        };

        setTimeout(() => setWeatherData(mockData), 800);
    }, []);

    useEffect(() => {
        const preventZoom = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };

        const preventKeyZoom = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                (e.key === '=' || e.key === '-' || e.key === '+' || e.key === '0')
            ) {
                e.preventDefault();
            }
        };

        window.addEventListener('wheel', preventZoom, { passive: false });
        window.addEventListener('keydown', preventKeyZoom);

        return () => {
            window.removeEventListener('wheel', preventZoom);
            window.removeEventListener('keydown', preventKeyZoom);
        };
    }, []);

    return (
        <div className="App h-full">
            <Landing weatherData={weatherData} />
        </div>
    );
};

export default App;
