import React from 'react';
import { WeatherData } from '../types/weather';
import Sidebar from './Sidebar';
import CurrentWeather from './CurrentWeather';
import { motion} from 'framer-motion';
import {getAlertGradient, getAlertTextColor} from "../utils/functional.tsx";
import DynamicBackground from "./DynamicBackground.tsx";
import LightningFlash from "../vfx/LightningEffect.tsx";

interface LandingProps {
    weatherData: WeatherData | null;
}

const Landing: React.FC<LandingProps> = ({ weatherData }) => {

    // Show loading screen if data is not ready
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
                    animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    Loading weather data...
                </motion.div>
            </motion.div>
        );
    }

    const condition = weatherData.current.weather.condition.toLowerCase();
    return (
        <DynamicBackground
            condition={condition}
            sunrise={weatherData.current.sunrise}
            sunset={weatherData.current.sunset}
            currentTime={weatherData.current.dt}
        >
            <div className="relative z-10 flex h-full p-4 gap-4">
                <Sidebar weatherData={weatherData} />
                <div className="flex-1 flex flex-col gap-4">
                    {weatherData.alerts.length > 0 && (
                        <motion.div
                            className="glass p-4 rounded-xl bg-red-500/20 flex items-center justify-between"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <p className={`text-lg font-bold bg-gradient-to-r ${getAlertGradient(condition)} bg-clip-text text-transparent`}>
                                {weatherData.alerts[0].title}
                            </p>
                            <p className={`text-md font-semibold opacity-80 ${getAlertTextColor(condition,)}`}>
                                {weatherData.alerts[0].description}
                            </p>
                        </motion.div>
                    )}
                    <CurrentWeather weatherData={weatherData} />
                </div>
            </div>
            {weatherData.current.weather.condition.toLowerCase().includes("thunderstorm")  &&
                <LightningFlash/>
            };
        </DynamicBackground>
    );
};

export default Landing;
