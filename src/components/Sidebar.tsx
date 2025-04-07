import React from 'react';
import { WeatherData } from '../types/weather';
import {getLocationGradient, getTextColorByCondition} from '../utils/functional';

interface SidebarProps {
    weatherData: WeatherData;
}

const Sidebar: React.FC<SidebarProps> = ({ weatherData }) => {
    const locationGradient = getLocationGradient(weatherData.current.weather.condition);
    const textColor = getTextColorByCondition(weatherData.current.weather.condition);
    return (

        <div className="h-full glass rounded-3xl p-6 flex flex-col gap-6 backdrop-blur-xl">
            <div className="flex-1 flex flex-col gap-6">
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${locationGradient} text-transparent bg-clip-text`}>
                    {weatherData.location.city}
                </h2>

                <p className={`text-xl font-semibold ${textColor}`}>
                    {weatherData.location.country}
                </p>
                <div className="glass p-4 rounded-xl">
                    <p className={`text-sm opacity-80 font-semibold
                    ${weatherData.current.weather.condition == "snowy" ? "text-black" : "text-white"}`}>
                        {weatherData.location.lat}°N, {weatherData.location.lon}°E
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    className={`w-full glass p-4 rounded-xl hover:bg-white/15 transition-all text-left flex items-center gap-3
                    ${weatherData.current.weather.condition == "snowy" ? "text-black" : "text-white"} font-bold`}>
                    <span className="text-xl">📍</span>
                    <span>Current Location</span>
                </button>
                <button className={`w-full glass p-4 rounded-xl hover:bg-white/15 transition-all text-left flex items-center gap-3
                ${weatherData.current.weather.condition == "snowy" ? "text-black" : "text-white"} font-bold`}>
                    <span className="text-xl">❤️</span>
                    <span>Saved Locations</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;