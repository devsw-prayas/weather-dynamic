import React from 'react';
import { WeatherData } from '../types/weather';
import {degreesToDirection, getLocationGradient} from '../utils/functional';

interface SidebarProps {
    weatherData: WeatherData;
}

const Sidebar: React.FC<SidebarProps> = ({ weatherData }) => {
    const locationGradient = getLocationGradient(weatherData.current.weather.condition);
    return (
        <div className="h-full glass rounded-3xl p-6 flex flex-col gap-6 backdrop-blur-xl">
            <div className="flex-1 flex flex-col gap-6">
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${locationGradient} text-transparent bg-clip-text`}>
                    {weatherData.location.city}
                </h2>

                <p className="text-xl opacity-80">{weatherData.location.country}</p>
                <div className="glass p-4 rounded-xl">
                    <p className="text-sm opacity-80">
                        {weatherData.location.lat}°N, {weatherData.location.lon}°E
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    className="w-full glass p-4 rounded-xl hover:bg-white/15 transition-all text-left flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <span>Current Location</span>
                </button>
                <button className="w-full glass p-4 rounded-xl hover:bg-white/15 transition-all text-left flex items-center gap-3">
                    <span className="text-xl">❤️</span>
                    <span>Saved Locations</span>
                </button>
            </div>

            <div className="flex flex-col gap-3">
                <div className="glass p-4 rounded-xl hover:bg-white/15 transition-all">
                    <p className="flex items-center gap-2">
                        <span className="text-xl">💨</span>
                        <span>Wind: {weatherData.current.wind_speed} km/h {degreesToDirection(weatherData.current.wind_deg)}</span>
                    </p>
                </div>
                <div className="glass p-4 rounded-xl hover:bg-white/15 transition-all">
                    <p className="flex items-center gap-2">
                        <span className="text-xl">🌸</span>
                        <span>Pollen: {weatherData.pollen}</span>
                    </p>
                </div>
                <div className="glass p-4 rounded-xl hover:bg-white/15 transition-all">
                    <p className="text-sm opacity-80 flex items-center gap-2">
                        <span className="text-xl">⏱️</span>
                        <span>Updated: {new Date(weatherData.last_updated * 1000).toLocaleTimeString()}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;