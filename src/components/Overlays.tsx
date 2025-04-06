import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const modalVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 120
        }
    },
    exit: { y: 20, opacity: 0 }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            type: "spring",
            stiffness: 100
        }
    })
};

const BaseOverlay: React.FC<{
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}> = ({ title, children, isOpen, onClose }) => {
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        className="relative z-50 w-full max-w-md max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-white/20">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-3xl w-10 h-10 flex items-center justify-center hover:text-cyan-400 transition-colors rounded-full hover:bg-white/10"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const HourlyOverlay: React.FC<{
    weatherData: WeatherData;
    isOpen: boolean;
    onClose: () => void;
}> = ({ weatherData, isOpen, onClose }) => (
    <BaseOverlay title="Hourly Forecast" isOpen={isOpen} onClose={onClose}>
        <div className="flex overflow-x-auto gap-4 pb-2">
            {weatherData.hourly.slice(0, 24).map((hour, i) => (
                <motion.div
                    key={hour.dt}
                    className="min-w-[140px] h-64 p-4 rounded-2xl text-white flex flex-col items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                >
                    <div className="flex-shrink-0">
                        <WeatherIcon
                            condition={hour.weather.condition}
                            className="text-4xl floating"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between">
              <span className="font-medium">
                {new Date(hour.dt * 1000).toLocaleTimeString([], {hour: '2-digit'})}
              </span>
                            <span className="text-xl font-bold">{Math.round(hour.temp)}°</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="capitalize">{hour.weather.description}</span>
                            <span>💧 {hour.precip.toFixed(1)}mm</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </BaseOverlay>
);

export const DailyOverlay: React.FC<{
    weatherData: WeatherData;
    isOpen: boolean;
    onClose: () => void;
}> = ({ weatherData, isOpen, onClose }) => (
    <BaseOverlay title="7-Day Forecast" isOpen={isOpen} onClose={onClose}>
        <div className="space-y-3">
            {weatherData.daily.map((day, i) => (
                <motion.div
                    key={day.dt}
                    className="glass p-3 rounded-lg"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex justify-between items-center">
            <span className="font-medium">
                {new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'long' })}
            </span>
                        <div className="flex items-center gap-4">
                            <WeatherIcon
                                condition={day.weather.condition}
                                className="text-3xl floating"
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-sm opacity-80">{Math.round(day.temp.min)}°</span>
                                <span className="text-xl font-bold">{Math.round(day.temp.max)}°</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                        <motion.div
                            className="glass p-2 rounded-lg text-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <p>🌧️ {day.precip}mm</p>
                        </motion.div>
                        <motion.div
                            className="glass p-2 rounded-lg text-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <p>💨 {day.wind_speed_max}km/h</p>
                        </motion.div>
                        <motion.div
                            className="glass p-2 rounded-lg text-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <p>💦 {day.humidity_max}%</p>
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </div>
    </BaseOverlay>
);