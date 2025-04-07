import React from 'react';
import { WeatherData } from '../types/weather';
import {
    degreesToDirection,
    getAQILevelIcon, getGridDescriptionColor, getGridTitleColor, getOverlayButtonTextColor,
    getTempColorGradient,
    getTextColorByCondition, getWeatherDescriptionTextColor
} from '../utils/functional';
import { WeatherIcon } from './WeatherIcon';
import HourlyForecastChart from "./HourlyForecatChart.tsx";
import DailyForecastChart from "./FiveDayForecast.tsx";
import MoonPhaseOverlay from "./MoonPhase.tsx";

interface CurrentWeatherProps {
    weatherData: WeatherData;
}

const isNight = (time : number, sunrise : number , sunset : number) : boolean => {
    return time < sunrise || time > sunset
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData }) => {
    const [activeOverlay, setActiveOverlay] = React.useState('hourly');
    const textColor = getTextColorByCondition(weatherData.current.weather.condition);

    return (
        <div className={`glass h-full w-full rounded-3xl p-6 flex flex-col justify-between backdrop-blur-xl`}>
            {/* Top Section */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-6 items-center">
                    <WeatherIcon
                        condition={weatherData.current.weather.condition}
                        className="text-7xl floating drop-shadow-xl w-30 h-30"
                    />
                    <div>
                        <h2 className={`text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getTempColorGradient(weatherData.current.temp)}`}>
                            {Math.round(weatherData.current.temp)}°
                        </h2>
                        <p className={`text-xl capitalize opacity-90 bg-clip-text bg-gradient-to-r 
                        ${getWeatherDescriptionTextColor(weatherData.current.weather.condition)}`}>
                            {weatherData.current.weather.description}
                        </p>
                        <p className={`text-md font-bold opacity-90 bg-gradient-to-r ${textColor} bg-clip-text`}>
                            Feels like {Math.round(weatherData.current.feels_like)}°
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-end mt-auto gap-6">
                {/* Overlay Panel */}
                <div className="w-[1035px] h-[600px] relative rounded-2xl dark-glass p-4 flex flex-col">
                    {/* Button Bar */}
                    <div className="flex flex-wrap gap-3 items-start justify-start mb-4">
                        {['Moon', 'Hourly', 'Daily'].map((label, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 
                                ${getOverlayButtonTextColor(weatherData.current.weather.condition)} font-medium transition-all`}
                                onClick={() => setActiveOverlay(label.toLowerCase())}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="text-sm overflow-y-auto">
                        {activeOverlay === 'moon' && (
                            <MoonPhaseOverlay selectedPhase={"full_moon"}></MoonPhaseOverlay>
                        )}
                        {activeOverlay === 'hourly' && (
                            <HourlyForecastChart data={weatherData.hourly.slice(0, 12)} sunrise={weatherData.current.sunrise} sunset={weatherData.current.sunset} />
                        )}
                        {activeOverlay === 'daily' && (
                            <DailyForecastChart data={weatherData.daily}></DailyForecastChart>
                        )}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 grid-rows-5 gap-4 w-[520px]">
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
                            icon: '📊',
                            title: 'Pressure',
                            value: `${weatherData.current.pressure} hPa`
                        },
                        {
                            icon: '🔆',
                            title: 'UV Index',
                            value: `${weatherData.current.uv_index}`
                        },
                        {
                            icon: getAQILevelIcon(weatherData.current.aqi),
                            title: 'AQI',
                            value: `${weatherData.current.aqi}`
                        },
                        {
                            icon: '🌧️',
                            title: 'Precipitation',
                            value: `${weatherData.current.precip} mm`
                        },
                        {
                            icon: '🌅',
                            title: 'Sunrise',
                            value: new Date(weatherData.current.sunrise * 1000).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        },
                        {
                            icon: '🌇',
                            title: 'Sunset',
                            value: new Date(weatherData.current.sunset * 1000).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        },
                        {
                            icon: '💨',
                            title: 'Wind Gust',
                            value: `${weatherData.current.wind_gust} Km/h`
                        },
                        {
                            icon: '🌸',
                            title: 'Pollen',
                            value: `${weatherData.pollen}`
                        }
                    ].map((item, index) => (
                        <div key={index}
                             className="glass p-5 rounded-xl w-full h-[80px] flex items-center gap-4 hover:bg-white/15 transition-all">
                            <span className="text-2xl" style={item.style || {}}>{item.icon}</span>
                            <div>
                                <p className={`font-bold opacity-80 text-sm ${getGridTitleColor(weatherData.current.weather.condition,
                                    isNight(weatherData.current.dt, weatherData.current.sunrise, weatherData.current.sunset))}`}>{item.title}</p>
                                <p className={`font-semibold ${getGridDescriptionColor(weatherData.current.weather.condition,
                                    isNight(weatherData.current.dt, weatherData.current.sunrise, weatherData.current.sunset))}`}>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;
