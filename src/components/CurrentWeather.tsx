import React from 'react';
import { WeatherData } from '../types/weather';
import { degreesToDirection } from '../utils/functional';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
    weatherData: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData }) => {
    return (
        <div className="glass h-full rounded-3xl p-6 flex flex-col gap-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="relative">
                        <WeatherIcon
                            condition={weatherData.current.weather.condition}
                            className="text-8xl drop-shadow-xl floating"
                        />
                    </div>

                    <div>
                        <h2 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
                            {Math.round(weatherData.current.temp)}°
                        </h2>
                        <p className="text-2xl capitalize opacity-90">
                            {weatherData.current.weather.description}
                        </p>
                    </div>
                </div>
                <p className="text-xl opacity-80 glass px-4 py-2 rounded-full">
                    {weatherData.location.city}, {weatherData.location.country}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
                {[
                    {
                        icon: '💨',
                        title: 'Wind',
                        value: `${weatherData.current.wind_speed} km/h ${degreesToDirection(weatherData.current.wind_deg)}`,
                        style: { transform: `rotate(${weatherData.current.wind_deg}deg)` }
                    },
                    {
                        icon: '💧',
                        title: 'Humidity',
                        value: `${weatherData.current.humidity}%`
                    },
                    {
                        icon: '🌅',
                        title: 'Sunrise',
                        value: new Date(weatherData.current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    },
                    {
                        icon: '🌇',
                        title: 'Sunset',
                        value: new Date(weatherData.current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    },
                    {
                        icon: '🌧️',
                        title: 'Precipitation',
                        value: `${weatherData.current.precip} mm`
                    },
                    {
                        icon: '📊',
                        title: 'Pressure',
                        value: `${weatherData.current.pressure} hPa`
                    }
                ].map((item, index) => (
                    <div key={index} className="glass p-4 rounded-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl" style={item.style || {}}>{item.icon}</span>
                            <div>
                                <p className="font-medium opacity-80">{item.title}</p>
                                <p className="text-lg">{item.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrentWeather;