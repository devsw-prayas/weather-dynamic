import React from 'react';

const WEATHER_ICONS = {
    clear: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    thunderstorm: '⚡',
    foggy: '🌫️',
    'partly-cloudy': '⛅'
} as const;

type WeatherCondition = keyof typeof WEATHER_ICONS;

interface WeatherIconProps {
    condition: WeatherCondition;
    className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
                                                            condition,
                                                            className = 'text-4xl'
                                                        }) => (
    <span className={`${className} drop-shadow-lg`}>
    {WEATHER_ICONS[condition] || WEATHER_ICONS.clear}
  </span>
);