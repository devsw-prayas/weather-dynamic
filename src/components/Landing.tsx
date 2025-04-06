import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import Sidebar from './Sidebar';
import CurrentWeather from './CurrentWeather';
import { HourlyOverlay, DailyOverlay } from './Overlays';
import { getAQIColor } from '../utils/functional';
import { motion } from 'framer-motion';
import LightningFlash from "../vfx/LightningFlash.tsx";

interface LandingProps {
    weatherData: WeatherData | null;
}

const Landing: React.FC<LandingProps> = ({ weatherData }) => {
    const [activeOverlay, setActiveOverlay] = useState<'hourly' | 'daily' | null>(null);

    // Close overlays when weather data changes
    useEffect(() => {
        setActiveOverlay(null);
    }, [weatherData]);

    if (!weatherData) {
        return (
            <motion.div
                className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="text-white text-2xl"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    Loading weather data...
                </motion.div>
            </motion.div>
        );
    }

    const weatherGradient = `weather-bg weather-bg-${weatherData.current.weather.condition}`;

    return (
        <motion.div
            key={weatherGradient}
            className={`h-screen w-screen bg-gradient-to-br ${weatherGradient}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}

        >
            <div className="flex h-full p-4 gap-4">
                <Sidebar weatherData={weatherData} />

                <div className="flex-1 flex flex-col gap-4">
                    {weatherData.alerts.length > 0 && (
                        <motion.div
                            className="glass p-4 rounded-xl bg-red-500/20 flex items-center justify-between"
                            initial={{y: -20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{type: "spring", stiffness: 200}}
                        >
                            <p className="text-lg font-medium">{weatherData.alerts[0].title}</p>
                            <p className="text-md opacity-80">{weatherData.alerts[0].description}</p>
                        </motion.div>
                    )}

                    <CurrentWeather weatherData={weatherData}/>

                    <div className="flex gap-4">
                        <motion.button
                            onClick={() => setActiveOverlay('hourly')}
                            className="glass p-4 rounded-2xl flex-1 flex items-center gap-4 text-left"
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                        >
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData.hourly[0].weather.icon}@2x.png`}
                                alt="Weather icon"
                                className="w-12 h-12"
                            />
                            <div className="flex flex-col">
                                <p className="text-sm opacity-70">Next Hour</p>
                                <p className="text-lg font-bold">
                                    {new Date(weatherData.hourly[0].dt * 1000).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })} · {Math.round(weatherData.hourly[0].temp)}°
                                </p>
                                <p className="text-sm opacity-80 capitalize">{weatherData.hourly[0].weather.description}</p>
                            </div>
                        </motion.button>

                        <motion.button
                            onClick={() => setActiveOverlay('daily')}
                            className="glass p-4 rounded-2xl flex-1 flex items-center gap-4 text-left"
                            whileHover={{scale: 1.02}}
                            whileTap={{scale: 0.98}}
                        >
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData.daily[0].weather.icon}@2x.png`}
                                alt="Weather icon"
                                className="w-12 h-12"
                            />
                            <div className="flex flex-col">
                                <p className="text-sm opacity-70">Today</p>
                                <p className="text-lg font-bold">
                                    {weatherData.daily[0].temp.max}° / {weatherData.daily[0].temp.min}°
                                </p>
                                <p className="text-sm opacity-80 capitalize">{weatherData.daily[0].weather.description}</p>
                            </div>
                        </motion.button>
                    </div>

                    <motion.div
                        className="flex justify-end"
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.3}}
                    >
                        <div
                            className={`glass p-3 px-6 rounded-full ${getAQIColor(weatherData.current.aqi)}/20 flex items-center gap-2`}>
                            <span className="text-lg font-medium">AQI</span>
                            <span className="text-xl font-bold">{weatherData.current.aqi}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <HourlyOverlay
                weatherData={weatherData}
                isOpen={activeOverlay === 'hourly'}
                onClose={() => setActiveOverlay(null)}
            />
            <DailyOverlay
                weatherData={weatherData}
                isOpen={activeOverlay === 'daily'}
                onClose={() => setActiveOverlay(null)}
            />
            {weatherData.current.weather.condition.toLowerCase().includes("thunderstorm") && (
                <LightningFlash />
            )}
        </motion.div>
    );
};

export default Landing;
